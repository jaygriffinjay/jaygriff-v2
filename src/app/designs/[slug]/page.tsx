import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { ContentHeader } from "@/components/content-header";
import styles from "./design.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function DesignPage({ params }: Props) {
  const { slug } = await params;
  const design = await getContentBySlug(slug);

  if (!design || design.type !== "design" || !design.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <ContentHeader row={design} />
        <div className={styles.body}>
          <ContentBody row={design} />
        </div>
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
