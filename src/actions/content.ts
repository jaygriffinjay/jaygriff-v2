"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/turso";

const STATUS_CYCLE: Record<string, string> = {
  draft: "published",
  published: "archived",
  archived: "draft",
};

export async function toggleStatus(id: string, currentStatus: string) {
  const next = STATUS_CYCLE[currentStatus] ?? "draft";

  await db.execute({
    sql: "UPDATE content SET status = ?, updated_at = ? WHERE id = ?",
    args: [next, new Date().toISOString(), id],
  });

  revalidatePath("/admin/content");
  revalidatePath("/docs");
  revalidatePath("/posts");
}
