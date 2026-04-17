import { getPoolTests, getPoolTrackers } from "@/app/pool/actions";
import { METRICS } from "@/app/pool/pool-config";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestRow } from "./test-row";
import { TrackerRow } from "./tracker-row";
import styles from "./pool.module.css";

export default async function AdminPoolPage() {
  const [tests, trackers] = await Promise.all([
    getPoolTests(),
    getPoolTrackers(),
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Pool Tests ({tests.length})</h1>

      {tests.length === 0 ? (
        <p className={styles.empty}>No test entries yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {METRICS.map((m) => (
                <TableHead key={m.key}>{m.label}</TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((entry) => (
              <TestRow key={entry.date} entry={entry} />
            ))}
          </TableBody>
        </Table>
      )}

      <h2 className={styles.heading}>Trackers</h2>
      {Object.keys(trackers).length === 0 ? (
        <p className={styles.empty}>No tracker data yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracker</TableHead>
              <TableHead>Last Done</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(trackers).map(([key, ts]) => (
              <TrackerRow key={key} trackerKey={key} lastDone={ts} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
