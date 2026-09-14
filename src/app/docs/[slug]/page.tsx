import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { ContentHeader } from "@/components/content-header";
import styles from "./doc.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getContentBySlug(slug);

  if (!doc || doc.type !== "doc" || !doc.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <ContentHeader row={doc} />
        <div className={styles.body}>
          <ContentBody row={doc} />
        </div>
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
