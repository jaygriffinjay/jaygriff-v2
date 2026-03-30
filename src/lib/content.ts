import { db } from "./turso";
import { readFileSync } from "fs";
import { join } from "path";

export type ContentRow = {
  id: string;
  slug: string;
  file_path: string | null;
  content_hash: string | null;
  title: string;
  description: string | null;
  type: "post" | "doc" | "cool";
  status: "draft" | "published" | "archived";
  authors: string[] | null;
  authorship_note: string | null;
  tags: string[] | null;
  updated_dates: string[] | null;
  thumbnail: string | null;
  images: string[] | null;
  project_id: string | null;
  feature: string | null;
  source_url: string | null;
  commit_hash: string | null;
  created_at: string;
  updated_at: string;
};

function parseRow(row: Record<string, unknown>): ContentRow {
  return {
    id: row.id as string,
    slug: row.slug as string,
    file_path: (row.file_path as string) ?? null,
    content_hash: (row.content_hash as string) ?? null,
    title: row.title as string,
    description: (row.description as string) ?? null,
    type: row.type as ContentRow["type"],
    status: row.status as ContentRow["status"],
    authors: row.authors ? JSON.parse(row.authors as string) : null,
    authorship_note: (row.authorship_note as string) ?? null,
    tags: row.tags ? JSON.parse(row.tags as string) : null,
    updated_dates: row.updated_dates ? JSON.parse(row.updated_dates as string) : null,
    thumbnail: (row.thumbnail as string) ?? null,
    images: row.images ? JSON.parse(row.images as string) : null,
    project_id: (row.project_id as string) ?? null,
    feature: (row.feature as string) ?? null,
    source_url: (row.source_url as string) ?? null,
    commit_hash: (row.commit_hash as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getContentBySlug(slug: string): Promise<ContentRow | null> {
  const result = await db.execute({
    sql: "SELECT * FROM content WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return parseRow(result.rows[0] as Record<string, unknown>);
}

export async function getAllPublished(type?: ContentRow["type"]): Promise<ContentRow[]> {
  const result = type
    ? await db.execute({
        sql: "SELECT * FROM content WHERE status = 'published' AND type = ? ORDER BY created_at DESC",
        args: [type],
      })
    : await db.execute("SELECT * FROM content WHERE status = 'published' ORDER BY created_at DESC");
  return result.rows.map((r) => parseRow(r as Record<string, unknown>));
}

export function readMarkdownFile(filePath: string): string {
  return readFileSync(join(process.cwd(), filePath), "utf-8");
}
