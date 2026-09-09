"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
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

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const ContentSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(1, "Title is required"),
  description: optionalText,
  type: z.enum(["post", "doc", "thought", "link"]),
  status: z.enum(["draft", "published", "archived", "deleted"]),
  authorship: z.enum(["default", "handwritten", "ai-generated"]),
  authorship_note: optionalText,
  authors: z.string().trim(),
  tags: z.string().trim(),
  project_id: optionalText,
  source_url: optionalText,
  feature: optionalText,
});

export type ContentFormValues = z.input<typeof ContentSchema>;

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

function toList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function updateContent(
  values: ContentFormValues
): Promise<ActionResult> {
  await requireAuth();

  const parsed = ContentSchema.safeParse(values);
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

  const c = parsed.data;

  const clash = await db.execute({
    sql: "SELECT id FROM content WHERE slug = ? AND id != ?",
    args: [c.slug, c.id],
  });
  if (clash.rows.length > 0) {
    return { ok: false, message: `Slug "${c.slug}" is already in use.` };
  }

  const authors = toList(c.authors);

  await db.execute({
    sql: `UPDATE content SET
            slug = ?, title = ?, description = ?, type = ?, status = ?,
            authorship = ?, authorship_note = ?, authors = ?, tags = ?,
            project_id = ?, source_url = ?, feature = ?, updated_at = ?
          WHERE id = ?`,
    args: [
      c.slug,
      c.title,
      c.description,
      c.type,
      c.status,
      // "default" is the site-wide AI-assisted default, stored as NULL
      c.authorship === "default" ? null : c.authorship,
      c.authorship_note,
      authors.length > 0 ? JSON.stringify(authors) : null,
      JSON.stringify(toList(c.tags)),
      c.project_id,
      c.source_url,
      c.feature,
      new Date().toISOString(),
      c.id,
    ],
  });

  revalidatePath("/admin/content");
  revalidatePath("/posts");
  revalidatePath("/docs");
  revalidatePath("/thoughts");
  revalidatePath(`/${c.type}s/${c.slug}`);

  return { ok: true };
}
