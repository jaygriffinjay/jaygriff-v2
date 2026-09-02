import { getAllPublished } from "@/modules/content/queries";
import type { ContentRow } from "@/modules/content/queries";
import {
  THOUGHT_COLLECTIONS,
  collectionMembers,
  uncollected,
} from "@/modules/content/collections";
import { H1, H2, Paragraph, Small, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { HandwrittenBadge } from "@/components/handwritten-badge";
import styles from "./thoughts.module.css";

function ThoughtGrid({ rows }: { rows: ContentRow[] }) {
  return (
    <div className={styles.grid}>
      {rows.map((thought) => (
        <Link
          key={thought.slug}
          href={`/thoughts/${thought.slug}`}
          className={styles.cardLink}
        >
          <span className={styles.cardTitle}>{thought.title}</span>
          {thought.description && (
            <span className={styles.cardDesc}>{thought.description}</span>
          )}
          <Small className={styles.cardDate}>
            {new Date(thought.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <HandwrittenBadge authorship={thought.authorship} className="ml-2" />
          </Small>
        </Link>
      ))}
    </div>
  );
}

export default async function ThoughtsPage() {
  const thoughts = await getAllPublished("thought");
  const rest = uncollected(thoughts);

  return (
    <Container className="max-w-4xl">
      <div className="space-y-2">
        <H1>Thoughts &amp; Ideas</H1>
        <Paragraph className="text-lg text-muted-foreground">
          Notes, half-formed ideas, and things I was chewing on. Dated on
          purpose — these are passing thoughts, not positions I still hold.
        </Paragraph>
      </div>

      <Separator className="my-6" />

      {thoughts.length === 0 ? (
        <Paragraph className="text-muted-foreground">Nothing published yet.</Paragraph>
      ) : (
        <>
          {THOUGHT_COLLECTIONS.map((collection) => {
            const members = collectionMembers(thoughts, collection);
            if (members.length === 0) return null;
            return (
              <section key={collection.slug} className={styles.section}>
                <div className={styles.sectionHead}>
                  <H2 className={styles.sectionTitle}>{collection.title}</H2>
                  <Paragraph className={styles.sectionIntro}>
                    {collection.description}
                  </Paragraph>
                </div>
                <ThoughtGrid rows={members} />
              </section>
            );
          })}

          {rest.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <H2 className={styles.sectionTitle}>Everything else</H2>
              </div>
              <ThoughtGrid rows={rest} />
            </section>
          )}
        </>
      )}
    </Container>
  );
}

