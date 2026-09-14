import { getAllPublished } from "@/modules/content/queries";
import type { ContentRow } from "@/modules/content/queries";
import {
  POST_COLLECTIONS,
  collectionMembers,
  uncollected,
} from "@/modules/content/collections";
import { H1, H2, Paragraph, Small, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { HandwrittenBadge } from "@/components/handwritten-badge";
import styles from "./posts.module.css";

function PostGrid({ rows }: { rows: ContentRow[] }) {
  return (
    <div className={styles.grid}>
      {rows.map((post) => (
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
  );
}

export default async function PostsPage() {
  const posts = await getAllPublished("post");
  const rest = uncollected(posts, POST_COLLECTIONS);

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
        <>
          {rest.length > 0 && <PostGrid rows={rest} />}

          {POST_COLLECTIONS.map((collection) => {
            const members = collectionMembers(posts, collection, POST_COLLECTIONS);
            if (members.length === 0) return null;
            return (
              <section key={collection.slug} className={styles.section}>
                <div className={styles.sectionHead}>
                  <H2 className={styles.sectionTitle}>{collection.title}</H2>
                  {collection.description && (
                    <Paragraph className={styles.sectionIntro}>
                      {collection.description}
                    </Paragraph>
                  )}
                </div>
                <PostGrid rows={members} />
              </section>
            );
          })}
        </>
      )}
    </Container>
  );
}
