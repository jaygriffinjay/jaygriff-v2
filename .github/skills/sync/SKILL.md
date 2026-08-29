---
name: sync
description: "Run the content sync script. Use when the user says 'sync', 'run sync', 'sync content', or similar."
---

# Sync Content

Run the content sync script that syncs markdown files from `content/md/` into the Turso database.

## Command

```sh
npx tsx --env-file=.env.local src/modules/content/pipeline/sync.ts 2>&1
```

Run from the project root (`/Users/jay/Dev/jaygriff-v2`).

## What It Does

1. Walks `content/md/` for all `.md` files
2. Compares each file's SHA-256 hash against the `content` table in Turso
3. **Unchanged** files are skipped
4. **Modified** files get their hash and `updated_at` updated, with the timestamp prepended to `updated_dates`
5. **Renamed** files (same hash, different path) get their `file_path` updated
6. **New** files are sent through AI metadata generation (`src/modules/content/generate-metadata.ts`) and inserted as `draft` status