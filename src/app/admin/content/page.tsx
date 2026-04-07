import { getAllContent } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import styles from "./content.module.css";

export default async function AdminContentPage() {
  const content = await getAllContent();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Content ({content.length})</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((row) => (
            <TableRow key={row.id}>
              <TableCell className={styles.titleCell}>{row.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className={styles.typeBadge}>
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusBadge id={row.id} status={row.status} />
              </TableCell>
              <TableCell className={styles.date}>
                {new Date(row.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
