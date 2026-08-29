import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Link } from "@/components/typography";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist.",
};

export default function NotFound() {
  return (
    <Container>
      <div className={styles.wrapper}>
        <span className={styles.code}>404</span>
        <H1 className={styles.heading}>Page not found</H1>
        <Paragraph className={styles.message}>
          That link is broken, renamed, or never existed. Nothing here.
        </Paragraph>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryAction}>
            Go home
          </Link>
          <Link href="/posts" className={styles.secondaryAction}>
            Posts
          </Link>
          <Link href="/projects" className={styles.secondaryAction}>
            Projects
          </Link>
        </div>
      </div>
    </Container>
  );
}
