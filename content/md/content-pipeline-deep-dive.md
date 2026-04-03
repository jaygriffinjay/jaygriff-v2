# Content Pipeline: Technical Deep Dive

This doc covers everything built in the content pipeline — the Turso schema, sync script, AI metadata generator, markdown renderer, and route architecture. Written as a reference for understanding code that was built quickly and needs a careful read-through.

---

## Overview

The pipeline has one job: take a `.md` file dropped in `content/md/`, generate metadata for it using AI, store that metadata in Turso, and serve it at a dynamic route with a custom markdown renderer.

The filesystem is the source of truth for content. Turso is the source of truth for metadata and the index. They stay in sync via a script you run manually.

---

## The Turso Schema

File: `scripts/migrate.ts`

Turso is a cloud SQLite database (libsql). One table: `content`. Here's what each column is for:

```sql
id               TEXT PRIMARY KEY     -- UUID v4 via crypto.randomUUID()
slug             TEXT UNIQUE NOT NULL -- URL segment, AI-generated, permanent
file_path        TEXT                 -- relative path from project root, e.g. content/md/notes.md
content_hash     TEXT                 -- SHA-256 of the file content, used for change detection
title            TEXT NOT NULL
description      TEXT                 -- one sentence summary
type             TEXT NOT NULL        -- "post" | "doc" | "cool"
status           TEXT NOT NULL        -- "draft" | "published" | "archived" (default: draft)
authors          TEXT                 -- JSON array of strings, nullable
authorship_note  TEXT
tags             TEXT                 -- JSON array of strings
updated_dates    TEXT                 -- JSON array of ISO timestamps, most recent first
thumbnail        TEXT                 -- Cloudflare R2 object key (not a full URL)
images           TEXT                 -- JSON array of R2 object keys
project_id       TEXT
feature          TEXT
source_url       TEXT                 -- for "cool" entries: the external link
commit_hash      TEXT                 -- for linking to a specific GitHub commit
created_at       TEXT NOT NULL        -- ISO timestamp
updated_at       TEXT NOT NULL        -- ISO timestamp
```

A few design decisions worth understanding:

