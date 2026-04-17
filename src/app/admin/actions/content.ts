"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/modules/db/turso";
import { requireAuth } from "@/app/admin/actions/auth";

const STATUS_CYCLE: Record<string, string> = {
  draft: "published",
  published: "archived",
  archived: "draft",
};

export async function toggleStatus(id: string, currentStatus: string) {
  await requireAuth();
  const next = STATUS_CYCLE[currentStatus] ?? "draft";

  await db.execute({
    sql: "UPDATE content SET status = ?, updated_at = ? WHERE id = ?",
    args: [next, new Date().toISOString(), id],
  });

  revalidatePath("/admin/content");
  revalidatePath("/docs");
  revalidatePath("/posts");
}
