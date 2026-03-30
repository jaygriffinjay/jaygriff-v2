## Architecture

**Filesystem** — source of truth for content. `.md` files sit in `src/content/docs/`. That's it. No frontmatter required (though it's allowed as an override).

**Turso** — source of truth for the index. Every doc gets a record with slug, title, description, tags, file path, status, and more. The site queries Turso at runtime for listings, search, and tag-based related docs.

**Sync script** — the bridge. Diffs the filesystem against Turso, finds new/changed files, runs the AI metadata generator on them, and upserts records. Run manually or on build.

**AI metadata generator** — reads the raw `.md` content and produces a structured metadata object: title, slug, description, and tags. Runs only on new or changed files.

**Dynamic route** — `/docs/[slug]`. Looks up the slug in Turso to get the file path, reads that file, and renders it with the custom markdown renderer.

---

## Turso Schema

```sql
CREATE TABLE docs (
  id               TEXT PRIMARY KEY,           -- uuid v4, crypto.randomUUID()
  slug             TEXT UNIQUE NOT NULL,
  file_path        TEXT,                       -- relative to repo root, e.g. src/content/docs/foo.md. NULL for 'cool' entries (no file)
  content_hash     TEXT,                       -- sha256 of file content. NULL for 'cool' entries (no file to hash)
  title            TEXT NOT NULL,
  description      TEXT,
  type             TEXT DEFAULT 'doc',         -- post | doc | cool
  -- post/doc: file_path + content_hash required, source_url optional
  -- cool: source_url required, file_path + content_hash null (no file, inserted directly into DB)
  -- constraints enforced in app code via Zod discriminated union, not DB NOT NULL
  status           TEXT DEFAULT 'published',  -- published | draft | archived
  authors          TEXT NOT NULL,             -- JSON array of author names, always array
  authorship_note  TEXT,                      -- optional tooltip explaining authorship context
  tags             TEXT,                      -- JSON array of lowercase tag strings
  updated_dates    TEXT,                      -- JSON array of ISO dates, most recent first
  thumbnail        TEXT,                      -- R2 URL for listing/OG image
  images           TEXT,                      -- JSON array of R2 URLs for inline article images
  project_id       TEXT,                      -- associated project identifier
  feature          TEXT,                      -- associated feature within the project
  source_url       TEXT,                      -- external source link
  commit_hash      TEXT,                      -- for doc:commit type, links to GitHub commit
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
```

Related docs are derived at query time via shared tags — no manual slug list needed.

---

## Sync Script

**Location:** `scripts/sync-docs.ts`  
**Run via:** `npm run sync-docs`

### Steps

1. Walk `src/content/docs/**/*.md` and collect `{ filePath, contentHash }` for each file.
2. Query Turso for all existing `{ id, slug, file_path, content_hash }` records.
3. Diff — four cases:
   - **New file, no hash match anywhere** → run AI generator, create record (including `content_hash`)
   - **Known path, same hash** → unchanged, skip
   - **Known path, different hash** → content edited → re-run AI generator for title/description/tags/reading_time only; preserve existing slug
   - **Known hash, different path** → renamed → update `file_path` only, preserve slug and all other metadata
4. For new/changed files, call the AI metadata generator with the appropriate mode (full for new, update-only for edits).
5. Upsert the record into Turso, always writing the current `content_hash`.
6. Log a summary: N added, N updated (content), N renamed, N unchanged.

### Change detection

Hash the file content with SHA-256. If the hash matches the stored `content_hash`, skip. This means the script is safe to run repeatedly with no cost.

### Running on build

Add to `next.config.ts` under `experimental.turbo` or just prepend the build script:

```json
"build": "tsx scripts/sync-docs.ts && next build"
```

---

## AI Metadata Generator

**Location:** `scripts/generate-metadata.ts`  
**Model:** Whatever is available — OpenAI, Anthropic, or local.

### Input

Raw markdown content as a string.

### Output

```ts
type DocMetadata = {
  title: string;
  slug: string;
  description: string;  // one punchy sentence
  tags: string[];       // 3–8 lowercase tags
};
```

### Prompt strategy

