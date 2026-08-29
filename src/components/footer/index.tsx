import NextLink from "next/link";

import { cn } from "@/lib/utils";
import styles from "./footer.module.css";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const readLinks = [
  { label: "Posts", href: "/posts" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
];

const workLinks = [
  { label: "Projects", href: "/projects" },
  { label: "My Stack", href: "/my-stack" },
  { label: "Resume", href: "/resume" },
];

const elsewhereLinks = [
  { label: "GitHub", href: "https://github.com/jaygriffinjay" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jaygriffinjay" },
  { label: "Contact", href: "/contact" },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(styles.footer, className)}>
      <div className={styles.inner}>
        <NextLink
          href="/"
          className={styles.brand}
          aria-label="Jay Griffin, home"
        >
          <Logo className={styles.logo} />
        </NextLink>

        <div className={styles.columns}>
          <nav className={styles.column} aria-label="Read Stuff">
            <span className={styles.columnTitle}>Read Stuff</span>
            {readLinks.map(({ label, href }) => (
              <NextLink key={href} href={href} className={styles.link}>
                {label}
              </NextLink>
            ))}
          </nav>

          <nav className={styles.column} aria-label="My Work">
            <span className={styles.columnTitle}>My Work</span>
            {workLinks.map(({ label, href }) => (
              <NextLink key={href} href={href} className={styles.link}>
                {label}
              </NextLink>
            ))}
          </nav>

          <nav className={styles.column} aria-label="Elsewhere">
            <span className={styles.columnTitle}>Elsewhere</span>
            {elsewhereLinks.map(({ label, href }) =>
              href.startsWith("/") ? (
                <NextLink key={href} href={href} className={styles.link}>
                  {label}
                </NextLink>
              ) : (
                <a
                  key={href}
                  href={href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  {label}
                </a>
              ),
            )}
          </nav>

          <nav className={styles.column} aria-label="Other">
            <span className={styles.columnTitle}>Other Stuff</span>
            {/* pages are statically rendered, so this year is baked at build time */}
            <NextLink href="/license" className={styles.link}>
              &copy; {new Date().getFullYear()} Jay Griffin
            </NextLink>
            <a
              href="https://github.com/jaygriffinjay/jaygriff-v2"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </footer>
  );
}
