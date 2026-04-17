import { createHash } from "crypto";
import { readdirSync, readFileSync } from "fs";
import { join, relative } from "path";
import { db } from "../db/turso";
import { generateMetadata } from "./generate-metadata";

const CONTENT_DIR = join(process.cwd(), "content/md");

// ── Helpers ──────────────────────────────────────────────────────────────────

function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function walkMd(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMd(full));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function sync() {
  const files = walkMd(CONTENT_DIR);
  const now = new Date().toISOString();

  // Build filesystem map: filePath → { content, hash }
  const fsMap = new Map<string, { content: string; hash: string }>();
  for (const abs of files) {
    const rel = relative(process.cwd(), abs);
    const content = readFileSync(abs, "utf-8");
    fsMap.set(rel, { content, hash: hashContent(content) });
  }

  // Load all DB records
  const result = await db.execute(
    "SELECT id, slug, file_path, content_hash, updated_dates FROM content"
  );
  const dbByPath = new Map<string, { id: string; slug: string; hash: string; updatedDates: string[] }>();
  const dbByHash = new Map<string, { id: string; slug: string; path: string }>();
  for (const row of result.rows) {
    const id = row.id as string;
    const slug = row.slug as string;
    const path = row.file_path as string;
    const hash = row.content_hash as string;
    const updatedDates = row.updated_dates ? JSON.parse(row.updated_dates as string) : [];
    if (path) dbByPath.set(path, { id, slug, hash, updatedDates });
    if (hash) dbByHash.set(hash, { id, slug, path });
  }

  let added = 0, updated = 0, renamed = 0, unchanged = 0;

  for (const [filePath, { content, hash }] of fsMap) {
    const existing = dbByPath.get(filePath);

    if (existing) {
      if (existing.hash === hash) {
        unchanged++;
        continue;
      }
      // Content changed — update hash, updated_at, and prepend to updated_dates
      const updatedDates = JSON.stringify([now, ...existing.updatedDates]);
      await db.execute({
        sql: "UPDATE content SET content_hash = ?, updated_at = ?, updated_dates = ? WHERE id = ?",
        args: [hash, now, updatedDates, existing.id],
      });
      console.log(`updated: ${filePath}`);
      updated++;
      continue;
    }

    const hashMatch = dbByHash.get(hash);
    if (hashMatch) {
      // Renamed — update file_path only
      await db.execute({
        sql: "UPDATE content SET file_path = ?, updated_at = ? WHERE id = ?",
        args: [filePath, now, hashMatch.id],
      });
      console.log(`renamed: ${hashMatch.path} → ${filePath}`);
      renamed++;
      continue;
    }

    // New file — generate metadata with AI
    const meta = await generateMetadata(content);
    const id = crypto.randomUUID();

    await db.execute({
      sql: `INSERT INTO content (id, slug, file_path, content_hash, title, description, type, status, tags, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        meta.slug,
        filePath,
        hash,
        meta.title,
        meta.description,
        meta.type,
        "draft",
        JSON.stringify(meta.tags),
        now,
        now,
      ],
    });
    console.log(`added: ${filePath} → slug: ${meta.slug} (${meta.type})`);
    added++;
  }

  console.log(
    `\nSync complete: ${added} added, ${updated} updated, ${renamed} renamed, ${unchanged} unchanged`
  );
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
