"use client";

import { useState, useTransition } from "react";
import { deletePoolTest, updatePoolTest, type TestEntry } from "@/app/pool/actions";
import { type MetricKey } from "@/app/pool/pool-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import styles from "./pool.module.css";

const METRIC_KEYS: MetricKey[] = [
  "totalHardness",
  "totalChlorine",
  "freeChlorine",
  "ph",
  "alkalinity",
  "stabilizer",
];

function formatMetric(key: MetricKey, val: number): string {
  return key === "ph" ? val.toFixed(1) : String(Math.round(val));
}

export function TestRow({ entry }: { entry: TestEntry }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.readings);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updatePoolTest(entry.date, draft);
      setEditing(false);
    });
  };

  const handleCancel = () => {
    setDraft(entry.readings);
    setEditing(false);
  };

  const handleDelete = () => {
    startTransition(() => deletePoolTest(entry.date));
  };

  return (
    <TableRow className={cn(isPending && styles.rowPending)}>
      <TableCell className={styles.date}>
        {new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </TableCell>
      {METRIC_KEYS.map((key) => {
        const val = draft[key];
        return (
          <TableCell key={key} className={styles.metricValue}>
            {editing ? (
              <Input
                type="number"
                step={key === "ph" ? 0.1 : 1}
                className={styles.editInput}
                value={val ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((prev) => ({
                    ...prev,
                    [key]: v === "" ? undefined : Number(v),
                  }));
                }}
              />
            ) : val !== undefined ? (
              formatMetric(key, val)
            ) : (
              "—"
            )}
          </TableCell>
        );
      })}
      <TableCell className={styles.actions}>
        {editing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className={styles.saveBtn}
              disabled={isPending}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={styles.deleteBtn}
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
