import { db } from "../turso";

type Gap = { key: string; missing: string[] };

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  const str = String(value).trim();
  return str === "" || str === "[]" || str === "null";
}

function report(label: string, gaps: Gap[]) {
  console.log(`\n── ${label} ${"─".repeat(Math.max(0, 60 - label.length))}`);
  if (gaps.length === 0) {
    console.log("  nothing missing");
    return;
  }
  for (const gap of gaps) {
    console.log(`  ${gap.key.padEnd(38)} ${gap.missing.join(", ")}`);
  }
}

/** Tally which fields are missing most often, to show where the work is. */
function histogram(gaps: Gap[]) {
  const counts = new Map<string, number>();
  for (const gap of gaps) {
    for (const field of gap.missing) {
      counts.set(field, (counts.get(field) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

async function auditProjects() {
  const result = await db.execute(
    "SELECT * FROM projects ORDER BY sort_order ASC, title ASC"
  );

  const gaps: Gap[] = [];

  for (const row of result.rows as unknown as Record<string, unknown>[]) {
    const missing: string[] = [];

    for (const field of ["tagline", "description", "icon", "thumbnail", "logo", "tags"]) {
      if (isEmpty(row[field])) missing.push(field);
    }

    // availability: a project with no destination at all is unreachable.
    // `wip` means there is deliberately nothing to link to, so it isn't a gap.
    const tags: string[] = isEmpty(row.tags) ? [] : JSON.parse(row.tags as string);
    if (
      !tags.includes("wip") &&
      isEmpty(row.app_href) &&
      isEmpty(row.repo_url) &&
      isEmpty(row.demo_url)
    ) {
      missing.push("NO LINK (app_href/repo_url/demo_url all empty)");
    }

    if (missing.length > 0) gaps.push({ key: row.slug as string, missing });
  }

  report(`projects (${result.rows.length} rows)`, gaps);
  return gaps;
}

async function auditContent() {
  const result = await db.execute(
    "SELECT * FROM content WHERE status != 'deleted' ORDER BY type ASC, slug ASC"
  );

  const gaps: Gap[] = [];

  for (const row of result.rows as unknown as Record<string, unknown>[]) {
    const missing: string[] = [];

    for (const field of ["description", "tags", "thumbnail"]) {
      if (isEmpty(row[field])) missing.push(field);
    }

    // a link entry with no source_url has nothing to link to
    if (row.type === "link" && isEmpty(row.source_url)) missing.push("source_url");

    if (missing.length > 0) {
      gaps.push({ key: `${row.type}/${row.slug}`, missing });
    }
  }

  report(`content (${result.rows.length} rows)`, gaps);
  return gaps;
}

async function auditOrphans() {
  const projectIds = await db.execute("SELECT id FROM projects");
  const known = new Set(projectIds.rows.map((r) => r.id as string));

  const linked = await db.execute(
    "SELECT slug, project_id FROM content WHERE project_id IS NOT NULL AND status != 'deleted'"
  );

  const broken = linked.rows.filter((r) => !known.has(r.project_id as string));

  console.log(`\n── referential ${"─".repeat(47)}`);
  if (broken.length === 0) {
    console.log("  all content.project_id values resolve");
  } else {
    for (const row of broken) {
      console.log(`  ${String(row.slug).padEnd(38)} → missing project "${row.project_id}"`);
    }
  }

  const unlinked = await db.execute(
    `SELECT p.slug FROM projects p
      WHERE NOT EXISTS (
        SELECT 1 FROM content c WHERE c.project_id = p.id AND c.status != 'deleted'
      )`
  );
  if (unlinked.rows.length > 0) {
    console.log(`\n  projects with no content written about them:`);
    for (const row of unlinked.rows) console.log(`    ${row.slug}`);
  }
}

async function main() {
  const projectGaps = await auditProjects();
  const contentGaps = await auditContent();
  await auditOrphans();

  console.log(`\n── summary ${"─".repeat(50)}`);
  console.log("  projects:");
  for (const [field, count] of histogram(projectGaps)) {
    console.log(`    ${String(count).padStart(4)}  ${field}`);
  }
  console.log("  content:");
  for (const [field, count] of histogram(contentGaps)) {
    console.log(`    ${String(count).padStart(4)}  ${field}`);
  }
}

main();
