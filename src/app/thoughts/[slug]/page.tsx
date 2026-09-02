import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { HandwrittenBadge } from "@/components/handwritten-badge";
import styles from "./thought.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function ThoughtPage({ params }: Props) {
  const { slug } = await params;
  const thought = await getContentBySlug(slug);

  if (!thought || thought.type !== "thought" || !thought.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <header className={styles.header}>
          <H1>{thought.title}</H1>
          {thought.description && (
            <Paragraph className={styles.description}>{thought.description}</Paragraph>
          )}
          <Small>
            {new Date(thought.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            <HandwrittenBadge authorship={thought.authorship} className="ml-2" />
          </Small>
        </header>
        <Separator className={styles.divider} />
        <ContentBody row={thought} />
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  const { getAllPublished } = await import("@/modules/content/queries");
  const thoughts = await getAllPublished("thought");
  return thoughts.map((t) => ({ slug: t.slug }));
}
