# Content System Vision

The site is a content hub first, portfolio second. Value for the reader comes first — "who is this guy" comes after they've already gotten something useful.

---

## Core Model: Source + My Take

Every content item is the same thing at its core:

1. **A source** — a URL, book, video, tweet, repo, or nothing (original writing)
2. **My commentary** — notes, opinions, takeaways, summary

Different content types are just different renderers on the same underlying data.

---

## Content Types

### Link / HN / Lobsters / Reddit
- Big clickable URL with favicon and domain
- Commentary underneath — styled like you're the top comment on the thread
- Low friction: paste URL, write 2-3 sentences, done

### Tweet
- Embedded tweet or quoted text
- Your reply-style response underneath — looks like you're the first reply

### Book
- Cover art, title/author metadata
- Key quotes pulled out
- Your notes and takeaways

### Video (YouTube, etc.)
- Thumbnail or embed
- Your notes underneath
- Timestamp references if relevant

### Release / Changelog
- App icon + version badge
- What changed, why it matters
- Can be auto-generated from commits or written manually

### Post
- Original long-form writing
- No external source — just your take on a topic

### Doc
- Technical reference, architecture docs, how-to guides
- Living documents that get updated over time

---

## Schema

One table, one feed. The `type` field determines the renderer.

```
type:        link | tweet | book | video | release | post | doc
source_url:  the original thing (nullable for posts/docs)
title:       what you call it
thumbnail:   cover art / og image / video thumb
metadata:    JSON — { author, domain, isbn, duration, version, ... }
body:        your commentary / notes (markdown)
tags:        JSON array for filtering/search
created_at:  when you created it
updated_at:  last modified
status:      draft | published | archived
```

This extends the existing `content` table — the `source_url`, `type`, and metadata fields are already there or easy to add.

---

## Front Page

The home page is a chronological feed of all content — not a landing page, not an about section. It's "here's what I've been building, reading, and thinking about."

- Mixed feed: posts, links, releases, books, videos all interleaved by date
- Each type gets its own card renderer (link cards look like HN, book cards show covers, etc.)
- Gets better automatically as you add more content — always fresh

The about/bio lives in the sidebar or a separate page. The front page is for the reader.

---

## Design Principles

1. **Value first** — content is the product, not your bio
2. **Low friction** — paste a URL + write a sentence = publishable content item
3. **For you first** — it's a personal knowledge base that happens to be public. If the format doesn't serve you, it dies.
4. **One feed** — everything is a content item. Different renderers, same underlying system.
5. **Second brain** — save things to find them later. The audience is a side effect.

---

## Rendering Strategy

Each content type gets a card component:

- `LinkCard` — favicon, domain, title, excerpt, commentary
- `TweetCard` — quoted tweet text, author, your reply
- `BookCard` — cover image, title/author, rating/quotes, notes
- `VideoCard` — thumbnail/embed, title, notes
- `ReleaseCard` — app icon, version badge, changelog
- `PostCard` — title, description, date (standard blog card)

All cards share:
- Date / relative time
- Tags
- "My Take" section (the commentary/notes markdown)

The feed page maps over content items and renders the right card based on `type`.

---

## Content Creation Flow

1. **Quick capture**: paste URL → auto-fetch title/og image/metadata → write your take → publish
2. **Long form**: write markdown → sync script processes it → published
3. **Release notes**: ship a feature → document what changed → auto-tagged as release

The goal is to make publishing as close to zero friction as possible. The less effort it takes, the more you'll actually do it.
