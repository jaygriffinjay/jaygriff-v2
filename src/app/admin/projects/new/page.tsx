import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { ProjectForm } from "../project-form";
import styles from "../projects.module.css";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div className={styles.page}>
      <Link href="/admin/projects" className={styles.backLink}>
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Projects
      </Link>

      <h1 className={styles.heading}>New project</h1>

      <ProjectForm
        mode="create"
        initial={{
          id: "",
          slug: "",
          title: "",
          tagline: null,
          description: null,
          status: "draft",
          icon: null,
          app_href: null,
          repo_url: null,
          demo_url: null,
          tags: "",
          sort_order: 0,
        }}
      />
    </div>
  );
}
