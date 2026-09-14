import Image from "next/image";
import { H1, H2, Paragraph, Small, Link } from "@/components/typography";
import { AvailabilityBanner } from "@/components/availability-banner";
import { getAllPublished } from "@/modules/content/queries";
import { getAssetsForMany, isSvg, pickAsset } from "@/modules/assets/queries";
import { getAllProjects } from "@/modules/projects/queries";
import { getProjectIcon } from "@/modules/projects/icons";
import styles from "./home.module.css";

// non-writing content that flows into the Recent work feed, and where each
// type is routed. Posts are deliberately absent — they have their own section.
const WORK_TYPES = {
  design: { label: "Design", basePath: "designs" },
  thought: { label: "Thought", basePath: "thoughts" },
} as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// keyed by id, not slug: slugs are editable from /admin and a rename would
// silently drop the card from this page
const PROJECT_IDS = [
  "locus",
  "jaygriff-com",
  "engineering-ethics",
  "deep-dive",
];

export default async function Home() {
  const posts = await getAllPublished("post");
  const allProjects = await getAllProjects();
  const projects = PROJECT_IDS.map((id) =>
    allProjects.find((p) => p.id === id)
  ).filter((p) => p !== undefined);
  const projectAssets = await getAssetsForMany(
    "project",
    projects.map((p) => p.id)
  );

  const recent = posts.slice(0, 5);

  const [thoughts, designs] = await Promise.all([
    getAllPublished("thought"),
    getAllPublished("design"),
  ]);
  const recentWork = [...designs, ...thoughts]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return (
    <>
      <AvailabilityBanner />

      <section className={styles.hero}>
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

      {recentWork.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <H2 className={styles.sectionTitle}>Recent work</H2>
            <Paragraph className={styles.sectionIntro}>
              Designs and working notes, newest first.
            </Paragraph>
          </div>

          <div className={styles.recentList}>
            {recentWork.map((row) => {
              const { label, basePath } =
                WORK_TYPES[row.type as keyof typeof WORK_TYPES];
              return (
                <Link
                  key={row.id}
                  href={`/${basePath}/${row.slug}`}
                  className={styles.recentRow}
                >
                  <span className={styles.workMeta}>
                    <span className={styles.workType}>{label}</span>
                    <Small className={styles.recentDate}>
                      {formatDate(row.created_at)}
                    </Small>
                  </span>
                  <span className={styles.recentTitle}>{row.title}</span>
                  {row.description && (
                    <span className={styles.recentDesc}>{row.description}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
