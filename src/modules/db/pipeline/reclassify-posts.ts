import { db } from "../turso";

// the only pieces Jay stands behind end to end; everything else is a working note
const KEEP_AS_POST = [
  "why-react-components-rule",
  "the-financial-statistic-that-runs-my-life",
  "ai-workflow-transparency",
  "ai-calculator-moment",
  "agent-skills-are-insane",
];

async function main() {
  const now = new Date().toISOString();

  const found = await db.execute({
    sql: `SELECT slug FROM content WHERE slug IN (${KEEP_AS_POST.map(() => "?").join(",")})`,
    args: KEEP_AS_POST,
  });
  const foundSlugs = new Set(found.rows.map((r) => r.slug as string));
  for (const slug of KEEP_AS_POST) {
    if (!foundSlugs.has(slug)) console.warn(`WARNING: keeper not found: ${slug}`);
  }

  const result = await db.execute({
    sql: `UPDATE content
             SET type = 'thought', updated_at = ?
           WHERE type = 'post'
             AND status != 'deleted'
             AND slug NOT IN (${KEEP_AS_POST.map(() => "?").join(",")})`,
    args: [now, ...KEEP_AS_POST],
  });

  console.log(`moved to thought: ${result.rowsAffected}`);

  const counts = await db.execute(
    "SELECT type, COUNT(*) n FROM content WHERE status != 'deleted' GROUP BY type ORDER BY n DESC"
  );
  console.table(counts.rows.map((r) => ({ type: r.type, n: Number(r.n) })));
}

main();
