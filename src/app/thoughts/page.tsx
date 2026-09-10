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
import { DisclosureNotice } from "@/components/content-disclosure";
import styles from "./thoughts.module.css";

function ThoughtGrid({ rows }: { rows: ContentRow[] }) {
  return (
    <ul className={styles.list}>
      {rows.map((thought) => (
        <li key={thought.slug}>
          <Link href={`/thoughts/${thought.slug}`} className={styles.row}>
            <span className={styles.rowTitle}>{thought.title}</span>
            <span className={styles.rowMeta}>
              <HandwrittenBadge authorship={thought.authorship} />
              <Small className={styles.rowDate}>
                {new Date(thought.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </Small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function ThoughtsPage() {
  const thoughts = await getAllPublished("thought");
  const rest = uncollected(thoughts);

  return (
    <Container className="max-w-4xl">
      <div className="space-y-4">
        <H1>Thoughts &amp; Ideas</H1>
        <DisclosureNotice>
          Mostly AI-generated artifacts of work I did with a coding agent. See {" "}
          <Link href="/posts">posts</Link> for my actual writing.
        </DisclosureNotice>
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

