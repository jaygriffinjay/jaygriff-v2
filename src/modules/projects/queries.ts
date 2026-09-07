import "server-only";

import { db } from "@/modules/db/turso";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  status: "draft" | "published" | "archived";
  icon: string | null;
  app_href: string | null;
  repo_url: string | null;
  demo_url: string | null;
  video_url: string | null;
  thumbnail: string | null;
  logo: string | null;
  images: string[] | null;
  tags: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function parseRow(row: Record<string, unknown>): ProjectRow {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    tagline: (row.tagline as string) ?? null,
    description: (row.description as string) ?? null,
    status: row.status as ProjectRow["status"],
    icon: (row.icon as string) ?? null,
    app_href: (row.app_href as string) ?? null,
    repo_url: (row.repo_url as string) ?? null,
    demo_url: (row.demo_url as string) ?? null,
    video_url: (row.video_url as string) ?? null,
    thumbnail: (row.thumbnail as string) ?? null,
    logo: (row.logo as string) ?? null,
    images: row.images ? JSON.parse(row.images as string) : null,
    tags: row.tags ? JSON.parse(row.tags as string) : null,
    sort_order: Number(row.sort_order ?? 0),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  const result = await db.execute(
    "SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC, title ASC"
  );
  return result.rows.map((r) => parseRow(r as Record<string, unknown>));
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const result = await db.execute({
    sql: "SELECT * FROM projects WHERE slug = ? AND status = 'published'",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return parseRow(result.rows[0] as Record<string, unknown>);
}

/** Admin views need drafts and archived rows too. */
export async function getEveryProject(): Promise<ProjectRow[]> {
  const result = await db.execute(
    "SELECT * FROM projects ORDER BY sort_order ASC, title ASC"
  );
  return result.rows.map((r) => parseRow(r as Record<string, unknown>));
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const result = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return parseRow(result.rows[0] as Record<string, unknown>);
}
