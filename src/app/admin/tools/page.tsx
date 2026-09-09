import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getAllTools } from "@/modules/tools/queries";
import { TOOL_SECTIONS } from "@/modules/tools/sections";

import styles from "./tools.module.css";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const tools = await getAllTools();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Tools ({tools.length})</h1>

      {TOOL_SECTIONS.map((section) => {
        const rows = tools.filter((t) => t.section === section.id);
        if (rows.length === 0) return null;

        return (
          <section key={section.id} className={styles.section}>
            <h2 className={styles.sectionRow}>{section.label}</h2>
            <ul className={styles.list}>
              {rows.map((tool) => (
                <li key={tool.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <Link
                      href={`/admin/tools/${tool.id}`}
                      className={styles.titleLink}
                    >
                      {tool.title}
                    </Link>
                    <span className={styles.muted}>{tool.description}</span>
                  </div>

                  <div className={styles.itemMeta}>
                    <Badge variant="outline">{tool.status}</Badge>
                    {tool.note && <span className={styles.noteFlag}>note</span>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
