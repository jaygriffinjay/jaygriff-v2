import { notFound } from "next/navigation";
import { getContentBySlug, readMarkdownFile } from "@/lib/content";
import MarkdownRenderer from "@/components/markdown-renderer/MarkdownRenderer";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import styles from "./doc.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getContentBySlug(slug);

  if (!doc || doc.type !== "doc" || !doc.file_path) notFound();

  const content = readMarkdownFile(doc.file_path);

  return (
    <Container>
      <article className={styles.article}>
        <header className={styles.header}>
          <H1>{doc.title}</H1>
          {doc.description && (
            <Paragraph className={styles.description}>{doc.description}</Paragraph>
          )}
          <Small>{new Date(doc.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Small>
        </header>
        <Separator className={styles.divider} />
        <MarkdownRenderer content={content} />
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  // only pre-render published docs at build time; drafts are still accessible via SSR
  const { getAllPublished } = await import("@/lib/content");
  const docs = await getAllPublished("doc");
  return docs.map((d) => ({ slug: d.slug }));
}
