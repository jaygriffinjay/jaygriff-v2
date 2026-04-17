-- Pool app tables
CREATE TABLE IF NOT EXISTS pool_tests (
  date     TEXT PRIMARY KEY,
  readings TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pool_trackers (
  key       TEXT PRIMARY KEY,
  last_done TEXT NOT NULL
);
