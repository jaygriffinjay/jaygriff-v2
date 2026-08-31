import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { H1, H2, Paragraph, Small } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { getContentByProject } from "@/modules/content/queries";
import { getAllProjects, getProjectBySlug } from "@/modules/projects/queries";
import { getProjectIcon } from "@/modules/projects/icons";
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
  const Icon = getProjectIcon(project.icon);

  return (
    <Container className="max-w-3xl">
      <NextLink href="/projects" className={styles.backLink}>
        <ArrowLeftIcon aria-hidden="true" />
        Projects
      </NextLink>
      <header className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <Icon />
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
    </Container>
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
