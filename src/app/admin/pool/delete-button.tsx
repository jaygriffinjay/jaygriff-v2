"use client";

import { useTransition } from "react";
import { deletePoolTest } from "@/actions/pool";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./pool.module.css";

export function DeleteButton({ date }: { date: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(styles.deleteBtn, isPending && "opacity-50")}
      disabled={isPending}
      onClick={() => startTransition(() => deletePoolTest(date))}
    >
      Delete
    </Button>
  );
}
