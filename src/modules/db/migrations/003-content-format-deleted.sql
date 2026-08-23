-- Add `format` column to discriminate source file format (md | tsx).
-- Existing rows are all markdown, so default to 'md'.
ALTER TABLE content ADD COLUMN format TEXT NOT NULL DEFAULT 'md';

-- Note: status column is plain TEXT with no CHECK constraint, so 'deleted'
-- is already storable. This migration documents the expanded enum:
--   draft | published | archived | deleted
-- No DDL change required for status.
