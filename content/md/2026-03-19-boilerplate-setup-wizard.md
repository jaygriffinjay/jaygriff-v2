---json
{
  "title": "Boilerplate Setup Wizard: Design Doc",
  "slug": "boilerplate-setup-wizard",
  "date": "2026-03-19T08:34:15.297Z",
  "description": "Architecture and UX plan for a standalone CLI tool that scaffolds new projects from the boilerplate via a web UI wizard.",
  "type": "doc",
  "author": [
    "Jay Griffin",
    "Claude Sonnet 3.7"
  ],
  "authorshipNote": "Planned collaboratively with Claude during a boilerplate maintenance session.",
  "tags": [
    "boilerplate",
    "dx",
    "tooling",
    "next-js",
    "planning",
    "cli"
  ],
  "draft": false
}
---

## The Idea

Every time you clone the boilerplate, you spend the first 20 minutes doing the same manual stuff: rename the project, swap the favicon, delete the example pages you don't need, set up your agent rules file, maybe add prettier, maybe not. It's not hard but it's friction, and friction compounds.

The fix: a standalone CLI tool — basically your own `create-next-app`. Run one command, a web UI wizard opens, you make your choices, and a fully configured project is generated in a new directory. No cloning, no manual cleanup, no fighting dependencies.

---

## Architecture

This is a **separate repo/package** from the boilerplate itself. Three pieces:

**1. `cli.js` — the entry point**

You run `npx create-jay-app my-project`. The CLI:

- Clones the boilerplate into `./my-project`
- Starts a local Vite dev server + Express/Hono server
- Opens the browser to the wizard UI
- Waits for the wizard to complete
- Shuts everything down

**2. `ui/` — Vite + React SPA**

The wizard UI. Full web app — color pickers, file uploads, drag-and-drop, live previews. Not a CLI prompt. Runs on `localhost:4321` (or similar) and only exists for the duration of setup.

**3. `server.js` — local Express/Hono server**

Runs alongside Vite. The SPA calls it to apply config to the cloned project directory. Handles all filesystem operations: writing files, merging `package.json`, running `npm install`.

**Why not Next.js for the UI?** Vite starts in ~300ms. Next takes 2-3 seconds. For a local dev tool, that matters. No server components needed — it's just a React app talking to a local server.

---

## Template Composition (not removal)

This is how `create-react-app`, `create-t3-app`, and every other serious scaffolding tool works. Instead of one big boilerplate you strip down, you have a collection of partial template directories that get merged together.

```
templates/
  core/                # always included: Next.js, Tailwind, shadcn, typography system
  with-examples/       # the example pages
  with-prettier/       # .prettierrc + prettier dep
  with-cline/          # .clinerules template
  with-cursor/         # .cursorrules template
  with-eslint-strict/  # stricter ESLint config
```

Based on wizard choices, the server script:

1. Copies `core/` into the new project directory
2. Copies each selected template on top (merging directories)
3. Deep-merges all `package.json` files into one
4. Runs `npm install` once at the end

**Why this beats removal:**

- No dependency graph problems — you never have to know what imports what
- No uninstalling — just don't include what you don't want
- Predictable — you know exactly what's in each template
- Maintainable — update a template once, all future projects get it
- Battle-tested — it's the pattern every major scaffolding tool uses

---

## Wizard Steps

### Step 1: Project Identity

- App name (writes to `config.ts`, `layout.tsx` title)
- Description (writes to `config.ts`, `layout.tsx` description)
- Author name (writes to `config.ts`, used in generated files)

### Step 2: Branding

- Favicon: emoji picker or upload a file (saves to `public/favicon.ico`, updates `layout.tsx`)
- Logo: optional file upload (saves to `public/logo.*`)
- Primary color: color picker (writes oklch value to `globals.css` `:root`)

### Step 3: Optional Templates

Checkboxes — each maps to a template directory:

- Example pages (`with-examples`)
- Prettier (`with-prettier`)
- Strict ESLint (`with-eslint-strict`)

### Step 4: AI Assistant Setup

- Which agent? (Cline, Cursor, Copilot, none)
- Generate a rules file from template? Or skip?
- If generating: fills in project name, stack, conventions from Step 1

### Step 5: Review + Confirm

- Summary of all choices
- List of templates being merged
- Files that will be created/modified
- "Generate Project" button
- Progress indicator while it runs
- Opens VS Code when done

---

## Server Script: What It Does

```js
applyConfig(projectDir, config) {
  // 1. Copy selected templates into projectDir (merge directories)
  // 2. Deep-merge all package.json files
  // 3. Write config.ts with project identity values
  // 4. Update layout.tsx metadata (title, description, favicon)
  // 5. Write primary color to globals.css :root
  // 6. Write agent rules file if requested
  // 7. Run npm install once
  // 8. Signal wizard UI that setup is complete
}
```

All file writes use Node.js `fs`. Idempotent where possible — check before writing.

---

## Repo Structure

```
create-jay-app/
  cli.js              # entry point, clones boilerplate, starts servers
  server.js           # local Express/Hono, handles fs operations
  ui/                 # Vite + React wizard SPA
    src/
      App.tsx
      steps/
        Identity.tsx
        Branding.tsx
        Templates.tsx
        Agent.tsx
        Review.tsx
  templates/
    core/
    with-examples/
    with-prettier/
    with-cline/
    with-cursor/
    with-eslint-strict/
  scripts/
    apply-config.js   # the actual file writer
    merge-package.js  # deep-merges package.json files
```

---

## UX Notes

- Wizard should feel polished. Think macOS setup assistant, not a dev tool.
- Each step is a full-screen card with a progress indicator at the top.
- All choices have sensible defaults — you can hit Next through everything.
- The review step shows exactly what will be generated.
- After confirm, show a loading state with what's happening ("Merging templates...", "Installing dependencies...").
- On completion, open the project in VS Code automatically.

---

## MVP Scope

1. Identity (name, description, author)
2. Branding (favicon emoji, primary color)
3. Templates (examples yes/no, prettier yes/no)
4. Agent rules (Cline or skip)
5. Review + confirm

That's enough to make every new project feel immediately personalized and cuts the most repetitive manual steps.

---

## Open Questions

- Should the wizard support logo upload in MVP, or defer?
- How does the CLI handle the case where `my-project` directory already exists?
- Should `create-jay-app` be published to npm or just run locally via `node cli.js`?
- Should the generated `.clinerules` be opinionated (based on this stack) or generic?
- Does the boilerplate repo need to change at all, or does it stay as-is and serve as the `core/` template source?
