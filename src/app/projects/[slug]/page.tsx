import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { H1, H2, List, ListItem, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { getAssetsFor, isSvg, pickAsset } from "@/modules/assets/queries";
import { getContentByProject } from "@/modules/content/queries";
import { getAllProjects, getProjectBySlug } from "@/modules/projects/queries";
import { getProjectIcon } from "@/modules/projects/icons";
import { versionsFor, type ProjectVersion } from "@/modules/projects/versions";
import styles from "./project.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline ?? project.description ?? undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getContentByProject(project.id);
  const docs = related.filter((row) => row.type === "doc");
  const posts = related.filter((row) => row.type === "post");
  const thoughts = related.filter((row) => row.type === "thought");
  const Icon = getProjectIcon(project.icon);

  const assets = await getAssetsFor("project", project.id);
  const logo = pickAsset(assets, "logo");
  const hero = pickAsset(assets, "hero", "thumbnail");

  return (
    <Container className="max-w-3xl">
      <NextLink href="/projects" className={styles.backLink}>
        <ArrowLeftIcon aria-hidden="true" />
        Projects
      </NextLink>
      <header className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          {logo ? (
            <Image
              src={logo.url}
              alt=""
              width={24}
              height={24}
              unoptimized={isSvg(logo.url)}
              className={styles.logo}
            />
          ) : (
            <Icon />
          )}
        </span>
        <H1>{project.title}</H1>
        {project.tagline && (
          <Paragraph className={styles.tagline}>{project.tagline}</Paragraph>
        )}
        {project.tags && project.tags.length > 0 && (
          <ul className={styles.tags}>
            {project.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className={styles.actions}>
          {project.app_href && (
            <NextLink href={project.app_href} className={styles.primaryAction}>
              Open {project.title}
            </NextLink>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              className={styles.secondaryAction}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              className={styles.secondaryAction}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          )}
        </div>
      </header>

      <Separator className="my-6" />

      {hero && (
        <div className={styles.hero}>
          <Image
            src={hero.url}
            alt={`${project.title} preview`}
            // 0/0 + sizes lets the intrinsic ratio drive height instead of a fixed box
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            unoptimized={isSvg(hero.url)}
            className={styles.heroImage}
          />
        </div>
      )}

      {project.description && (
        <Paragraph className={styles.description}>{project.description}</Paragraph>
      )}

      {project.video_url && (
        <div className={styles.video}>
          <iframe
            src={project.video_url}
            title={`${project.title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoFrame}
          />
        </div>
      )}

      <ContentSection title="Docs" basePath="docs" rows={docs} />
      <ContentSection title="Posts" basePath="posts" rows={posts} />
      <VersionCapsule versions={versionsFor(project.id)} />
      <ThoughtList rows={thoughts} />
    </Container>
  );
}

/** Earlier incarnations of the same project, kept online as a time capsule. */
function VersionCapsule({ versions }: { versions: ProjectVersion[] }) {
  if (versions.length === 0) return null;

  return (
    <section className={styles.versionsSection}>
      <H2 className={styles.versionsTitle}>Previous versions</H2>
      <Paragraph className={styles.versionsIntro}>
        Still online, untouched. A record of where this started.
      </Paragraph>
      <List className={styles.versionsList}>
        {versions.map((version) => (
          <ListItem key={version.label}>
            <a
              href={version.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.versionLink}
            >
              <span className={styles.versionLabel}>{version.label}</span>
              <span className={styles.versionNote}>{version.note}</span>
              <span className={styles.versionHost}>
                {version.href.replace(/^https?:\/\//, "")}
              </span>
            </a>
          </ListItem>
        ))}
      </List>
    </section>
  );
}

/** Working notes, not documentation: a dense link list, deliberately quiet. */
function ThoughtList({
  rows,
}: {
  rows: Awaited<ReturnType<typeof getContentByProject>>;
}) {
  if (rows.length === 0) return null;

  return (
    <section className={styles.notesSection}>
      <H2 className={styles.notesTitle}>Thoughts</H2>
      <Paragraph className={styles.notesIntro}>
        🤖 Mostly AI-generated summaries of work I did with a coding agent while working on this project.
      </Paragraph>
      <List className={styles.notesList}>
        {rows.map((row) => (
          <ListItem key={row.id}>
            <NextLink href={`/thoughts/${row.slug}`} className={styles.noteLink}>
              <span className={styles.noteTitle}>{row.title}</span>
              <span className={styles.noteDate}>
                {new Date(row.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </NextLink>
          </ListItem>
        ))}
      </List>
    </section>
  );
}

function ContentSection({
  title,
  basePath,
  rows,
}: {
  title: string;
  basePath: string;
  rows: Awaited<ReturnType<typeof getContentByProject>>;
}) {
  if (rows.length === 0) return null;

  return (
    <section className={styles.section}>
      <H2 className={styles.sectionTitle}>{title}</H2>
      <div className={styles.list}>
        {rows.map((row) => (
          <NextLink
            key={row.id}
            href={`/${basePath}/${row.slug}`}
            className={styles.row}
          >
            <span className={styles.rowTitle}>{row.title}</span>
            {row.description && (
              <span className={styles.rowDescription}>{row.description}</span>
            )}
            <Small className={styles.rowDate}>
              {new Date(row.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Small>
          </NextLink>
        ))}
      </div>
    </section>
  );
}
