import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import styles from "./post.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug(slug);

  if (!post || post.type !== "post" || !post.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <header className={styles.header}>
          <H1>{post.title}</H1>
          {post.description && (
            <Paragraph className={styles.description}>{post.description}</Paragraph>
          )}
          <Small>{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Small>
        </header>
        <Separator className={styles.divider} />
        <ContentBody row={post} />
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  const { getAllPublished } = await import("@/modules/content/queries");
  const posts = await getAllPublished("post");
  return posts.map((p) => ({ slug: p.slug }));
}
