import { getAllPublished } from "@/modules/content/queries";
import { H1, Paragraph, Small, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import styles from "./docs.module.css";

export default async function DocsPage() {
  const docs = await getAllPublished("doc");

  return (
    <Container className="max-w-4xl">
      <div className="space-y-2">
        <H1>Docs</H1>
        <Paragraph className="text-lg text-muted-foreground">
          Reference material, technical notes, and how-tos.
        </Paragraph>
      </div>

      <Separator className="my-6" />

      {docs.length === 0 ? (
        <Paragraph className="text-muted-foreground">Nothing published yet.</Paragraph>
      ) : (
        <div className={styles.grid}>
          {docs.map((doc) => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`} className={styles.cardLink}>
              <span className={styles.cardTitle}>{doc.title}</span>
              {doc.description && (
                <span className={styles.cardDesc}>{doc.description}</span>
              )}
              <Small className={styles.cardDate}>
                {new Date(doc.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Small>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
