import { db } from "../src/lib/turso";
import { readFileSync } from "fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx --env-file=.env.local scripts/run-migration.ts <path-to-sql>");
  process.exit(1);
}

const sql = readFileSync(file, "utf-8");
const statements = sql
  .replace(/--.*$/gm, "")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function main() {
  for (const stmt of statements) {
    console.log("Running:", stmt.slice(0, 80) + (stmt.length > 80 ? "..." : ""));
    await db.execute(stmt);
  }
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("\nTables:", tables.rows.map((r) => r.name));
}

main();
