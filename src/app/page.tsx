import Image from "next/image";
import { H1, H2, Paragraph, Small, Link } from "@/components/typography";
import { AvailabilityBanner } from "@/components/availability-banner";
import { getAllPublished } from "@/modules/content/queries";
import { getAssetsForMany, isSvg, pickAsset } from "@/modules/assets/queries";
import { getAllProjects } from "@/modules/projects/queries";
import { getProjectIcon } from "@/modules/projects/icons";
import styles from "./home.module.css";

// hand-picked slugs, rendered in this order; unmatched slugs are skipped
const FEATURED_SLUGS = [
  "how-i-learned-to-code",
  "how-i-use-ai",
  "content-pipeline-deep-dive",
  "frontmatter-is-a-dead-end",
  "programs-not-documents",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const PROJECT_SLUGS = [
  "locus",
  "jaygriff-com",
  "engineering-ethics",
  "deep-dive",
];

export default async function Home() {
  const posts = await getAllPublished("post");
  const allProjects = await getAllProjects();
  const projects = PROJECT_SLUGS.map((slug) =>
    allProjects.find((p) => p.slug === slug)
  ).filter((p) => p !== undefined);
  const projectAssets = await getAssetsForMany(
    "project",
    projects.map((p) => p.id)
  );

  const featured = FEATURED_SLUGS.map((slug) =>
    posts.find((post) => post.slug === slug),
  ).filter((post) => post !== undefined);

  const recent = posts
    .filter((post) => !FEATURED_SLUGS.includes(post.slug))
    .slice(0, 5);

  return (
    <>
      <AvailabilityBanner />

      <section className={styles.hero}>
        <Image
          src="/images/me.jpg"
          alt="Jay Griffin"
          width={200}
          height={200}
          priority
          className={styles.portrait}
        />
        <H1 className={styles.heading}>Hi, I'm Jay</H1>
        <Paragraph className={styles.subtitle}>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
        <div className={styles.actions}>
          <Link href="/projects" className={styles.primaryAction}>
            See what I&apos;ve built
          </Link>
          <Link href="/posts" className={styles.secondaryAction}>
            Read my writing
          </Link>
          <Link href="/about" className={styles.secondaryAction}>
            About me
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <H2 className={styles.sectionTitle}>Projects</H2>
          <Paragraph className={styles.sectionIntro}>
            A few things I&apos;ve built — click into any of them.
          </Paragraph>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => {
            const Icon = getProjectIcon(project.icon);
            const thumbnail = pickAsset(
              projectAssets.get(project.id),
              "thumbnail",
              "hero"
            );
            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={styles.cardLink}
              >
                {thumbnail && (
                  <span className={styles.cardThumb}>
                    <Image
                      src={thumbnail.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized={isSvg(thumbnail.url)}
                      className={styles.cardThumbImage}
                    />
                  </span>
                )}
                <span className={styles.cardIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.appCardTitle}>{project.title}</span>
                <span className={styles.appCardDesc}>{project.description}</span>
              </Link>
            );
          })}
        </div>

        <Paragraph className={styles.sectionFooter}>
          More in <Link href="/projects">projects</Link>.
        </Paragraph>
      </section>

      {featured.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <H2 className={styles.sectionTitle}>Featured writing</H2>
            <Paragraph className={styles.sectionIntro}>
              If you only read a few, read these.
            </Paragraph>
          </div>

          <div className={styles.grid}>
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={styles.cardLink}
              >
                <span className={styles.appCardTitle}>{post.title}</span>
                {post.description && (
                  <span className={styles.appCardDesc}>{post.description}</span>
                )}
                <Small className={styles.postDate}>
                  {formatDate(post.created_at)}
                </Small>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <H2 className={styles.sectionTitle}>Recent writing</H2>
            <Paragraph className={styles.sectionIntro}>
              What I&apos;ve been working through lately.
            </Paragraph>
          </div>

          <div className={styles.recentList}>
            {recent.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={styles.recentRow}
              >
                <span className={styles.recentTitle}>{post.title}</span>
                {post.description && (
                  <span className={styles.recentDesc}>{post.description}</span>
                )}
                <Small className={styles.recentDate}>
                  {formatDate(post.created_at)}
                </Small>
              </Link>
            ))}
          </div>

          <Paragraph className={styles.sectionFooter}>
            Everything in <Link href="/posts">posts</Link>.
          </Paragraph>
        </section>
      )}
    </>
  );
}