**Why `file_path` and `content_hash` are nullable:** The `cool` content type (short link/quote posts) has no backing file — it gets inserted directly into the DB. So those columns are nullable at the DB level and the constraint is enforced in app code via Zod discriminated unions (not yet implemented, but that's the plan).

**Why JSON arrays as TEXT:** SQLite has no native array type. Tags, images, updated_dates, and authors are all stored as JSON strings and deserialized in `src/lib/content.ts` via `JSON.parse()`. The `parseRow()` function handles all of this.

**Why slugs are permanent:** The slug is generated once by AI on first sync, stored in the DB, and never regenerated. It becomes the URL. If you rename the file, the sync script detects it as a rename (via hash match) and updates `file_path` only — the slug stays the same, so the URL never breaks.

---

## The Sync Script

File: `scripts/sync-content.ts`

Run with: `npx tsx --env-file=.env.local scripts/sync-content.ts`

Here's the full script:

```typescript
import { createHash } from "crypto";
import { readdirSync, readFileSync } from "fs";
import { join, relative } from "path";
import { db } from "../src/lib/turso";
import { generateMetadata } from "./generate-metadata";

const CONTENT_DIR = join(process.cwd(), "content/md");

function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function walkMd(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMd(full));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

async function sync() {
  const files = walkMd(CONTENT_DIR);
  const now = new Date().toISOString();

  // Build filesystem map: filePath → { content, hash }
  const fsMap = new Map<string, { content: string; hash: string }>();
  for (const abs of files) {
    const rel = relative(process.cwd(), abs);
    const content = readFileSync(abs, "utf-8");
    fsMap.set(rel, { content, hash: hashContent(content) });
  }

  // Load all DB records — build two indexes
  const result = await db.execute(
    "SELECT id, slug, file_path, content_hash, updated_dates FROM content"
  );
  const dbByPath = new Map<string, { id: string; slug: string; hash: string; updatedDates: string[] }>();
  const dbByHash = new Map<string, { id: string; slug: string; path: string }>();
  for (const row of result.rows) {
    const id = row.id as string;
    const slug = row.slug as string;
    const path = row.file_path as string;
    const hash = row.content_hash as string;
    const updatedDates = row.updated_dates ? JSON.parse(row.updated_dates as string) : [];
    if (path) dbByPath.set(path, { id, slug, hash, updatedDates });
    if (hash) dbByHash.set(hash, { id, slug, path });
  }

  let added = 0, updated = 0, renamed = 0, unchanged = 0;

  for (const [filePath, { content, hash }] of fsMap) {
    const existing = dbByPath.get(filePath);

    if (existing) {
      if (existing.hash === hash) {
        unchanged++;
        continue; // State 1: unchanged
      }
      // State 2: content changed — update hash and prepend timestamp
      const updatedDates = JSON.stringify([now, ...existing.updatedDates]);
      await db.execute({
        sql: "UPDATE content SET content_hash = ?, updated_at = ?, updated_dates = ? WHERE id = ?",
        args: [hash, now, updatedDates, existing.id],
      });
      console.log(`updated: ${filePath}`);
      updated++;
      continue;
    }

    const hashMatch = dbByHash.get(hash);
    if (hashMatch) {
      // State 3: renamed — update file_path only, slug preserved
      await db.execute({
        sql: "UPDATE content SET file_path = ?, updated_at = ? WHERE id = ?",
        args: [filePath, now, hashMatch.id],
      });
      console.log(`renamed: ${hashMatch.path} → ${filePath}`);
      renamed++;
      continue;
    }

    // State 4: new file — call Claude, insert row as draft
    const meta = await generateMetadata(content);
    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO content (id, slug, file_path, content_hash, title, description, type, status, tags, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, meta.slug, filePath, hash, meta.title, meta.description, meta.type, "draft", JSON.stringify(meta.tags), now, now],
    });
    console.log(`added: ${filePath} → slug: ${meta.slug} (${meta.type})`);
    added++;
  }

  console.log(`\nSync complete: ${added} added, ${updated} updated, ${renamed} renamed, ${unchanged} unchanged`);
}

sync().catch((err) => { console.error(err); process.exit(1); });
```

### The 4-state diff

For every file in the filesystem map:

**State 1 — Unchanged:** `dbByPath` has the path AND the hash matches. Skip.

**State 2 — Content changed:** `dbByPath` has the path BUT the hash differs. UPDATE `content_hash`, `updated_at`, and prepend the current timestamp to `updated_dates`. Slug and all other metadata are untouched.

**State 3 — Renamed:** `dbByPath` does NOT have the path BUT `dbByHash` has the hash. Same content, new location → UPDATE `file_path` only. This is why the double-map exists: a rename is undetectable if you only index by path.

**State 4 — New:** Neither map has a match. Call Claude, INSERT as `"draft"`.

### What the sync script does NOT do

- It does not delete rows when files are deleted. If you delete a `.md` file, the DB record stays. This is intentional — you'd archive it from the admin UI.
- It does not update title, description, or tags when content changes. Hash changes only update the hash and timestamps. To update metadata you'd need to either re-trigger AI generation manually or edit via the admin UI.

---

## AI Metadata Generation

File: `scripts/generate-metadata.ts`

This is called only for new files (State 4 above).

### Why tool use instead of asking for JSON

The naive approach is to prompt Claude to "return only valid JSON" and then `JSON.parse()` the response. This fails in practice because Claude sometimes wraps JSON in markdown fences (` ```json ... ``` `) or adds an explanation sentence. Parsing breaks.

Tool use is the correct solution. You define a "tool" with a JSON Schema, set `tool_choice: { type: "tool", name: "generate_metadata" }`, and the API guarantees the response is a `tool_use` block with valid JSON in `block.input`. The model cannot emit prose — the API enforces it at the inference layer. The "tool" is fake — it's never actually executed. It's purely a mechanism to force structured output.

Here's the full implementation:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic();

const MetadataSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid slug"),
  description: z.string(),
  tags: z.array(z.string()),
  type: z.enum(["post", "doc"]),
});

export type GeneratedMetadata = z.infer<typeof MetadataSchema>;

