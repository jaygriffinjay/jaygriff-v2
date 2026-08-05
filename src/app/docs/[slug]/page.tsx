import { notFound } from "next/navigation";
import { getContentBySlug, readMarkdownFile } from "@/modules/content/queries";
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

  // TSX content: dynamic import the module and render its default export.
  // Path is relative to this file (src/app/docs/[slug]/page.tsx) reaching
  // up to repo root then into content/tsx/.
  let body: React.ReactNode;
  if (doc.format === "tsx") {
    // file_path looks like "content/tsx/foo.tsx" — strip prefix + extension
    const rel = doc.file_path.replace(/^content\/tsx\//, "").replace(/\.tsx$/, "");
    const mod = await import(`../../../../content/tsx/${rel}.tsx`);
    const Component = mod.default as React.ComponentType;
    body = <Component />;
  } else {
    const content = readMarkdownFile(doc.file_path);
    body = <MarkdownRenderer content={content} />;
  }

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
        {body}
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  // only pre-render published docs at build time; drafts are still accessible via SSR
  const { getAllPublished } = await import("@/modules/content/queries");
  const docs = await getAllPublished("doc");
  return docs.map((d) => ({ slug: d.slug }));
}
