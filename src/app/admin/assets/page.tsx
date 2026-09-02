import { listR2Objects } from "@/modules/r2/list";

import { AssetGrid } from "./asset-grid";
import { getAllAssignments, getEntityOptions } from "./queries";
import styles from "./assets.module.css";

// the bucket listing is a live network call, so never prerender this page
export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const [objects, assignments, entities] = await Promise.all([
    listR2Objects(),
    getAllAssignments(),
    getEntityOptions(),
  ]);

  const assignedUrls = new Set(assignments.map((a) => a.url));
  const assignedCount = objects.filter((o) => assignedUrls.has(o.url)).length;

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.heading}>Assets ({objects.length})</h1>
        <p className={styles.summary}>
          {assignedCount} assigned · {objects.length - assignedCount} unassigned
        </p>
      </div>

      {objects.length === 0 ? (
        <p className={styles.empty}>No objects found in the bucket.</p>
      ) : (
        <AssetGrid
          objects={objects}
          assignments={assignments}
          entities={entities}
        />
      )}
    </div>
  );
}
