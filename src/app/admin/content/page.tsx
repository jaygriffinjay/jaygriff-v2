import { getAllContent } from "@/modules/content/queries";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import styles from "./content.module.css";

export default async function AdminContentPage() {
  const content = await getAllContent();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Content ({content.length})</h1>

      <ul className={styles.list}>
        {content.map((row) => (
          <li key={row.id} className={styles.item}>
            <div className={styles.itemMain}>
              <Link
                href={`/admin/content/${row.id}`}
                className={styles.titleLink}
              >
                {row.title}
              </Link>
              <span className={styles.slug}>{row.slug}</span>
            </div>

            <div className={styles.itemMeta}>
              <Badge variant="outline" className={styles.typeBadge}>
                {row.type}
              </Badge>
              <StatusBadge id={row.id} status={row.status} />
              <span className={styles.date}>
                {new Date(row.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
