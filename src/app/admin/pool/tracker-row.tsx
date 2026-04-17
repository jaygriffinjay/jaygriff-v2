"use client";

import { useState, useTransition } from "react";
import { deleteTracker, updateTracker } from "@/app/pool/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import styles from "./pool.module.css";

export function TrackerRow({ trackerKey, lastDone }: { trackerKey: string; lastDone: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lastDone);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateTracker(trackerKey, new Date(draft).toISOString());
      setEditing(false);
    });
  };

  const handleCancel = () => {
    setDraft(lastDone);
    setEditing(false);
  };

  const handleDelete = () => {
    startTransition(() => deleteTracker(trackerKey));
  };

  // Convert ISO string to datetime-local format for the input
  const toLocalInput = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <TableRow className={cn(isPending && styles.rowPending)}>
      <TableCell className={styles.metricLabel}>{trackerKey}</TableCell>
      <TableCell className={styles.date}>
        {editing ? (
          <Input
            type="datetime-local"
            className={styles.editInput}
            value={toLocalInput(draft)}
            onChange={(e) => setDraft(e.target.value)}
          />
        ) : (
          new Date(lastDone).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        )}
      </TableCell>
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
