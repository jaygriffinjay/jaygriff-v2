import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { ContentHeader } from "@/components/content-header";
import styles from "./thought.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function ThoughtPage({ params }: Props) {
  const { slug } = await params;
  const thought = await getContentBySlug(slug);

  if (!thought || thought.type !== "thought" || !thought.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <ContentHeader row={thought} />
        <div className={styles.body}>
          <ContentBody row={thought} />
        </div>
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  const { getAllPublished } = await import("@/modules/content/queries");
  const thoughts = await getAllPublished("thought");
  return thoughts.map((t) => ({ slug: t.slug }));
}
