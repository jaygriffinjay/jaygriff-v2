import { notFound } from "next/navigation";
import { getContentBySlug } from "@/modules/content/queries";
import { ContentBody } from "@/modules/content/render";
import { Container } from "@/components/layout/Container";
import { ContentHeader } from "@/components/content-header";
import styles from "./post.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug(slug);

  if (!post || post.type !== "post" || !post.file_path) notFound();

  return (
    <Container>
      <article className={styles.article}>
        <ContentHeader row={post} />
        <div className={styles.body}>
          <ContentBody row={post} />
        </div>
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  const { getAllPublished } = await import("@/modules/content/queries");
  const posts = await getAllPublished("post");
  return posts.map((p) => ({ slug: p.slug }));
}
