import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getProjectById } from "@/modules/projects/queries";

import { ProjectForm } from "../project-form";
import styles from "../projects.module.css";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className={styles.page}>
      <Link href="/admin/projects" className={styles.backLink}>
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Projects
      </Link>

      <h1 className={styles.heading}>{project.title}</h1>

      <ProjectForm
        initial={{
          id: project.id,
          slug: project.slug,
          title: project.title,
          tagline: project.tagline,
          description: project.description,
          status: project.status,
          icon: project.icon,
          app_href: project.app_href,
          repo_url: project.repo_url,
          demo_url: project.demo_url,
          tags: (project.tags ?? []).join(", "),
          sort_order: project.sort_order,
        }}
      />
    </div>
  );
}
