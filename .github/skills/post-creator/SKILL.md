---
name: post-creator
description: Creates a new blog/doc post file in content/tsx/. Use this whenever the user asks to create, start, draft, or make a new post, article, or doc page — even if they don't mention a filename, folder, or format. Do NOT write the post file directly with file tools; always run the script below so the filename, date, and location are consistent every time.
---

# Post Creator

Creates a new post file, pre-filled and ready to edit. This skill is deliberately narrow: it does one deterministic thing (make the file, in the right place, with the right name) and stops there. It does not write the post's actual content, edit existing posts, or manage publishing.

## When to use this

Trigger on requests like:
- "Make a post about X"
- "Start a new doc page for Y"
- "I want to write something about Z"

If the user also wants help drafting the body, do that after the file exists. Authoring rules — voice, structure, available components — live in `.github/instructions/content-tsx.instructions.md`, which applies automatically to anything under `content/tsx/`.


## How to use it

1. Determine the post title from the user's request. If they gave an explicit title, use it verbatim. If they only described a topic ("make a post about the new API"), turn that into a short, reasonable title and briefly confirm it back to them in your reply (don't block on approval — just state what you used).
2. From the repo root, run the script using its full path:
   ```
   node .github/skills/post-creator/scripts/new-post.js "<title>"
   ```
   The path above is exact — the script lives next to this SKILL.md, **not** in the repo's top-level `scripts/` directory. Do not shorten it to `scripts/new-post.js`. The script resolves `content/tsx/` from the current working directory, so the working directory must be the repo root even though the script itself is nested.
3. The script prints the full path of the created file on success, or an error on failure (e.g. the file already exists for that title+date).
4. Report the file path back to the user. Don't paste the file's contents back at them unless they ask — they're about to open it themselves.

## What the script does (you don't need to reimplement this)

- Slugifies the title (lowercase, non-alphanumeric → hyphens)
- Uses today's date in `YYYY-MM-DD` format
- Writes to `content/tsx/YYYY-MM-DD-slug.tsx`
- Fills a minimal template:
  ```tsx
  import { Paragraph } from "@/components/typography";

  export default function TitleInPascalCase() {
    return (
      <>
        <Paragraph>Start writing here.</Paragraph>
      </>
    );
  }
  ```
- Refuses to overwrite if a file already exists at that path

The template has no `meta`/title/date export on purpose — the route renders title, description, and date from the database, so duplicating them in the file would be dead code. Import any further components (`H2`, `Bold`, `InlineCode`, `CodeBlock`, etc.) as you write the body.

## Important constraints

- **Always call the script. Never hand-write the post file yourself**, even though you technically could. The whole point of this skill is that the filename/date/path logic lives in one place and never drifts.
- **If the command fails with "Cannot find module", you used the wrong path.** Re-run it with the full `.github/skills/post-creator/scripts/new-post.js` path rather than searching for the file or writing it by hand.
- If the script errors (e.g. file already exists), report the error to the user rather than working around it by picking a different path yourself — a duplicate for the same day/topic usually means the user should be told, not silently routed around.
- If `content/tsx/` doesn't exist yet, the script creates it — you don't need to check or create it first.

## Customizing the template

The template (component tags, default body) is hardcoded in the `buildTemplate` function in `.github/skills/post-creator/scripts/new-post.js`. If the user asks to change what a new post looks like by default, edit that function directly rather than adding template logic to this SKILL.md.