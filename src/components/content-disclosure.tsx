import { cn } from "@/lib/utils";
import type { ContentRow } from "@/modules/content/queries";

import styles from "./content-disclosure.module.css";

/**
 * Thoughts and designs are AI-assisted by default, so the notice is driven
 * by type rather than tagged per row. `authorship_note` overrides the
 * wording, and `handwritten` opts a row out entirely.
 */
const DEFAULT_NOTES: Partial<Record<ContentRow["type"], string>> = {
  thought:
    "AI-generated note of work I did with a coding agent",
  design:
    "AI-generated design experiment",
};

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
  const defaultNote = DEFAULT_NOTES[row.type];
  if (!defaultNote || row.authorship === "handwritten") return null;

  return (
    <DisclosureNotice className={className}>
      {row.authorship_note ?? defaultNote}
    </DisclosureNotice>
  );
}
