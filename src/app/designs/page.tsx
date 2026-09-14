import type { Metadata } from "next";

import { getAllPublished } from "@/modules/content/queries";
import { H1, Paragraph, Small, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { DisclosureNotice } from "@/components/content-disclosure";
import styles from "./designs.module.css";

export const metadata: Metadata = {
  title: "Designs",
  description: "One-off pages and UI experiments built alongside my projects.",
};

export default async function DesignsPage() {
  const designs = await getAllPublished("design");

  return (
    <Container className="max-w-4xl">
      <div className="space-y-4">
        <H1>Designs</H1>
        <DisclosureNotice>
          Mostly AI-generated design experiments — one-off pages and UI ideas
          built alongside my <Link href="/projects">projects</Link>.
        </DisclosureNotice>
      </div>

      <Separator className="my-6" />

      {designs.length === 0 ? (
        <Paragraph className="text-muted-foreground">
          Nothing published yet.
        </Paragraph>
      ) : (
        <ul className={styles.list}>
          {designs.map((design) => (
            <li key={design.slug}>
              <Link href={`/designs/${design.slug}`} className={styles.row}>
                <span className={styles.rowTitle}>{design.title}</span>
                <Small className={styles.rowDate}>
                  {new Date(design.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </Small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
