import { notFound } from "next/navigation";
import { getContentBySlug, readMarkdownFile } from "@/modules/content/queries";
import MarkdownRenderer from "@/components/markdown-renderer/MarkdownRenderer";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import styles from "./post.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug(slug);

  if (!post || post.type !== "post" || !post.file_path) notFound();

  let body: React.ReactNode;
  if (post.format === "tsx") {
    const rel = post.file_path.replace(/^content\/tsx\//, "").replace(/\.tsx$/, "");
    const mod = await import(`../../../../content/tsx/${rel}.tsx`);
    const Component = mod.default as React.ComponentType;
    body = <Component />;
  } else {
    const content = readMarkdownFile(post.file_path);
    body = <MarkdownRenderer content={content} />;
  }

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
        {body}
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  const { getAllPublished } = await import("@/modules/content/queries");
  const posts = await getAllPublished("post");
  return posts.map((p) => ({ slug: p.slug }));
}
