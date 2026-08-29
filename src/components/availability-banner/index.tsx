import { ArrowUpRightIcon } from "lucide-react";

import { Link } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./availability-banner.module.css";

export function AvailabilityBanner({ className }: { className?: string }) {
  return (
    <div className={cn(styles.wrap, className)}>
      <Link href="/contact" className={styles.banner}>
        <span className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          Available now
        </span>
        <span className={styles.role}>
          I&apos;m looking for a software development role!
        </span>
        <span className={styles.cta}>
          Get in touch
          <ArrowUpRightIcon className={styles.ctaIcon} />
        </span>
      </Link>
    </div>
  );
}
