---
description: "Use when writing or editing post and doc files in content/tsx/. Covers authoring voice, available components, and why these files differ from app components."
applyTo: "content/tsx/**/*.tsx"
---

# Content Post Authoring

Files in `content/tsx/` are **content**, not components. Each one is a single default-exported function whose body is prose. The route renders it inside a page that already supplies the container, `<H1>`, description, and date from the database.

These files are exempt from the CSS-module rule in `tsx.instructions.md`. There is nowhere to co-locate a module next to a dated content file.

## Voice: never write as the user

**Write in a neutral third-person or explanatory voice. Never write in first person as the user.**

Concretely:

- **Don't use** `I`, `my`, `we`, or `here's why I chose`. Don't write about motivations, instincts, first impressions, preferences, or feelings.
- **Do describe** what the code does, how it's structured, what the constraints are, and what the observable tradeoffs are.

| Don't write | Write |
| --- | --- |
| I added a projects table. | The site has a projects table. |
| I chose SQLite because I wanted something simple. | The database is SQLite. |
| My favorite part is the icon registry. | Icons resolve through a lookup in `icons.ts`. |
| I was tired of editing two files. | The home page and the listing page used separate arrays. |
| I think this is the right tradeoff. | Changing this back means editing one line. |
| We decided to skip validation for now. | There is no validation on this field. |
| This turned out really clean. | The function is twelve lines. |

Write the draft as documentation someone else could have written by reading the code.

## Structure

- **One default export**, named in PascalCase after the title. No named exports.
- **No `meta`, title, date, or description export.** The route reads those from the database; duplicating them in the file creates two sources of truth that drift.
- **Don't write an `<H1>`.** The page renders the title. Start the body at `<H2>`.
- Wrap the body in a fragment (`<>...</>`).

## Components

Import prose components from the typography barrel:

```tsx
import { H2, H3, Paragraph, Bold, Italic, InlineCode, List, ListItem, Blockquote, Link } from "@/components/typography";
```

Also available: `H4`–`H6`, `Small`, `Text`, `Underline`, `Strikethrough`, `Highlight`.

Code blocks come from their own module and take a `language` prop:

```tsx
import { CodeBlock } from "@/components/code-block";

<CodeBlock language="sql">{`SELECT * FROM projects;`}</CodeBlock>
```

Rules:

- **Never use raw HTML tags** (`<p>`, `<h2>`, `<strong>`, `<ul>`, `<code>`). Use the typography components — they carry the site's styling and dark-mode handling.
- **Never set `className`** on content components. If a post seems to need custom styling, that's a signal the typography system is missing a component; raise it rather than inlining Tailwind.
- Use `Link` from the typography barrel for internal links, not `next/link` directly.
- Escape apostrophes in JSX text as `&apos;` and quotes as `&ldquo;`/`&rdquo;` to satisfy lint.

## Accuracy

Only describe what's actually in the codebase. Read the files before writing about them. Don't assert that something is tested, deployed, benchmarked, or in use unless that's been verified — a confident wrong claim in a published post is worse than an omission.

---

Everything above applies to all content. The two sections below cover the two kinds, which are distinguished by the `type` column in the database (`post` or `doc`), not by file path — both live flat in `content/tsx/`. Ask which one is intended if it isn't obvious from the request.

## Posts

Writing for a general reader who arrived from a link and has no context on this codebase.

- Open with what the thing is and why it would matter to someone who has never seen it. Don't open with a file path or a schema.
- A post can be about anything — an idea, a workflow, a piece of writing. It doesn't have to reference this repository at all.
- Keep code incidental. Include a snippet when it's the clearest way to show something, not to prove the work happened.
- Narrative order is fine: what the situation was, what changed, what it means.
- Prefer plain nouns over internal names. Write "the sync script" rather than `sync2.ts` unless the filename is the point.

## Docs

Reference material about this codebase, for the user returning in six months or someone reading the repository.

- Lead with the shape of the thing — the schema, the file layout, the data flow. A reader should be able to skim headings and find the part they need.
- **Name real files, tables, columns, and functions**, and link to files where useful. Precision beats readability here; the reader is looking something up, not being introduced to it.
- Include the exact commands to run, with the full invocation (`npx tsx --env-file=.env.local path/to/script.ts`), not a paraphrase.
- State constraints and gotchas explicitly: what breaks, what's manual, what's assumed. These are the parts worth writing down, and the parts a reader can't recover by skimming the code.
- Document what's *not* wired up. Unfinished edges are the most expensive thing to rediscover.
- Skip narrative. A doc doesn't need an arc, and shouldn't spend paragraphs on framing before reaching the schema.
