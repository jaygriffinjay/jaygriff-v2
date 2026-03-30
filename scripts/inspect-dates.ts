import { db } from "../src/lib/turso";

async function run() {
  const r = await db.execute("SELECT slug, updated_dates FROM content");
  for (const row of r.rows) {
    console.log(row.slug, "→", row.updated_dates ?? "null");
  }
}

run();
