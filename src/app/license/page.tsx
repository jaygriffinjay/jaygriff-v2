import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import {
  H1,
  H2,
  Paragraph,
  Link,
  List,
  ListItem,
  InlineCode,
  Bold,
} from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import styles from "./license.module.css";

export const metadata: Metadata = {
  title: "License",
  description:
    "How the code and writing on this site are licensed, and what you're free to do with them.",
};

const REPO = "https://github.com/jaygriffinjay/jaygriff-v2/blob/main";

export default function LicensePage() {
  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <H1>License</H1>
        <Paragraph className={styles.intro}>
          This site and everything behind it is open. Here&apos;s exactly what
          you can do with it.
        </Paragraph>
      </header>

      <Separator className={styles.divider} />

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>The short version</H2>
        <Paragraph>
          The code is <Bold>MIT</Bold> — take it, fork it, ship it, sell it. The
          writing is <Bold>CC BY-NC-SA 4.0</Bold> — share and adapt it
          non-commercially, credit me, and keep derivatives under the same
          license. Code samples inside the posts are MIT, so you never have to
          think about the NC term to use something you read here.
        </Paragraph>
      </section>

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>Code</H2>
        <Paragraph>
          Licensed under the{" "}
          <Link href={`${REPO}/LICENSE-CODE`}>MIT License</Link>. That covers
          the application itself, the components, the content pipeline, and the
          configuration:
        </Paragraph>
        <List className={styles.list}>
          <ListItem>
            <InlineCode>src/</InlineCode> — app, components, and pipeline
            scripts
          </ListItem>
          <ListItem>
            <InlineCode>.github/</InlineCode> — instructions, skills, workflows
          </ListItem>
          <ListItem>Root config files</ListItem>
        </List>
        <Paragraph>
          Do whatever you want with it. Attribution is appreciated but not
          required.
        </Paragraph>
      </section>

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>Writing and images</H2>
        <Paragraph>
          Licensed under{" "}
          <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            CC BY-NC-SA 4.0
          </Link>
          . That covers the posts, docs, project write-ups, notes, and
          photographs.
        </Paragraph>
        <Paragraph>You may:</Paragraph>
        <List className={styles.list}>
          <ListItem>Quote, excerpt, and link to anything here</ListItem>
          <ListItem>
            Translate a post, or republish it somewhere non-commercial
          </ListItem>
          <ListItem>Build on it, as long as you say where it came from</ListItem>
        </List>
        <Paragraph>The conditions:</Paragraph>
        <List className={styles.list}>
          <ListItem>
            <Bold>Attribution</Bold> — credit me and link back to the original
          </ListItem>
          <ListItem>
            <Bold>NonCommercial</Bold> — don&apos;t republish it in full behind
            ads or a paywall
          </ListItem>
          <ListItem>
            <Bold>ShareAlike</Bold> — derivatives carry the same license
          </ListItem>
        </List>
        <Paragraph>
          Want to use something commercially? Just{" "}
          <Link href="/contact">ask me</Link>. I&apos;m easy to convince.
        </Paragraph>
      </section>

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>Things that aren&apos;t mine</H2>
        <Paragraph>
          A few things here belong to other people and aren&apos;t covered by
          either license above:
        </Paragraph>
        <List className={styles.list}>
          <ListItem>
            The tool and company logos are trademarks of their owners, shown for
            identification only
          </ListItem>
          <ListItem>
            The Sekuya typeface is{" "}
            <Link href="/Sekuya-OFL.txt">SIL Open Font License 1.1</Link>,
            copyright 2024 The SEKUYA Project Authors
          </ListItem>
          <ListItem>
            Dependencies carry whatever license their authors chose
          </ListItem>
        </List>
      </section>

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>Why bother</H2>
        <Paragraph>
          Mostly so nobody has to guess. The code being MIT is the whole point
          of publishing it. The writing is stricter because reposting a full
          article somewhere commercial doesn&apos;t send readers here, it just
          makes a second copy — and if I ever collect these into something
          bigger, I&apos;d like that to still be mine to do.
        </Paragraph>
        <Paragraph>
          The full breakdown, path by path, lives in{" "}
          <Link href={`${REPO}/LICENSE`}>LICENSE</Link> in the repo.
        </Paragraph>
      </section>
    </Container>
  );
}
