import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getContentById } from "@/modules/content/queries";
import { getEveryProject } from "@/modules/projects/queries";

import { ContentForm } from "../content-form";
import styles from "../content.module.css";

export const dynamic = "force-dynamic";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row, projects] = await Promise.all([
    getContentById(id),
    getEveryProject(),
  ]);
  if (!row) notFound();

  return (
    <div className={styles.page}>
      <Link href="/admin/content" className={styles.backLink}>
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Content
      </Link>

      <h1 className={styles.heading}>{row.title}</h1>
      <p className={styles.filePath}>{row.file_path}</p>

      <ContentForm
        projects={projects}
        initial={{
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          type: row.type,
          status: row.status,
          authorship: row.authorship ?? "default",
          authorship_note: row.authorship_note,
          authors: (row.authors ?? []).join(", "),
          tags: (row.tags ?? []).join(", "),
          project_id: row.project_id,
          source_url: row.source_url,
          feature: row.feature,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }}
      />
    </div>
  );
}
