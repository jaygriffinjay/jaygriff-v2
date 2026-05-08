---json
{
  "title": "Renaming the new-doc Skill to md-artifact",
  "slug": "renaming-new-doc-to-md-artifact",
  "date": "2026-03-17T02:50:52.460Z",
  "description": "Why we renamed the new-doc skill to md-artifact and tightened up its trigger description.",
  "type": "post",
  "author": [
    "Jay Griffin",
    "Claude Sonnet 3.7"
  ],
  "authorshipNote": "Written collaboratively with Claude Sonnet 3.7",
  "tags": [
    "ai",
    "skills",
    "cline",
    "agents",
    "postmaster"
  ],
  "draft": false
}
---

The `new-doc` Cline skill got a rename today. It's now `md-artifact`.

## Why

The original name and description were too generic. "Create a new markdown document summarizing a conversation or topic" could match almost anything - write a file, save some notes, document some code. The agent was at risk of firing this skill when you just wanted a quick file written somewhere, not a full structured post routed through Postmaster.

The fix was to make the trigger more intentional. `md-artifact` borrows from Anthropic's "artifact" concept - a deliberate, structured output meant to be reviewed and dispatched, not just a file that gets written and forgotten. The description now explicitly says not to use it for general file writing or code tasks.

## What Changed

- Skill directory renamed from `new-doc/` to `md-artifact/`
- Skill name and description updated in `SKILL.md`
- Script path updated to reflect the new directory
- Port reference fixed (was pointing to `localhost:3000`, Postmaster runs on `3333`)
- Removed the instruction to check if the `drafts/` directory exists - it's part of the Postmaster repo, it's always there
- Clarified the body-writing step: read the draft to get the script-generated frontmatter, don't rewrite it, just append the body

## The Naming Logic

The name `md-artifact` is scoped intentionally. If other skills produce artifacts in the future (JSON artifacts, code artifacts, whatever), they'd be `json-artifact`, `code-artifact`, etc. The `md-` prefix keeps this one clearly in its lane.
