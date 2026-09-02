-- Assets table — image assignments from R2 to projects and content
CREATE TABLE IF NOT EXISTS assets (
  id           INTEGER PRIMARY KEY,
  url          TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('thumbnail','hero','logo','asset','graphic','video')),
  entity_type  TEXT NOT NULL CHECK (entity_type IN ('project','content')),
  entity_id    TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (entity_type, entity_id, url, role)
);

CREATE INDEX IF NOT EXISTS idx_assets_entity ON assets(entity_type, entity_id);
