import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <h1 className={styles.heading}>Projects ({projects.length})</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Order</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const url = projectUrl(project);
            return (
              <TableRow key={project.id}>
                <TableCell>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className={styles.titleLink}
                  >
                    {project.title}
                  </Link>
                  <div className={styles.slug}>{project.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isShowcased(project.id) ? "default" : "outline"}
                    className={styles.showcaseBadge}
                  >
                    {isShowcased(project.id) ? "Apps" : "Experiments"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.status}</Badge>
                </TableCell>
                <TableCell className={styles.muted}>
                  {url ?? "none"}
                </TableCell>
                <TableCell className={styles.muted}>
                  {project.sort_order}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