Pass the first ~2000 characters of the doc (usually enough to infer everything). Ask for strict JSON output matching the schema above. Validate with Zod before accepting.

### Frontmatter overrides

If the `.md` file has frontmatter, those fields take precedence over AI output. Useful for manually fixing a title or slug without re-running the generator.

### Slug stability

The slug is generated once — on first sync — and never changed by the AI again. Subsequent content edits regenerate title, description, tags, and reading time only. The slug is stable forever unless you explicitly override it via frontmatter, at which point the frontmatter value wins and the record is updated.

---

## Dynamic Route

**Route:** `src/app/docs/[slug]/page.tsx`

```
GET /docs/[slug]
  → query Turso for doc by slug
  → 404 if not found or status !== 'published'
  → read file at doc.file_path
  → render with markdown renderer
  → return page
```

Server Component. No client-side fetching needed.

### Static generation

Use `generateStaticParams` to pre-render all published docs at build time:

```ts
export async function generateStaticParams() {
  const docs = await getAllPublishedDocs(); // queries Turso
  return docs.map((d) => ({ slug: d.slug }));
}
```

With ISR (`revalidate`) or on-demand revalidation, new docs synced to Turso can appear without a full rebuild.

---

## Markdown Renderer

Custom renderer — not `react-markdown` or MDX. The goal is to map each markdown node type to the existing typography components (`H1`, `H2`, `Paragraph`, `Bold`, `InlineCode`, `Blockquote`, `List`, `ListItem`, etc.) so docs automatically pick up the site's design system and theme.

Parse with `unified` + `remark-parse` into an AST, then walk the AST and render each node type to the matching component.

**Location:** `src/components/markdown/`

---

## Directory Layout (New Files)

```
src/
  content/
    docs/               ← .md files live here
  app/
    docs/
      page.tsx          ← docs index (lists all published docs from Turso)
      [slug]/
        page.tsx        ← individual doc page
  components/
    markdown/           ← AST-based renderer
  lib/
    turso.ts            ← Turso client
    docs.ts             ← query helpers (getAllDocs, getDocBySlug, etc.)
scripts/
  sync-docs.ts          ← sync script
  generate-metadata.ts  ← AI metadata generator
```

---

## What's Not In Scope (Yet)

- Full-text search (can add later with a Turso FTS extension or a separate index)
- Doc versioning (file is the version, use git)
- Comments or reactions
- Private/auth-gated docs
- Categories beyond tags
- Code block DB extraction (see Code Blocks section below)

---

## Code Blocks

Code blocks stay in the MD file as fenced code blocks — no extraction to DB, no write-back, no tokens. MD doesn't have the JSX escaping problem that motivated extraction on the old site.

### Meta string attributes

The fenced code block meta string carries the extra attributes the renderer needs:

~~~
```typescript title="For Loop" filename="examples/for-loop.ts" caption="Basic iteration over an array"
const items = [1, 2, 3];
for (const item of items) {
  console.log(item);
}
```
~~~

Supported attributes: `title`, `filename`, `caption`. The renderer parses the meta string and passes them to the `CodeBlock` component. Standard tools (GitHub, VS Code) ignore the meta string and still syntax-highlight correctly — the file stays portable.

### AI writes the meta strings

You don't write these manually. The AI that writes the article writes the meta strings too. Instruct it to always include `title`, `filename`, and `caption` on every code block.

### Future: shared snippet library

If you ever want reusable snippets referenced across multiple docs (JSX articles mainly), that's when the `{{codeblock:uuid}}` extraction pattern makes sense. The sync script would extract fenced blocks, store them in a `code_blocks` table, and write back tokens. Not needed for MD-first workflow.

---

## Future: Block Model Migration Path

MD is just a serialization of a block tree. Every remark parser already converts it to an AST that maps directly to block types: `## heading` → `heading_2`, `- item` → `bulleted_list_item`, etc.

When block-native storage becomes desirable, the migration path is:
1. Run each `.md` file through remark once during sync
2. Store the block JSON in Turso alongside (or instead of) the raw MD
3. Renderer stays the same — it already maps node types to typography components
4. Authoring surface evolves separately (still MD files, or eventually a block editor)

The renderer is the stable interface. The source format is what can evolve.

