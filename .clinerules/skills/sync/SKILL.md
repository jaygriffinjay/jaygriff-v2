---
name: sync
description: "Run the content sync script. Use when the user says 'sync', 'run sync', 'sync content', or similar."
---

# Sync Content

Run the content sync script that syncs markdown and TSX files from `content/md/` and `content/tsx/` into the Turso database.

## Command

```sh
npx tsx --env-file=.env.local src/modules/content/pipeline/sync2.ts 2>&1
```

Run from the project root (`/Users/jay/Dev/jaygriff-v2`).

## What It Does

1. Walks `content/md/` for `.md` files and `content/tsx/` for `.tsx` files, recursively. Anything whose name starts with `_` is skipped.
2. Compares each file's SHA-256 hash against the `content` table in Turso
3. **Unchanged** files are skipped
4. **Modified** files get their hash and `updated_at` updated, with the timestamp prepended to `updated_dates`
5. **Renamed** files (same hash, different path) get their `file_path` updated
6. **New** files are sent through AI metadata generation (`src/modules/content/pipeline/generate-metadata.ts`) and inserted as `draft` status, with `format` set to `md` or `tsx`
7. **Missing** files (a DB row whose `file_path` is gone from disk) are tombstoned to `deleted` status rather than removed
8. **Restored** files (a tombstoned row whose file reappears) are flipped back to `draft`

## Notes

- New content always lands as `draft` and will not appear on the site until its status is changed.
- `sync.ts` is the older markdown-only version of this script. Prefer `sync2.ts`.