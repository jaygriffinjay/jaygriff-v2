import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { ContentDisclosure } from "@/components/content-disclosure";
import styles from "./design.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function DesignPage({ params }: Props) {
  const { slug } = await params;
  const design = await getContentBySlug(slug);

  if (!design || design.type !== "design" || !design.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <ContentDisclosure row={design} className={styles.disclosure} />
        <header className={styles.header}>
          <H1>{design.title}</H1>
          {design.description && (
            <Paragraph className={styles.description}>{design.description}</Paragraph>
          )}
          <Small>{new Date(design.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Small>
        </header>
        <Separator className={styles.divider} />
        <ContentBody row={design} />
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  // only pre-render published designs at build time; drafts are still accessible via SSR
  const { getAllPublished } = await import("@/modules/content/queries");
  const designs = await getAllPublished("design");
  return designs.map((d) => ({ slug: d.slug }));
}
