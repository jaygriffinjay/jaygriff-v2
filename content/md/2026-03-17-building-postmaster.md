---json
{
  "title": "Building Postmaster: A Local Markdown Draft Editor",
  "slug": "building-postmaster",
  "date": "2026-03-17T01:41:18.734Z",
  "description": "Why I built a local Next.js app to review and dispatch markdown drafts written by AI agents, and the design decisions behind it.",
  "type": "post",
  "author": "Jay Griffin",
  "tags": [
    "postmaster",
    "nextjs",
    "tooling",
    "ai",
    "workflow",
    "personal-tools"
  ],
  "draft": false
}
---

# Building Postmaster: A Local Markdown Draft Editor

I have a Cline skill called `new-doc` that lets an AI agent write a structured markdown post and drop it somewhere on disk. It works well. The problem is that "somewhere on disk" used to be directly into my content directory, with no review step. The agent would get the metadata wrong sometimes — wrong author attribution, wrong type, a tag that made no sense — and I'd have to go find the file and fix it manually.

That's annoying. So I built Postmaster.

## The Problem It Solves

The `new-doc` skill generates markdown files with `---json` frontmatter: a JSON block at the top with structured metadata (title, slug, tags, author, type, etc.), followed by the body. The agent fills this in based on context, and it's usually pretty good, but "usually pretty good" isn't good enough when you're publishing.

What I needed was a review step. A place where the draft lands first, I can look at it, fix anything wrong, and then send it to the right destination. Postmaster is that place.

## What It Does

Postmaster is a local Next.js app that runs on port 3333. When the `new-doc` skill creates a draft, it writes the file to Postmaster's `drafts/` directory and opens the editor in the browser automatically.

The editor is a two-panel layout: metadata form on the left, markdown textarea on the right. You can fix the title, slug, tags, author, type — anything in the frontmatter — without touching the file directly. When you're happy with it, you pick a destination from a combobox (backed by a `destinations.json` file that maps friendly names to absolute paths on disk) and hit Send. The file gets copied to the right place and the draft is cleared.

There's also a home page that lists all current drafts, so if you have a backlog you can work through them.

## Design Decisions

**Local-only, no database.** The drafts are just files. The API routes read and write them directly with Node's `fs` module. No SQLite, no Postgres, no ORM. It's a tool for one person on one machine — a database would be overkill and would add friction.

**`---json` frontmatter instead of YAML.** The `new-doc` skill uses JSON frontmatter because it's easier to generate correctly from a script and easier to parse without a YAML library. It's non-standard but it works fine — you just split on `---json\n` and `\n---\n` and parse the middle as JSON.

**`destinations.json` for routing.** Rather than hardcoding paths or building a settings UI, I just have a JSON file at the project root that maps names to paths. Adding a new destination is one line. The combobox in the UI reads it via an API route and surfaces recent destinations first (stored in localStorage).

**Two-click discard confirmation.** The discard button requires two clicks: first click puts it in a "Sure?" state for 3 seconds, second click actually deletes. No modal, no dialog. Just a stateful button. Simple enough.

**react-hook-form + Zod for the metadata form.** The PostMeta schema is already defined in Zod for the `new-doc` script, so mirroring it in the editor form was straightforward. Validation runs on save and send, with inline error messages.

## What I Tried Before

Before building this, I was just editing the files directly in VS Code. That works, but it means context-switching out of whatever I was doing, finding the file, editing raw JSON frontmatter, and then manually copying the file to the right place. Every time. It's not a lot of friction individually, but it adds up.

I also briefly considered just having the agent write directly to the destination and trusting it to get the metadata right. That lasted about two weeks before I got tired of fixing things.

## Current State

It's an MVP and it works. The core loop — create draft, review in UI, send to destination — is solid. A few things I'd still like to add:

- Markdown preview in the editor (right now it's just a raw textarea)
- Drag-to-reorder or bulk-send for the drafts list
- Maybe a way to create drafts directly from the UI without going through the skill

But honestly, the main workflow is already better than what I had before, and that's enough for now.
