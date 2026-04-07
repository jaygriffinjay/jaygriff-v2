"use client";

import { useTransition } from "react";
import { toggleStatus } from "@/actions/content";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "./content.module.css";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

export function StatusBadge({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Badge
      variant={STATUS_VARIANT[status] ?? "outline"}
      className={cn(styles.badge, isPending && "opacity-50")}
      onClick={() => startTransition(() => toggleStatus(id, status))}
    >
      {status}
    </Badge>
  );
}
