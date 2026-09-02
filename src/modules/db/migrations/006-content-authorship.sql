-- Authorship badge — discrete provenance value, distinct from the prose in authorship_note.
-- NULL means "site default applies" (AI-assisted), so no backfill is needed.
-- Plain TEXT with no CHECK, matching type/status, so new values need no migration.
ALTER TABLE content ADD COLUMN authorship TEXT;

CREATE INDEX IF NOT EXISTS idx_content_authorship ON content(authorship);
