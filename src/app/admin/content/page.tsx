import { getAllContent } from "@/modules/content/queries";
import type { ContentRow } from "@/modules/content/queries";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import styles from "./content.module.css";

type Filters = { type?: string; status?: string };

type Props = { searchParams: Promise<Filters> };

function filterHref({ type, status }: Filters) {
  const search = new URLSearchParams();
  if (type) search.set("type", type);
  if (status) search.set("status", status);
  const query = search.toString();
  return query ? `/admin/content?${query}` : "/admin/content";
}

function tally<T extends string>(values: T[]) {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

/** One row of chips. Each keeps the other dimension's filter intact. */
function FilterRow<T extends string>({
  label,
  counts,
  active,
  hrefFor,
  clearHref,
  total,
}: {
  label: string;
  counts: Map<T, number>;
  active?: T;
  hrefFor: (value: T) => string;
  clearHref: string;
  total: number;
}) {
  return (
    <div className={styles.filters}>
      <span className={styles.filterLabel}>{label}</span>

      <Link
        href={clearHref}
        className={active ? styles.filter : styles.filterActive}
      >
        All <span className={styles.filterCount}>{total}</span>
      </Link>

      {[...counts.keys()].sort().map((value) => (
        <Link
          key={value}
          href={hrefFor(value)}
          className={active === value ? styles.filterActive : styles.filter}
        >
          {value} <span className={styles.filterCount}>{counts.get(value)}</span>
        </Link>
      ))}
    </div>
  );
}

export default async function AdminContentPage({ searchParams }: Props) {
  const { type, status } = await searchParams;
  const content = await getAllContent();

  const activeType = content.find((row) => row.type === type)?.type;
  const activeStatus = content.find((row) => row.status === status)?.status;

  // each dimension counts against the rows the *other* filter allows, so the
  // numbers on a chip match what clicking it actually shows
  const byStatus = activeStatus
    ? content.filter((row) => row.status === activeStatus)
    : content;
  const byType = activeType
    ? content.filter((row) => row.type === activeType)
    : content;

  const typeCounts = tally(byStatus.map((row) => row.type));
  const statusCounts = tally(byType.map((row) => row.status));

  const rows = content.filter(
    (row) =>
      (!activeType || row.type === activeType) &&
      (!activeStatus || row.status === activeStatus)
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Content ({rows.length})</h1>

      <div className={styles.filterGroups}>
        <FilterRow<ContentRow["type"]>
          label="Type"
          counts={typeCounts}
          active={activeType}
          total={byStatus.length}
          clearHref={filterHref({ status: activeStatus })}
          hrefFor={(value) => filterHref({ type: value, status: activeStatus })}
        />

        <FilterRow<ContentRow["status"]>
          label="Status"
          counts={statusCounts}
          active={activeStatus}
          total={byType.length}
          clearHref={filterHref({ type: activeType })}
          hrefFor={(value) => filterHref({ type: activeType, status: value })}
        />
      </div>

      <ul className={styles.list}>
        {rows.map((row) => (
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
