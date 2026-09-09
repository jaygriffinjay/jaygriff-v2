import "server-only";

import { db } from "@/modules/db/turso";

export type ToolStatus =
  | "active"
  | "occasional"
  | "benched"
  | "shelved"
  | "wishlist";

export type ToolRow = {
  id: string;
  section: string;
  title: string;
  logo: string;
  description: string | null;
  note: string | null;
  status: ToolStatus;
  invert: boolean;
  sort_order: number;
};

const STATUS_ORDER: Record<ToolStatus, number> = {
  active: 0,
  occasional: 1,
  benched: 2,
  shelved: 3,
  wishlist: 4,
};

function parseRow(row: Record<string, unknown>): ToolRow {
  return {
    id: row.id as string,
    section: row.section as string,
    title: row.title as string,
    logo: row.logo as string,
    description: (row.description as string) ?? null,
    note: (row.note as string) ?? null,
    // a bad value in the column would silently drop the badge, so fall back
    status: (row.status as ToolStatus) in STATUS_ORDER
      ? (row.status as ToolStatus)
      : "active",
    invert: Number(row.invert) === 1,
    sort_order: Number(row.sort_order ?? 0),
  };
}

export async function getAllTools(): Promise<ToolRow[]> {
  const result = await db.execute("SELECT * FROM tools");
  return result.rows
    .map((r) => parseRow(r as Record<string, unknown>))
    .sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        a.sort_order - b.sort_order
    );
}

export async function getToolById(id: string): Promise<ToolRow | null> {
  const result = await db.execute({
    sql: "SELECT * FROM tools WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return parseRow(result.rows[0] as Record<string, unknown>);
}
