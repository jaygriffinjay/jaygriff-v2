-- Content table — CMS/content system
CREATE TABLE IF NOT EXISTS content (
  id               TEXT PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  file_path        TEXT,
  content_hash     TEXT,
  title            TEXT NOT NULL,
  description      TEXT,
  type             TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'draft',
  authors          TEXT,
  authorship_note  TEXT,
  tags             TEXT,
  updated_dates    TEXT,
  thumbnail        TEXT,
  images           TEXT,
  project_id       TEXT,
  feature          TEXT,
  source_url       TEXT,
  commit_hash      TEXT,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
