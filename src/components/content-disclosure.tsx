import { cn } from "@/lib/utils";
import type { ContentRow } from "@/modules/content/queries";

import styles from "./content-disclosure.module.css";

/**
 * Thoughts are AI-assisted work logs by default, so the notice is driven by
 * type rather than tagged per row. `authorship_note` overrides the wording,
 * and `handwritten` opts a row out entirely.
 */
export const DEFAULT_NOTE =
  "An AI-generated artifact of work I did with a coding agent. Reference material, not finished writing.";

/** Presentational half, so the index page can use the same treatment. */
export function DisclosureNotice({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn(styles.disclosure, className)}>
      <span aria-hidden="true">🤖</span> {children}
    </aside>
  );
}

export function ContentDisclosure({
  row,
  className,
}: {
  row: ContentRow;
  className?: string;
}) {
  if (row.type !== "thought" || row.authorship === "handwritten") return null;

  return (
    <DisclosureNotice className={className}>
      {row.authorship_note ?? DEFAULT_NOTE}
    </DisclosureNotice>
  );
}
