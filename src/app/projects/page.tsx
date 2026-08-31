import type { Metadata } from "next";
import NextLink from "next/link";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { getAllProjects } from "@/modules/projects/queries";
import { getProjectIcon } from "@/modules/projects/icons";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Personal tools and apps built by Jay Griffin.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <Container className="max-w-4xl">
      <div className={styles.header}>
        <H1>Projects</H1>
        <Paragraph className={styles.description}>
          Stuff I made
        </Paragraph>
      </div>
      <Separator className="my-6" />
      <div className={styles.grid}>
        {projects.map((project) => {
          const Icon = getProjectIcon(project.icon);
          return (
            <NextLink
              key={project.id}
              href={`/projects/${project.slug}`}
              className={styles.cardLink}
            >
              <span className={styles.cardIcon} aria-hidden="true">
                <Icon />
              </span>
              <span className={styles.cardTitle}>{project.title}</span>
              <span className={styles.cardDescription}>
                {project.tagline ?? project.description}
              </span>
            </NextLink>
          );
        })}
      </div>
    </Container>
  );
}
