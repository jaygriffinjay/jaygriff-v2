import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./my-stack.module.css";

export type ToolStatus =
  | "active"
  | "occasional"
  | "benched"
  | "shelved"
  | "wishlist";

/* Heat-map ramp for anything less than active; active gets no marker. */
export const TOOL_STATUS_META: Record<
  ToolStatus,
  { label: string; hint: string; markClass: string; pillClass: string }
> = {
  active: {
    label: "Active",
    hint: "In regular use",
    markClass: "",
    pillClass: styles.pillActive,
  },
  occasional: {
    label: "Occasional",
    hint: "Reach for it now and then",
    markClass: styles.markOccasional,
    pillClass: styles.pillOccasional,
  },
  benched: {
    label: "Benched",
    hint: "Still know it, but rarely need it",
    markClass: styles.markBenched,
    pillClass: styles.pillBenched,
  },
  shelved: {
    label: "Shelved",
    hint: "Have experience, but no longer use it",
    markClass: styles.markShelved,
    pillClass: styles.pillShelved,
  },
  wishlist: {
    label: "Want to Learn",
    hint: "Not much experience with it, excited by it",
    markClass: styles.markWishlist,
    pillClass: styles.pillWishlist,
  },
};

interface ToolCardProps {
  logo: string;
  title: string;
  description: string;
  note?: string;
  logoSize?: number;
  invert?: boolean;
  status?: ToolStatus;
}

export function ToolCard({
  logo,
  title,
  description,
  note,
  logoSize = 40,
  invert = false,
  status = "active",
}: ToolCardProps) {
  const { label, markClass } = TOOL_STATUS_META[status];
  const [open, setOpen] = useState(false);

  const body = (
    <>
      <div
        className={styles.toolLogo}
        style={{ width: logoSize, height: logoSize }}
      >
        <Image
          src={logo}
          alt={`${title} logo`}
          width={logoSize}
          height={logoSize}
          className={cn(styles.toolLogoImg, invert && styles.toolLogoInvert)}
        />
      </div>
      <div className={styles.toolBody}>
        <strong className={styles.toolTitle}>
          {title}
          {markClass && (
            <a
              href="#usage-legend"
              className={cn(styles.statusMark, markClass)}
              title={`${title} — ${label}. Jump to the usage legend.`}
            >
              *<span className={styles.srOnly}> {label} — see usage legend</span>
            </a>
          )}
        </strong>
        <p className={styles.toolDescription}>{description}</p>
      </div>
    </>
  );

  if (!note) {
    return <div className={styles.toolCard}>{body}</div>;
  }

  return (
    <div className={cn(styles.toolCard, styles.toolCardNoted)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={styles.toolTrigger}
      >
        {body}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(styles.toolChevron, open && styles.toolChevronOpen)}
        />
      </button>
      {open && <p className={styles.toolNote}>{note}</p>}
    </div>
  );
}
