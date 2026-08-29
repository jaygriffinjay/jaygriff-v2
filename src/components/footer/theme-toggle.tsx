"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import styles from "./footer.module.css";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(styles.themeToggle, className)}
      aria-label="Toggle theme"
    >
      {/* the icon depends on the resolved theme, which is unknown until hydration */}
      <span className={styles.themeIcon}>
        {mounted && (isDark ? <SunIcon /> : <MoonIcon />)}
      </span>
      <span>Theme</span>
    </button>
  );
}
