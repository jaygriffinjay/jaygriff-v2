import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getToolById } from "@/modules/tools/queries";

import { ToolForm } from "../tool-form";
import styles from "../tools.module.css";

export const dynamic = "force-dynamic";

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getToolById(id);
  if (!tool) notFound();

  return (
    <div className={styles.page}>
      <Link href="/admin/tools" className={styles.backLink}>
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Tools
      </Link>

      <h1 className={styles.heading}>{tool.title}</h1>

      <ToolForm
        initial={{
          id: tool.id,
          section: tool.section,
          title: tool.title,
          logo: tool.logo,
          description: tool.description,
          note: tool.note,
          status: tool.status,
          invert: tool.invert,
          sort_order: tool.sort_order,
        }}
      />
    </div>
  );
}
