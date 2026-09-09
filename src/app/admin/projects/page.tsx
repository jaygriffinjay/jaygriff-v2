import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getEveryProject } from "@/modules/projects/queries";
import { projectUrl } from "@/modules/projects/links";
import { isShowcased } from "@/modules/projects/showcase";

import styles from "./projects.module.css";

// project rows are edited here, so never serve a cached list
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getEveryProject();

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1 className={styles.heading}>Projects ({projects.length})</h1>
        <Link href="/admin/projects/new" className={styles.newLink}>
          New project
        </Link>
      </div>

      <ul className={styles.list}>
        {projects.map((project) => {
          const url = projectUrl(project);
          return (
            <li key={project.id} className={styles.item}>
              <div className={styles.itemMain}>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className={styles.titleLink}
                >
                  {project.title}
                </Link>
                <span className={styles.slug}>{project.slug}</span>
              </div>

              <div className={styles.itemMeta}>
                <Badge
                  variant={isShowcased(project.id) ? "default" : "outline"}
                  className={styles.showcaseBadge}
                >
                  {isShowcased(project.id) ? "Apps" : "Experiments"}
                </Badge>
                <Badge variant="outline">{project.status}</Badge>
                <span className={styles.order}>#{project.sort_order}</span>
              </div>

              <span className={styles.url}>{url ?? "no link"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
