import "server-only";

import { db } from "@/modules/db/turso";
import type { AssetRow } from "@/modules/assets/queries";

/** Every assignment in the table, so the grid can mark each object in one query. */
export async function getAllAssignments(): Promise<AssetRow[]> {
  const result = await db.execute("SELECT * FROM assets ORDER BY id ASC");
  return result.rows.map((row) => ({
    id: Number(row.id),
    url: row.url as string,
    role: row.role as AssetRow["role"],
    entity_type: row.entity_type as AssetRow["entity_type"],
    entity_id: row.entity_id as string,
    sort_order: Number(row.sort_order ?? 0),
    created_at: row.created_at as string,
  }));
}

export type EntityOption = {
  entity_type: AssetRow["entity_type"];
  id: string;
  slug: string;
  title: string;
  kind: string;
};

/** Everything an asset can be attached to, flattened into one searchable list. */
export async function getEntityOptions(): Promise<EntityOption[]> {
  const [projects, content] = await Promise.all([
    db.execute("SELECT id, slug, title FROM projects ORDER BY title ASC"),
    db.execute("SELECT id, slug, title, type FROM content ORDER BY title ASC"),
  ]);

  return [
    ...projects.rows.map((row) => ({
      entity_type: "project" as const,
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      kind: "project",
    })),
    ...content.rows.map((row) => ({
      entity_type: "content" as const,
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      kind: row.type as string,
    })),
  ];
}
