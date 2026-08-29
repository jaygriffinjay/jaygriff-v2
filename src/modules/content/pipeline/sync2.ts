import { createHash } from "crypto";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, relative } from "path";
import { db } from "../../db/turso";
import { generateMetadata } from "./generate-metadata";

const MD_DIR = join(process.cwd(), "content/md");
const TSX_DIR = join(process.cwd(), "content/tsx");

type Format = "md" | "tsx";

// ── Helpers ──────────────────────────────────────────────────────────────────

function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function walk(dir: string, ext: string): string[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    // Skip files/dirs starting with `_` (build placeholders, drafts, etc.)
    if (entry.name.startsWith("_")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function sync() {
  const mdFiles = walk(MD_DIR, ".md");
  const tsxFiles = walk(TSX_DIR, ".tsx");
  const now = new Date().toISOString();

  // Build filesystem map: filePath → { content, hash, format }
  const fsMap = new Map<
    string,
    { content: string; hash: string; format: Format }
  >();
  for (const abs of mdFiles) {
    const rel = relative(process.cwd(), abs);
    const content = readFileSync(abs, "utf-8");
    fsMap.set(rel, { content, hash: hashContent(content), format: "md" });
  }
  for (const abs of tsxFiles) {
    const rel = relative(process.cwd(), abs);
    const content = readFileSync(abs, "utf-8");
    fsMap.set(rel, { content, hash: hashContent(content), format: "tsx" });
  }

  // Load all DB records
  const result = await db.execute(
    "SELECT id, slug, file_path, content_hash, status, updated_dates FROM content"
  );
  const dbByPath = new Map<
    string,
    {
      id: string;
      slug: string;
      hash: string;
      status: string;
      updatedDates: string[];
    }
  >();
  const dbByHash = new Map<string, { id: string; slug: string; path: string }>();
  const dbAllPaths = new Set<string>();
  for (const row of result.rows) {
    const id = row.id as string;
    const slug = row.slug as string;
    const path = row.file_path as string;
    const hash = row.content_hash as string;
    const status = row.status as string;
    const updatedDates = row.updated_dates
      ? JSON.parse(row.updated_dates as string)
      : [];
    if (path) {
      dbByPath.set(path, { id, slug, hash, status, updatedDates });
      dbAllPaths.add(path);
    }
    if (hash) dbByHash.set(hash, { id, slug, path });
  }

  let added = 0,
    updated = 0,
    renamed = 0,
    unchanged = 0,
    deleted = 0,
    restored = 0;

  // Track which DB paths we matched so we can tombstone the rest
  const visitedPaths = new Set<string>();

  for (const [filePath, { content, hash, format }] of fsMap) {
    const existing = dbByPath.get(filePath);

    if (existing) {
      visitedPaths.add(filePath);

      const wasDeleted = existing.status === "deleted";

      if (existing.hash === hash && !wasDeleted) {
        unchanged++;
        continue;
      }

      if (wasDeleted) {
        // File reappeared on disk → flip back to draft, refresh hash
        const updatedDates = JSON.stringify([now, ...existing.updatedDates]);
        await db.execute({
          sql: "UPDATE content SET content_hash = ?, status = 'draft', updated_at = ?, updated_dates = ? WHERE id = ?",
          args: [hash, now, updatedDates, existing.id],
        });
        console.log(`restored: ${filePath}`);
        restored++;
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
      // Renamed/moved — update file_path. Mark old path visited so it isn't tombstoned.
      visitedPaths.add(hashMatch.path);
      await db.execute({
        sql: "UPDATE content SET file_path = ?, updated_at = ? WHERE id = ?",
        args: [filePath, now, hashMatch.id],
      });
      console.log(`renamed: ${hashMatch.path} → ${filePath}`);
      renamed++;
      continue;
    }

    // New file — generate metadata with AI
    const meta = await generateMetadata(content, format);
    const id = crypto.randomUUID();

    await db.execute({
      sql: `INSERT INTO content (
              id, slug, file_path, content_hash, title, description,
              type, status, authors, authorship_note, tags, updated_dates,
              thumbnail, images, project_id, feature, source_url, commit_hash,
              format, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        meta.slug,
        filePath,
        hash,
        meta.title,
        meta.description,
        meta.type,
        "draft",
        null, // authors
        null, // authorship_note
        JSON.stringify(meta.tags),
        null, // updated_dates
        null, // thumbnail
        null, // images
        null, // project_id
        null, // feature
        null, // source_url
        null, // commit_hash
        format,
        now,
        now,
      ],
    });
    console.log(
      `added: ${filePath} → slug: ${meta.slug} (${meta.type}, ${format})`
    );
    added++;
  }

  // Tombstone DB rows whose files no longer exist on disk
  for (const path of dbAllPaths) {
    if (visitedPaths.has(path)) continue;
    const row = dbByPath.get(path)!;
    if (row.status === "deleted") continue; // already tombstoned
    await db.execute({
      sql: "UPDATE content SET status = 'deleted', updated_at = ? WHERE id = ?",
      args: [now, row.id],
    });
    console.log(`deleted: ${path}`);
    deleted++;
  }

  console.log(
    `\nSync complete: ${added} added, ${updated} updated, ${renamed} renamed, ${restored} restored, ${deleted} deleted, ${unchanged} unchanged`
  );
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
