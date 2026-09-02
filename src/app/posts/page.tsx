import { getAllPublished } from "@/modules/content/queries";
import { H1, Paragraph, Small, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { HandwrittenBadge } from "@/components/handwritten-badge";
import styles from "./posts.module.css";

export default async function PostsPage() {
  const posts = await getAllPublished("post");

  return (
    <Container className="max-w-4xl">
      <div className="space-y-2">
        <H1>Posts</H1>
        <Paragraph className="text-lg text-muted-foreground">
          Writing, opinions, and longer-form thoughts.
        </Paragraph>
      </div>

      <Separator className="my-6" />

      {posts.length === 0 ? (
        <Paragraph className="text-muted-foreground">Nothing published yet.</Paragraph>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className={styles.cardLink}>
              <span className={styles.cardTitle}>{post.title}</span>
              {post.description && (
                <span className={styles.cardDesc}>{post.description}</span>
              )}
              <Small className={styles.cardDate}>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <HandwrittenBadge authorship={post.authorship} className="ml-2" />
              </Small>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
