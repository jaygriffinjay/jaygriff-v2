"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/app/admin/actions/auth";
import { db } from "@/modules/db/turso";
import type { AssetEntityType, AssetRole } from "@/modules/assets/queries";

// the DB CHECK is the real guard; this keeps a bad value from ever reaching it
const ROLES: AssetRole[] = [
  "thumbnail",
  "hero",
  "logo",
  "asset",
  "graphic",
  "video",
];
const ENTITY_TYPES: AssetEntityType[] = ["project", "content"];

function revalidate() {
  revalidatePath("/admin/assets");
  revalidatePath("/projects");
  revalidatePath("/posts");
  revalidatePath("/docs");
}

export async function assignAsset(input: {
  url: string;
  role: string;
  entityType: string;
  entityId: string;
}) {
  await requireAuth();

  if (!ROLES.includes(input.role as AssetRole)) {
    throw new Error(`Unknown role: ${input.role}`);
  }
  if (!ENTITY_TYPES.includes(input.entityType as AssetEntityType)) {
    throw new Error(`Unknown entity type: ${input.entityType}`);
  }
  if (!input.url || !input.entityId) {
    throw new Error("Missing url or entity");
  }

  await db.execute({
    sql: "INSERT OR IGNORE INTO assets (url, role, entity_type, entity_id) VALUES (?, ?, ?, ?)",
    args: [input.url, input.role, input.entityType, input.entityId],
  });

  revalidate();
}

export async function unassignAsset(id: number) {
  await requireAuth();

  await db.execute({
    sql: "DELETE FROM assets WHERE id = ?",
    args: [id],
  });

  revalidate();
}
