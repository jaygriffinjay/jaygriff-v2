import { db } from "../turso";

const HANDWRITTEN = ["the-financial-statistic-that-runs-my-life"];

async function main() {
  const cols = await db.execute("PRAGMA table_info(content)");
  const hasColumn = cols.rows.some((r) => r.name === "authorship");

  if (hasColumn) {
    console.log("column already exists, skipping ALTER");
  } else {
    await db.execute("ALTER TABLE content ADD COLUMN authorship TEXT");
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_content_authorship ON content(authorship)"
    );
    console.log("added column: authorship");
  }

  // reset first so removing a slug from the list actually unsets it
  await db.execute("UPDATE content SET authorship = NULL WHERE authorship = 'handwritten'");

  const now = new Date().toISOString();
  const result = await db.execute({
    sql: `UPDATE content
             SET authorship = 'handwritten', updated_at = ?
           WHERE slug IN (${HANDWRITTEN.map(() => "?").join(",")})`,
    args: [now, ...HANDWRITTEN],
  });

  if (result.rowsAffected !== HANDWRITTEN.length) {
    console.warn(
      `WARNING: expected ${HANDWRITTEN.length} rows, updated ${result.rowsAffected}`
    );
  }
  console.log(`marked handwritten: ${result.rowsAffected}`);

  const check = await db.execute(
    "SELECT slug, type, authorship FROM content WHERE authorship IS NOT NULL"
  );
  console.table(
    check.rows.map((r) => ({ slug: r.slug, type: r.type, authorship: r.authorship }))
  );
}

main();
