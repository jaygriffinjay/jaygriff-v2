"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "@/components/typography";
import styles from "./pool.module.css";

export function PoolInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={styles.infoButton}>
          <Info className={styles.infoIcon} />
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.infoPopover} side="bottom" align="start">
        <Link href="https://intexcorp.com/above-ground-pools/prism-frame-14-x-42-above-ground-pool-set/">
          Intex Prism Frame 14&apos; &times; 42&quot;
        </Link>
        {" "}&mdash; 3,357 gal saltwater
      </PopoverContent>
    </Popover>
  );
}
