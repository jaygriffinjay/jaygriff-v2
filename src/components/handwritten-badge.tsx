import type { ContentRow } from "@/modules/content/queries";
import { cn } from "@/lib/utils";

/** Marks the exception, not the rule — the site default is AI-assisted. */
export function HandwrittenBadge({
  authorship,
  className,
}: {
  authorship: ContentRow["authorship"];
  className?: string;
}) {
  if (authorship !== "handwritten") return null;

  return (
    <span
      role="img"
      aria-label="Handwritten"
      title="Handwritten — written by me, without AI"
      className={cn("select-none", className)}
    >
      ✍️
    </span>
  );
}
