import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import styles from "./blocks.module.css";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Documentation for the block data model and application architecture.",
};

const docs = [
  {
    label: "Design Document",
    href: "/blocks/design-doc",
    description: "Notion-inspired block data model — schema, queries, breadcrumbs, and implementation plan.",
  },
  {
    label: "Breadcrumb Implementation",
    href: "/blocks/breadcrumbs",
    description: "Initial breadcrumb plan — generic blocks table, query API, PageBreadcrumb component, and route coverage.",
  },
];

export default function BlocksPage() {
  return (
    <Container className={styles.page}>
      <div className={styles.header}>
        <H1>Blocks</H1>
        <Paragraph className={styles.subtitle}>
          Architecture and design documentation.
        </Paragraph>
      </div>
      <Separator className={styles.divider} />
      <div className={styles.docList}>
        {docs.map(({ label, href, description }) => (
          <Link key={href} href={href} className={styles.cardLink}>
            <Card>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
