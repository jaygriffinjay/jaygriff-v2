"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/app/admin/actions/auth";
import { db } from "@/modules/db/turso";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const ToolSchema = z.object({
  id: z.string().min(1),
  section: z.string().trim().min(1),
  title: z.string().trim().min(1, "Title is required"),
  logo: z.string().trim().min(1, "Logo path is required"),
  description: optionalText,
  note: optionalText,
  status: z.enum(["active", "occasional", "benched", "shelved", "wishlist"]),
  invert: z.boolean(),
  sort_order: z
    .union([z.number().int(), z.string().regex(/^-?\d+$/, "Whole number only")])
    .transform(Number),
});

export type ToolFormValues = z.input<typeof ToolSchema>;

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function updateTool(
  values: ToolFormValues
): Promise<ActionResult> {
  await requireAuth();

  const parsed = ToolSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const t = parsed.data;

  await db.execute({
    sql: `UPDATE tools SET
            section = ?, title = ?, logo = ?, description = ?, note = ?,
            status = ?, invert = ?, sort_order = ?
          WHERE id = ?`,
    args: [
      t.section,
      t.title,
      t.logo,
      t.description,
      t.note,
      t.status,
      t.invert ? 1 : 0,
      t.sort_order,
      t.id,
    ],
  });

  revalidatePath("/my-stack");
  revalidatePath("/admin/tools");

  return { ok: true };
}
