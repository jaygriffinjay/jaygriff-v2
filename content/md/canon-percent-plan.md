## What Is It?

A personal tracker for consuming your favorite creators' work. Add a creator, ingest their canon, curate what you want, track your progress. Gamified completionism for intentional consumption.

**Core loop:** Browse creators → see % complete → pick something to read/watch → mark done → watch the number go up.

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Creator** | A person or entity whose work you follow (blogger, YouTuber, podcaster, docs maintainer) |
| **Work** | A single piece of content (article, video, episode, doc page) |
| **Canon** | The full set of works by a creator — discovered via sitemap, RSS, scraping, or manual entry |
| **Queue** | Works you've approved/curated from the catalog — the ones you actually want to consume |
| **Progress** | % of queued works marked done, per creator |

## Data Model

### `creators` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | TEXT PK | UUID |
| `name` | TEXT NOT NULL | Display name ("Kent C. Dodds") |
| `url` | TEXT NOT NULL UNIQUE | Homepage URL |
| `description` | TEXT | Why you follow them |
| `image_url` | TEXT | Headshot or avatar |
| `type` | TEXT DEFAULT 'author' | `author` / `docs` / `youtube` / `podcast` / `newsletter` |
| `created_at` | TEXT | When added |

### `works` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | TEXT PK | UUID |
| `creator_id` | TEXT FK | References creators.id |
| `url` | TEXT NOT NULL UNIQUE | Direct link to the work |
| `title` | TEXT NOT NULL | Title of the work |
| `description` | TEXT | Subtitle, excerpt, or scraped summary |
| `status` | TEXT DEFAULT 'candidate' | `candidate` → `queued` → `done` → `dropped` |
| `difficulty` | TEXT | `light` / `medium` / `dense` (optional, user-set) |
| `topics` | TEXT (JSON) | Tags like `["react", "testing", "patterns"]` |
| `note` | TEXT | Your personal annotation |
| `rating` | INTEGER | 1–5, set after reading |
| `read_count` | INTEGER DEFAULT 0 | Times consumed (re-reads/rewatches count) |
| `discovered_at` | TEXT | When ingested from catalog |
| `queued_at` | TEXT | When approved into queue |
| `last_read_at` | TEXT | Last consumption timestamp |

### Indexes

- `idx_works_creator` on `works(creator_id)`
- `idx_works_status` on `works(status)`

## Computed Stats (queries, not stored)

- **Canon %** = `COUNT(status='done') / COUNT(status IN ('queued','done'))` per creator
- **Total works** = all works for a creator
- **Queued** = approved but not yet consumed
- **Re-read favorites** = `ORDER BY read_count DESC, rating DESC`
- **Latest unread** = next queued work by discovered_at

## Ingestion Strategy (priority order)

When you paste a creator's URL, try these in order:

1. **RSS feed** — auto-discover via `<link rel="alternate">` in HTML head. Richest data: title, URL, description, date.
2. **Sitemap** — fetch `/sitemap.xml`. Gives all URLs, sometimes with lastmod dates. No titles (derive from URL path).
3. **llms.txt** — fetch `/llms.txt`. Newer convention, curated page list. Growing adoption.
4. **Scrape links** — fetch the page, extract all internal `<a>` hrefs, dedupe, filter obvious non-content (assets, auth, etc.).

All ingested works start as `candidate`. Approval UI lets you bulk-select which ones to `queue`.

## Pages & Views

### `/canon` — Main page

The hero view. Grid of creator cards.

Each card shows:
- Creator image/avatar
- Name + description
- **Progress ring** (circular % indicator)
- Stats line: "34/51 read · 3 favorites · 14 queued"
- **"Next up"** — title of the next queued work, clickable
- **"Random"** button — pick a random queued work
- **"Top picks"** — 2-3 most re-read or highest-rated works

Sorted by: most recently active, or lowest % (motivational), user choice.

### `/canon/[creatorId]` — Creator detail

Full catalog view for one creator:
- Creator header (image, name, description, big progress ring, stats)
- Filter bar: status (queued/done/candidate/all), difficulty, topic tags
- Works list: cards or compact rows, each with title, status badge, difficulty, rating stars, read count
- Bulk actions: "Queue all candidates", "Mark selected as done"

### `/canon/discover` — Add a creator

- Paste a URL
- App tries RSS → sitemap → llms.txt → scrape
- Shows results: "Found 47 articles from kentcdodds.com"
- Creator name/description fields (pre-filled if possible)
- Approval grid: checkboxes on each discovered work
- "Queue selected" / "Queue all" buttons

## Route Structure

```
src/app/canon/
  page.tsx                    # Main grid of creator cards
  canon.module.css            # Styles for main page
  [creatorId]/
    page.tsx                  # Creator detail / catalog view
  discover/
    page.tsx                  # Add new creator + ingest
```

## Server Actions

- `addCreator(name, url, description, imageUrl, type)` — insert into creators
- `ingestWorks(creatorId, works[])` — bulk insert discovered works as candidates
- `updateWorkStatus(workId, status)` — queue, done, drop
- `markRead(workId)` — increment read_count, set last_read_at, set status=done if first read
- `rateWork(workId, rating)` — set rating
- `bulkQueueWorks(workIds[])` — move candidates to queued

## Build Order

1. **Tables** — create `creators` + `works` in Turso
2. **Data layer** — `src/lib/reading.ts` with types + query functions
3. **Server actions** — `src/actions/reading.ts`
4. **Discover page** — paste URL, ingest, approve works
5. **Main page** — creator cards with progress rings
6. **Creator detail page** — full catalog, filters, mark done
7. **Sidebar link** — add to nav
8. **Polish** — random button, re-read tracking, stats

## Future Ideas (not building now)

- YouTube/podcast support (different embed/player)
- Spotify Wrapped-style "year in review" stats
- Public profile: "biggest fan" leaderboard per creator
- Import from Pocket/Instapaper/browser bookmarks
- Browser extension: "Add to Canon%" from any page
- AI summaries of articles you've read
- Spaced repetition: resurface articles you rated highly after N days
