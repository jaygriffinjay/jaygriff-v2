"use client";

import NextLink from "next/link";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import styles from "./mobile-header.module.css";

export function MobileHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className={styles.header}>
      <NextLink href="/" className={styles.title}>
        Jay Griffin
      </NextLink>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon />
      </Button>
    </header>
  );
}
