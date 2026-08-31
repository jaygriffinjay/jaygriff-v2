CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'draft',
  icon         TEXT,
  app_href     TEXT,
  repo_url     TEXT,
  demo_url     TEXT,
  video_url    TEXT,
  thumbnail    TEXT,
  logo         TEXT,
  images       TEXT,
  tags         TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_project_id ON content(project_id);
