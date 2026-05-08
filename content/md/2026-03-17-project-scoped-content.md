---json
{
  "title": "Project-Scoped Content Needs to Be a Thing",
  "slug": "project-scoped-content",
  "date": "2026-03-17T03:08:43.251Z",
  "description": "Test docs and demo artifacts are cluttering the front page because there's no way to scope content to a project automatically.",
  "type": "post",
  "author": "Jay Griffin",
  "tags": [
    "content",
    "metadata",
    "projects",
    "roadmap",
    "site-architecture"
  ],
  "draft": false
}
---

Right now my front page has "Puppies Are Just the Best," "I Love Kittens," and "Test Doc for Fun" sitting right alongside actual posts. They're not spam. They're test artifacts I made while building out the md-artifact workflow and Cline skills. But without any context, they just look like weird filler content that somehow made it to production.

The fix isn't to manually hide them or delete them. The fix is a feature that doesn't exist yet: **project-scoped content**.

## The Problem

When I create a test doc to validate a workflow, that doc is inherently tied to a project. It's not a standalone post for general readers. It's a demo artifact, a dev log, a proof-of-concept. It belongs *inside* the context of whatever project it was created for.

But right now, all content goes to the same pool. Everything shows up on the front page. There's no way to say "this belongs to the Postmaster project" and have the site automatically treat it differently.

## What I Actually Want

The `projectId` metadata field already exists in the content schema. It's just not doing anything yet. What it *should* do:

1. **Exclude project-scoped content from the main feed.** If a doc has a `projectId`, it shouldn't show up on the front page or in the general posts list. It's not a public post, it's a project artifact.

2. **Auto-surface it on the project page.** Each project page should have a section that queries for all content with a matching `projectId` and renders it there. No manual linking. Just tag it and it shows up in the right place.

3. **Still be accessible by URL.** The doc should still have its own page and be linkable. It just shouldn't be promoted in the main feed.

## Why This Matters

This is the difference between a content system that scales and one that requires constant manual curation. Right now, every time I create a test doc or a dev note tied to a project, I have to either delete it, hide it, or accept that it's going to look weird on the front page.

With project-scoped content, I can create freely. Test docs, changelogs, design notes, demo artifacts, all of it can live in the content system without polluting the main feed. The metadata does the routing.

## The Features This Unlocks

This is really two features working together:

- **Content filtering by `projectId`** on the main feed (exclude anything with a projectId set)
- **Project pages that aggregate their own content** by querying for matching projectId

Both are already on the roadmap. This post is just me making the case for why they're not nice-to-haves. They're load-bearing. The content workflow I'm building actively produces artifacts that need a home, and right now that home doesn't exist.