const TOOL: Anthropic.Tool = {
  name: "generate_metadata",
  description: "Generate metadata for a piece of content",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "A clear, concise title" },
      slug: { type: "string", description: "URL-friendly slug (lowercase, hyphens only)" },
      description: { type: "string", description: "One punchy sentence summarizing the content" },
      tags: { type: "array", items: { type: "string" }, description: "3-8 lowercase tags" },
      type: { type: "string", enum: ["post", "doc"], description: "post = narrative/opinion, doc = reference/technical" },
    },
    required: ["title", "slug", "description", "tags", "type"],
  },
};

export async function generateMetadata(content: string): Promise<GeneratedMetadata> {
  const preview = content.slice(0, 2000);

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "generate_metadata" },
    messages: [
      {
        role: "user",
        content: `You are a metadata generator for a personal website. Analyze this markdown content and call generate_metadata with the appropriate values.\n\nContent:\n${preview}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "tool_use") as
    | Anthropic.ToolUseBlock
    | undefined;

  if (!block) throw new Error("No tool_use block in response");

  return MetadataSchema.parse(block.input);
}
```

### Zod validation

Even with tool use guaranteeing valid JSON, Zod is still the final gate. The API guarantees JSON structure but not semantic correctness — the slug could come back with uppercase letters (Zod rejects it via the regex), or `type` could be outside the enum. The slug regex `^[a-z0-9]+(?:-[a-z0-9]+)*$` enforces lowercase, hyphen-separated, no leading/trailing hyphens.

Only the first 2000 characters of the file are sent to Claude. This saves tokens and is almost always enough to classify and title a document.

---

## The DB Client

File: `src/lib/turso.ts`

```typescript
import { createClient } from "@libsql/client";

if (!process.env.TURSO_URL) throw new Error("TURSO_URL is not set");
if (!process.env.TURSO_AUTH_TOKEN)
  throw new Error("TURSO_AUTH_TOKEN is not set");

export const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

A singleton `@libsql/client` instance. The two `throw` guards at module level mean if you try to import `db` without env vars set, you get an explicit error immediately — not a cryptic runtime failure later. Imported by both the sync scripts (via `../src/lib/turso`) and the Next.js app (via `@/lib/turso`). In Next.js, this runs server-side only — Server Components, Server Actions, Route Handlers.

---

## Query Helpers

File: `src/lib/content.ts`

This is the only place in the app that talks to Turso. All Next.js pages import from here, never from `turso.ts` directly.

```typescript
import { db } from "./turso";
import { readFileSync } from "fs";
import { join } from "path";

export type ContentRow = {
  id: string;
  slug: string;
  file_path: string | null;
  content_hash: string | null;
  title: string;
  description: string | null;
  type: "post" | "doc" | "cool";
  status: "draft" | "published" | "archived";
  authors: string[] | null;
  authorship_note: string | null;
  tags: string[] | null;
  updated_dates: string[] | null;
  thumbnail: string | null;
  images: string[] | null;
  project_id: string | null;
  feature: string | null;
  source_url: string | null;
  commit_hash: string | null;
  created_at: string;
  updated_at: string;
};

function parseRow(row: Record<string, unknown>): ContentRow {
  return {
    id: row.id as string,
    slug: row.slug as string,
    file_path: (row.file_path as string) ?? null,
    content_hash: (row.content_hash as string) ?? null,
    title: row.title as string,
    description: (row.description as string) ?? null,
    type: row.type as ContentRow["type"],
    status: row.status as ContentRow["status"],
    authors: row.authors ? JSON.parse(row.authors as string) : null,
    authorship_note: (row.authorship_note as string) ?? null,
    tags: row.tags ? JSON.parse(row.tags as string) : null,
    updated_dates: row.updated_dates ? JSON.parse(row.updated_dates as string) : null,
    thumbnail: (row.thumbnail as string) ?? null,
    images: row.images ? JSON.parse(row.images as string) : null,
    project_id: (row.project_id as string) ?? null,
    feature: (row.feature as string) ?? null,
    source_url: (row.source_url as string) ?? null,
    commit_hash: (row.commit_hash as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getContentBySlug(slug: string): Promise<ContentRow | null> {
  const result = await db.execute({
    sql: "SELECT * FROM content WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return parseRow(result.rows[0] as Record<string, unknown>);
}

export async function getAllPublished(type?: ContentRow["type"]): Promise<ContentRow[]> {
  const result = type
    ? await db.execute({
        sql: "SELECT * FROM content WHERE status = 'published' AND type = ? ORDER BY created_at DESC",
        args: [type],
      })
    : await db.execute("SELECT * FROM content WHERE status = 'published' ORDER BY created_at DESC");
  return result.rows.map((r) => parseRow(r as Record<string, unknown>));
}

export function readMarkdownFile(filePath: string): string {
  return readFileSync(join(process.cwd(), filePath), "utf-8");
}
```

### `parseRow()`

All JSON columns are stored as TEXT in SQLite and need to be deserialized. `parseRow()` handles all of this in one place. The `??` operator handles the SQLite `NULL` → JS `null` conversion for nullable fields. JSON columns (`tags`, `authors`, `images`, `updated_dates`) are parsed with `JSON.parse()` guarded by a truthiness check.

### `getContentBySlug(slug)`

Queries by slug, returns a single `ContentRow | null`. Used by the dynamic route pages. Uses a parameterized query — `args: [slug]` — so the value is safely bound, never interpolated into the SQL string.

### `getAllPublished(type?)`

Returns all rows where `status = 'published'`, optionally filtered by type. Used by the listing pages (`/docs`, `/posts`). **Drafts are not returned here** — but they're still accessible via SSR on the detail pages. This is intentional: the listing pages are the editorial gate, not the route itself.

### `readMarkdownFile(filePath)`

Reads the raw markdown from disk using the `file_path` stored in the DB row. Called by the route pages after fetching the row. This is the join point between Turso (metadata) and the filesystem (content).

---

## The Markdown Renderer

File: `src/components/markdown-renderer/MarkdownRenderer.tsx`

Uses `react-markdown` with `remark-gfm` (GitHub Flavored Markdown — tables, strikethrough, task lists). It's a Server Component — no `"use client"` needed since there's no interactivity.

```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import {
  H1, H2, H3, H4, H5, H6,
  Paragraph, Blockquote, List, ListItem,
  InlineCode, Link, Bold, Italic, Strikethrough,
} from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import styles from "./markdown-renderer.module.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(styles.root, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <H1>{children}</H1>,
          h2: ({ children }) => <H2>{children}</H2>,
          h3: ({ children }) => <H3>{children}</H3>,
          h4: ({ children }) => <H4>{children}</H4>,
          h5: ({ children }) => <H5>{children}</H5>,
          h6: ({ children }) => <H6>{children}</H6>,
          p: ({ children }) => <Paragraph>{children}</Paragraph>,
          blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
          hr: () => <Separator className={styles.divider} />,
          ul: ({ children }) => <List>{children}</List>,
          ol: ({ children }) => <List ordered>{children}</List>,
          li: ({ children }) => <ListItem>{children}</ListItem>,
          a: ({ href, children }) => (
            <Link href={href ?? "#"} target={href?.startsWith("http") ? "_blank" : undefined}>
              {children}
            </Link>
          ),
          strong: ({ children }) => <Bold>{children}</Bold>,
          em: ({ children }) => <Italic>{children}</Italic>,
          del: ({ children }) => <Strikethrough>{children}</Strikethrough>,
          img: ({ src, alt }) =>
            typeof src !== "string" ? null : (
              <span className={styles.imageWrapper}>
                <NextImage src={src} alt={alt ?? ""} width={0} height={0} sizes="100vw" className={styles.image} />
                {alt && <span className={styles.imageCaption}>{alt}</span>}
              </span>
            ),
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            const props = (child as React.ReactElement<{ className?: string; children?: React.ReactNode }>)?.props;
            if (!props) return <pre className={styles.pre}>{children}</pre>;
            const lang = /language-(\w+)/.exec(props.className ?? "")?.[1];
            const code = String(props.children ?? "").replace(/\n$/, "");
            return (
              <pre className={styles.pre} data-language={lang}>
                <code>{code}</code>
              </pre>
            );
          },
          code: ({ children }) => <InlineCode>{children}</InlineCode>,
          table: ({ children }) => (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>{children}</table>
            </div>
          ),
          th: ({ children }) => <th className={styles.th}>{children}</th>,
          td: ({ children }) => <td className={styles.td}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

### The `pre` vs `code` distinction

In markdown, a fenced code block renders as `<pre><code class="language-typescript">...</code></pre>`. An inline code span renders as just `<code>`. `react-markdown` gives you separate hooks for both.

The `pre` handler receives the `<code>` element as its child — you cast it to `React.ReactElement` to get at the `props`, then extract the language from `className` (which is `language-{lang}`) and the raw code string from `children`. The trailing newline is stripped with `.replace(/\n$/, "")`. The `code` handler only runs for inline code.

Currently `pre` renders a styled `<pre>` with `bg-muted` applied in the CSS module. Syntax highlighting (token colors) is a future upgrade — `shiki` would slot in here.

### External link detection

```typescript
target={href?.startsWith("http") ? "_blank" : undefined}
```

Any `href` starting with `http` gets `target="_blank"` (opens in new tab). Internal links (`/docs/something`) get normal navigation. Simple and correct for the typical case.

---

## The Routes

### `/docs/[slug]/page.tsx` and `/posts/[slug]/page.tsx`

Both follow the same pattern. Here's the doc route:

```typescript
import { notFound } from "next/navigation";
import { getContentBySlug, readMarkdownFile } from "@/lib/content";
import MarkdownRenderer from "@/components/markdown-renderer/MarkdownRenderer";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import styles from "./doc.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getContentBySlug(slug);

  if (!doc || doc.type !== "doc" || !doc.file_path) notFound();

  const content = readMarkdownFile(doc.file_path);

  return (
    <Container>
      <article className={styles.article}>
        <header className={styles.header}>
          <H1>{doc.title}</H1>
          {doc.description && (
            <Paragraph className={styles.description}>{doc.description}</Paragraph>
          )}
          <Small>
            {new Date(doc.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </Small>
        </header>
        <Separator className={styles.divider} />
        <MarkdownRenderer content={content} />
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  const { getAllPublished } = await import("@/lib/content");
  const docs = await getAllPublished("doc");
  return docs.map((d) => ({ slug: d.slug }));
}
```

Three guard conditions on the fetched row:
1. `!doc` — slug doesn't exist in DB → 404
2. `doc.type !== "doc"` — wrong content type (e.g. slug belongs to a post) → 404
3. `!doc.file_path` — `cool`-type entry with no backing file → 404

**No status gate.** A draft is accessible if you know the URL. Only the listing pages (`/docs`, `/posts`) call `getAllPublished()` which filters on `status = 'published'`. This is intentional — it enables draft preview.

`generateStaticParams` runs at build time to pre-render published content. Unpublished content still works via SSR; it just won't be in the static export.

### `/docs/page.tsx` and `/posts/page.tsx`

Call `getAllPublished(type)` and render a grid of cards. Empty state shows a "Nothing published yet" message. Status `"draft"` content is invisible here.

---

## Running the Pipeline

```bash
# First time only - create the DB table
npx tsx --env-file=.env.local scripts/migrate.ts

# Any time you add/edit/rename .md files
npx tsx --env-file=.env.local scripts/sync-content.ts

# Debug - inspect updated_dates
npx tsx --env-file=.env.local scripts/inspect-dates.ts
```

Required env vars in `.env.local`:
```
TURSO_URL=libsql://...
TURSO_AUTH_TOKEN=...
ANTHROPIC_API_KEY=...
```

---

## What's Not Built Yet

- **Admin UI** — editing title, description, status, tags from a browser. Plan documented in `admin-auth-plan.md`.
- **Syntax highlighting** — `<pre>` blocks render as plain mono text. `shiki` is the plan.
- **Code block meta string parsing** — `title`, `filename`, `caption` attributes on fenced blocks.
- **`cool` content type** — link/quote posts inserted directly into DB, no backing file.
- **Metadata updates on content change** — right now editing a file only updates the hash. Title/description stay as whatever AI generated on first sync. Admin UI will fix this.
- **`generateStaticParams` for drafts** — currently only published content is pre-rendered.
