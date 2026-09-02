import "server-only";

import { db } from "@/modules/db/turso";

export type AssetRole =
  | "thumbnail"
  | "hero"
  | "logo"
  | "asset"
  | "graphic"
  | "video";

export type AssetEntityType = "project" | "content";

export type AssetRow = {
  id: number;
  url: string;
  role: AssetRole;
  entity_type: AssetEntityType;
  entity_id: string;
  sort_order: number;
  created_at: string;
};

function parseRow(row: Record<string, unknown>): AssetRow {
  return {
    id: Number(row.id),
    url: row.url as string,
    role: row.role as AssetRole,
    entity_type: row.entity_type as AssetEntityType,
    entity_id: row.entity_id as string,
    sort_order: Number(row.sort_order ?? 0),
    created_at: row.created_at as string,
  };
}

export async function getAssetsFor(
  entityType: AssetEntityType,
  entityId: string
): Promise<AssetRow[]> {
  const result = await db.execute({
    sql: "SELECT * FROM assets WHERE entity_type = ? AND entity_id = ? ORDER BY sort_order ASC, id ASC",
    args: [entityType, entityId],
  });
  return result.rows.map((r) => parseRow(r as Record<string, unknown>));
}

/** Batched variant for grids, so a listing page stays at one query. */
export async function getAssetsForMany(
  entityType: AssetEntityType,
  entityIds: string[]
): Promise<Map<string, AssetRow[]>> {
  const map = new Map<string, AssetRow[]>();
  if (entityIds.length === 0) return map;

  const placeholders = entityIds.map(() => "?").join(", ");
  const result = await db.execute({
    sql: `SELECT * FROM assets
          WHERE entity_type = ? AND entity_id IN (${placeholders})
          ORDER BY sort_order ASC, id ASC`,
    args: [entityType, ...entityIds],
  });

  for (const r of result.rows) {
    const row = parseRow(r as Record<string, unknown>);
    map.set(row.entity_id, [...(map.get(row.entity_id) ?? []), row]);
  }
  return map;
}

/** First asset matching any of the given roles, in the order listed. */
export function pickAsset(
  rows: AssetRow[] | undefined,
  ...roles: AssetRole[]
): AssetRow | null {
  if (!rows) return null;
  for (const role of roles) {
    const match = rows.find((r) => r.role === role);
    if (match) return match;
  }
  return null;
}

/** Next's optimizer rejects SVG by default. */
export function isSvg(url: string) {
  return url.toLowerCase().split("?")[0].endsWith(".svg");
}
