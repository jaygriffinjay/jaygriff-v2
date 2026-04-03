# Block Model Architecture

## Why the Block Model

The current content pipeline stores raw Markdown as a single string per document. That works for basic rendering but it's a hard ceiling — three major features all require the same thing and none of them are possible without it: **vector search**, **WYSIWYG editing**, and **inline search results (docs SERP)**.

### Feature 1: Docs SERP with Inline Excerpts

The goal is a `/docs` landing page that works like a search engine over your own content. You type a question, you get ranked excerpts — not links to pages, but the actual answer text pulled from the exact location in the doc where it lives.

```
Query: "how do I authenticate a payment intent"

─────────────────────────────────────────────
[Auth > API Keys]

  "Pass your secret key as a Bearer token in the
   Authorization header. Never expose it client-side."

  `Authorization: Bearer sk_live_...`
─────────────────────────────────────────────
[Payments > Payment Intents]

  "The PaymentIntent must be created server-side.
   Pass client_secret to the frontend..."
─────────────────────────────────────────────
```

This requires:
- Chunking content at block granularity (paragraph, heading, code block, etc.)
- Embedding each chunk individually
- Retrieving top-N relevant blocks and rendering them in-place with their doc context

You cannot do this against a raw Markdown string. The chunk *is* the block.

### Feature 2: WYSIWYG Editing

Editing a Markdown string requires either a raw text editor or a parse → render → serialize round-trip on every keystroke. Both are bad. WYSIWYG requires the document to already be structured data — each block is a discrete row that can be read, mutated, reordered, or deleted independently.

The editor (Tiptap) reads blocks, writes blocks. No serialization layer between the editor state and the database.

### Feature 3: MD Ingest Still Works

The file-based pipeline doesn't go away — it changes what it does after reading the file. AI writes a `.md` file, you drop it in `content/md/[project]/`, the sync script:

1. Parses MD into a block tree using `remark`
2. Inserts one row per block into the `blocks` table
3. Embeds each block and stores the vector

The `.md` file is a write interface, not the canonical store. Local editing, AI authoring, and git history all still work.

---

## Schema

### `documents` table

Replaces the current `content` table. Stores document-level metadata only — no content.

```sql
CREATE TABLE documents (
  id           TEXT PRIMARY KEY,
  project_id   TEXT,
  slug         TEXT UNIQUE NOT NULL,
  file_path    TEXT,
  title        TEXT,
  description  TEXT,
  type         TEXT,    -- 'doc' | 'post'
  status       TEXT,    -- 'draft' | 'published'
  tags         TEXT,    -- JSON array
  created_at   TEXT,
  updated_at   TEXT
);
```

### `blocks` table

Each block is a typed node in the document tree.

```sql
CREATE TABLE blocks (
  id          TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,   -- 'heading' | 'paragraph' | 'code' | 'list' | 'listitem' | 'blockquote' | 'image' | 'divider'
  content     TEXT,            -- JSON: { text?, lang?, level?, items?, url?, alt? }
  position    REAL NOT NULL,   -- fractional indexing for reorder without renumbering
  parent_id   TEXT,            -- for nested blocks (listitem inside list)
  created_at  TEXT,
  updated_at  TEXT
);
```

**Fractional indexing** for `position`: new blocks get the midpoint between neighbors (`(a + b) / 2`). Reorder never requires updating all sibling positions. Rebalance only when precision runs out (rare).

### `block_embeddings` table

Separate from blocks to keep the main query path fast. Join only when doing vector search.

```sql
CREATE TABLE block_embeddings (
  block_id   TEXT PRIMARY KEY REFERENCES blocks(id) ON DELETE CASCADE,
  embedding  F32_BLOB(1536)  -- OpenAI text-embedding-3-small dimensions
);

CREATE INDEX block_embeddings_idx ON block_embeddings
  USING libsql_vector_idx(embedding);
```

Turso supports vector search natively via the `libsql-vector` extension — no separate vector DB needed.

---

## Block Types

```ts
type BlockType =
  | 'heading'     // { level: 1-6, text: string }
  | 'paragraph'   // { text: string }  (supports inline marks via spans)
  | 'code'        // { lang: string, text: string }
  | 'blockquote'  // { text: string }
  | 'list'        // { ordered: boolean } — children are listitems
  | 'listitem'    // { text: string }
  | 'image'       // { url: string, alt: string, caption?: string }
  | 'divider'     // {}
  | 'callout'     // { icon: string, text: string, variant: 'info'|'warn'|'danger' }
```

Inline formatting (bold, italic, code, links) lives inside the `text` field as a portable inline format — either plain Markdown inline syntax or a small JSON span model.

---

## MD → Blocks Parser

The ingest script replaces raw content storage with a block parse step.

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import type { Root, Node } from 'mdast'

function mdToBlocks(markdown: string): BlockInsert[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root
  const blocks: BlockInsert[] = []
  let position = 1.0

  for (const node of tree.children) {
    const block = nodeToBlock(node, position)
    if (block) {
      blocks.push(block)
      position += 1.0
    }
  }

  return blocks
}
```

Each `mdast` node maps 1:1 to a block type. Lists become a `list` block with `listitem` children (via `parent_id`).

---

## Rollout Plan

### Phase 1 — Schema migration

1. Create `documents` table (mirrors current `content` table minus raw content)
2. Create `blocks` table
3. Create `block_embeddings` table with vector index
4. Migrate existing `content` rows → `documents` rows (copy metadata, discard raw content field)

### Phase 2 — Ingest rewrite

1. Update `scripts/sync-content.ts`:
   - On new file: insert `document` row + parse MD → insert `block` rows
   - On changed file: diff blocks (or nuke + reinsert for simplicity)
   - On renamed file: update `file_path` only, blocks untouched
2. Add embedding step: after block insert, call `text-embedding-3-small` per block, store in `block_embeddings`
3. Restructure `content/md/` → `content/md/[project]/` (extract `project_id` from subdir)

### Phase 3 — Render layer

1. `getDocumentBySlug(slug)` — fetches `document` + ordered `blocks`
2. `BlockRenderer` component — maps block type → React component
3. `CodeBlock` with Shiki syntax highlighting
4. Replace current `MarkdownRenderer` (react-markdown) with `BlockRenderer`

### Phase 4 — Docs SERP

1. `/docs` landing page with search input
2. API route: vector search over `block_embeddings` → return top-N blocks with document context
3. Render results as inline excerpts with source badges and doc links

### Phase 5 — WYSIWYG editor

1. Install Tiptap core + minimal extensions
2. Write Tiptap ↔ blocks adapter (load: blocks → Tiptap JSON doc, save: Tiptap JSON → block upserts)
3. Admin-gated editor route
4. Live save on mutation (debounced)

---

## What Stays the Same

- `project_id` design — same concept, now on `documents` instead of `content`
- Sidebar shape — still flat (Home / Posts / Docs / Projects)
- Breadcrumb filter for project context
- File-based authoring workflow — `.md` files still work, ingest just does more
- Turso as the only DB — vectors live there too

---

## What Doesn't Make Sense Without Block Model

| Feature | Possible without? |
|---|---|
| WYSIWYG editing | No |
| Vector search | No |
| Inline excerpt results | No |
| Syntax highlighting (Shiki) | Yes, but awkward |
| Block reordering / drag | No |
| Callout / rich block types | No |
| Per-block AI suggestions | No |

The block model is the unlock. Everything interesting branches from it.
