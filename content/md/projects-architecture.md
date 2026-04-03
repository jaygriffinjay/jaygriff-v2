# Projects Architecture

This site hosts all non-commercial work — experiments, tools, personal projects, active builds. When something graduates to a paid/production product it gets its own home (Pig Beach Dev or standalone). Everything else lives here and accumulates.

That means the site needs a real organizing unit. Right now content floats — docs and posts exist without context, and when you're reading one you have no sense of where you are relative to anything else. The fix is Projects as a first-class concept.

---

## The Core Idea

A Project is the parent of everything. Docs, posts, demos, commits, assets — all of it belongs to a project. Nothing is published in isolation.

```
Projects
  jaygriff-v2          ← the site itself, actively documented
  some-cli-tool
  old-experiment       ← archived, still browsable
```

This isn't just an organizational nicety. It's what gives a doc its context. A doc titled "Content Pipeline: Technical Deep Dive" is meaningless without knowing it's the `jaygriff-v2` project. Under a project, it's immediately intelligible.

---

## What Changes

### New `projects` table

Projects need to be first-class DB entities, not just a string column on `content`.

Proposed schema:

```sql
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL, -- URL segment, e.g. "jaygriff-v2"
  name        TEXT NOT NULL,        -- display name, e.g. "jaygriff v2"
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active', -- active | archived | graduated
  color       TEXT,                 -- optional oklch accent color
  icon        TEXT,                 -- emoji or lucide icon name
  url         TEXT,                 -- external URL if graduated
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
)
```

**`status` values:**
- `active` — currently being worked on, shows prominently in sidebar
- `archived` — done or dormant, still browsable but de-emphasized
- `graduated` — shipped commercially, link out to external URL, no content hosted here

### `project_id` on `content` becomes a real foreign key

Currently stubbed as nullable. With the `projects` table it becomes a real reference. Content without a `project_id` should eventually be disallowed — everything belongs somewhere.

### Routes

**Option A — Namespaced routes:** `/projects/jaygriff-v2/docs/[slug]`

**Option B — Flat slugs with project context in UI:** `/docs/[slug]` stays the same, sidebar and page header show the project.

**Recommendation: Option B.** Slugs are globally unique, existing URLs don't break, and project context is a UI concern not a routing concern. Can revisit if projects ever have slug collisions (unlikely).

---

## Sidebar Design

### Expanded

```
jaygriff-v2     ← logo + name, links to homepage

Projects
  ▼ jaygriff-v2    ← auto-expanded because you're currently in it
      Docs
      Posts
  ▶ some-tool
  ▶ old-thing      ← archived, visually de-emphasized

──────────────────
  Theme
  Collapse
```

The active project expands automatically based on the current page's content `project_id`. When you're reading a doc, the sidebar shows the project it belongs to and sibling content types as sub-nav. This solves the "naked doc" problem — you always know where you are and can navigate laterally.

### Collapsed (icon-only)

One icon per project. Tooltip shows project name on hover. Site logo at top, theme + collapse at bottom. Same structure, just compressed.

---

## Content Directory Structure

Move files into project subdirectories. The sync script reads the subdirectory name, resolves it to a `project_id` via DB lookup, and populates the column on every INSERT and UPDATE.

```
content/
  md/
    jaygriff-v2/
      notes.md
      content-pipeline-deep-dive.md
      styling-conventions.md
      admin-auth-plan.md
      market-statistic.md
      projects-architecture.md   ← this file
```

The existing rename detection (hash match) handles the moves — `file_path` updates, slugs are preserved, no broken URLs.

---

## Implementation Order

1. **`scripts/migrate-projects.ts`** — create `projects` table, run once
2. **Seed `jaygriff-v2`** — insert the first project row manually or via a seed script
3. **Restructure `content/md/`** — move all files into `content/md/jaygriff-v2/`
4. **Update sync script** — parse subdirectory name → resolve `project_id` → populate on INSERT/UPDATE
5. **Add `getAllProjects()`** to `src/lib/content.ts` (and a `getProjectBySlug()`)
6. **Rebuild sidebar** — one `SidebarGroup` per project, collapsible, active state driven by current content's `project_id`
7. **Add project context to doc/post pages** — breadcrumb or header line showing which project you're in

---

## What's Not Decided Yet

- **Project overview page** — does `/projects/jaygriff-v2` exist as a route? Obvious answer: yes, a README-style page with description + recent docs/posts.
- **Collapsed sidebar icons** — one icon per project; emoji is fine for now, can upgrade to custom SVGs later
- **Content types per project** — only show types that actually have content. Let the DB drive it rather than hardcoding "every project has Docs and Posts".
- **Cross-project content** — single `project_id` per content item is fine. Not worth solving multi-project tagging.
- **Admin UI** — project management (create, edit, archive) will live at `/admin/projects`, same pattern as content admin planned in `admin-auth-plan.md`.
