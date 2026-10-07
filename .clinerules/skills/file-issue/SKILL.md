---
name: file-issue
description: "File an issue, bug, or TODO to the project backlog. Use when the user says 'file an issue', 'add to backlog', 'track this bug', 'make a TODO', or similar."
---

# File Issue

Append a new issue to `content/md/BACKLOG.md`.

## Workflow

1. Read `content/md/BACKLOG.md`.
2. Summarize the user's issue into a concise description — include the relevant file or component name if known.
3. Append `- [ ] <summary>` under the `## Open` section, after the last existing open item.
4. Do NOT move or modify existing items.
5. Confirm to the user what was added.

## Format

```markdown
- [ ] Brief description — `relevant-file.ts` or component name. Additional context if needed.
```

## Rules

- Include file/component references when known.
- Don't create duplicate entries — scan existing items first.
- When the user says to close/complete an issue, move it from `## Open` to `## Done` and change `- [ ]` to `- [x]`.
