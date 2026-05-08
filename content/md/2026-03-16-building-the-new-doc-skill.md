---json
{
  "title": "Building the new-doc Skill",
  "slug": "building-the-new-doc-skill",
  "date": "2026-03-16T23:08:12.907Z",
  "description": "How we built a Cline skill for creating structured markdown posts, and the small fixes we made along the way.",
  "type": "post",
  "author": [
    "Jay Griffin",
    "Claude Sonnet 4.6"
  ],
  "authorshipNote": "Written collaboratively with Claude Sonnet 4.6",
  "tags": [
    "ai",
    "skills",
    "cline",
    "agents",
    "markdown"
  ]
}
---

The `new-doc` skill is a small but complete workflow for creating structured markdown posts on this site. It started as a simple idea: instead of manually writing frontmatter every time, let an agent handle it.

## What It Does

The skill has two main pieces: a Node script and a SKILL.md that tells Cline how to use it.

The script (`create-doc.js`) takes CLI flags, validates them against a Zod schema that mirrors the `PostMeta` TypeScript interface, fills in defaults, and writes a file with `---json` frontmatter. The agent then reads that file and appends the actual body content. Two steps, clean separation of concerns.

## What We Fixed Along the Way

A couple things got cleaned up during the build:

**Removed `--help`** - The original script had a full help block documenting every flag. Useful for a human running it manually, but redundant here since the SKILL.md already covers everything and the agent reads that instead. One less thing to keep in sync.

**Fixed the ISO date** - The date field was being constructed by taking the date portion of `toISOString()` and stapling `T00:00:00Z` onto it. Technically valid ISO 8601, but fake. Switched it to just use `new Date().toISOString()` directly for a real timestamp. The date string for the filename is then derived from that.

## The Workflow

The multi-step nature of the skill is worth noting. The script owns frontmatter creation and validation. The agent owns content writing. They hand off via the filesystem: script creates the file, agent reads it back, agent rewrites it with the body appended. A little roundabout, but it keeps the validation logic in one place and lets the agent focus on writing.

It's a good pattern for any skill that needs both structured data and freeform content.
