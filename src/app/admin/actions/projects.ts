"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/app/admin/actions/auth";
import { db } from "@/modules/db/turso";

// empty inputs arrive as "" from the form; store them as NULL
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const optionalUrl = optionalText.refine(
  (v) => v === null || /^(https?:\/\/|\/)/.test(v),
  { message: "Must start with http://, https:// or /" }
);

const ProjectSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(1, "Title is required"),
  tagline: optionalText,
  description: optionalText,
  status: z.enum(["draft", "published", "archived"]),
  icon: optionalText,
  app_href: optionalUrl,
  repo_url: optionalUrl,
  demo_url: optionalUrl,
  tags: z.string().trim(),
  // the number input hands back a string; accept either and normalise
  sort_order: z
    .union([z.number().int(), z.string().regex(/^-?\d+$/, "Whole number only")])
    .transform(Number),
});

export type ProjectFormValues = z.input<typeof ProjectSchema>;

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function updateProject(
  values: ProjectFormValues
): Promise<ActionResult> {
  await requireAuth();

  const parsed = ProjectSchema.safeParse(values);
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

  const p = parsed.data;

  const clash = await db.execute({
    sql: "SELECT id FROM projects WHERE slug = ? AND id != ?",
    args: [p.slug, p.id],
  });
  if (clash.rows.length > 0) {
    return { ok: false, message: `Slug "${p.slug}" is already in use.` };
  }

  const tags = p.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await db.execute({
    sql: `UPDATE projects SET
            slug = ?, title = ?, tagline = ?, description = ?, status = ?,
            icon = ?, app_href = ?, repo_url = ?, demo_url = ?, tags = ?,
            sort_order = ?, updated_at = ?
          WHERE id = ?`,
    args: [
      p.slug,
      p.title,
      p.tagline,
      p.description,
      p.status,
      p.icon,
      p.app_href,
      p.repo_url,
      p.demo_url,
      JSON.stringify(tags),
      p.sort_order,
      new Date().toISOString(),
      p.id,
    ],
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${p.slug}`);
  revalidatePath("/admin/projects");

  return { ok: true };
}
