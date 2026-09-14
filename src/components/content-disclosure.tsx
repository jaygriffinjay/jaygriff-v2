import { cn } from "@/lib/utils";

import styles from "./content-disclosure.module.css";

/**
 * Index-page provenance notice, covering a whole listing at once. Per-row
 * disclosure lives in ContentHeader now — on the meta line beside the date
 * rather than in a callout above the title.
 */
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
