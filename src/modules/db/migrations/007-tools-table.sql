CREATE TABLE IF NOT EXISTS tools (
  id          TEXT PRIMARY KEY,
  section     TEXT NOT NULL,
  title       TEXT NOT NULL,
  logo        TEXT NOT NULL,
  description TEXT,
  note        TEXT,
  status      TEXT NOT NULL DEFAULT 'active',
  invert      INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tools_section ON tools (section, sort_order);
