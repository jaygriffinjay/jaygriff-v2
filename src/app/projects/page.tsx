import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getAssetsForMany } from "@/modules/assets/queries";
import { getAllProjects } from "@/modules/projects/queries";
import { isShowcased, showcaseRank } from "@/modules/projects/showcase";

import { ProjectRow } from "./project-row";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Personal tools and apps built by Jay Griffin.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const assets = await getAssetsForMany(
    "project",
    projects.map((p) => p.id)
  );

  const apps = projects
    .filter((p) => isShowcased(p.id))
    .sort((a, b) => showcaseRank(a.id) - showcaseRank(b.id));
  const experiments = projects.filter((p) => !isShowcased(p.id));

  return (
    <Container className="max-w-4xl">
      <div className={styles.header}>
        <H1>Projects</H1>
        <Paragraph className={styles.description}>Stuff I made</Paragraph>
      </div>
      <Separator className="my-6" />

      <h2 className={styles.sectionHeading}>Apps</h2>

      <div className={styles.rowList}>
        {apps.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            assets={assets.get(project.id)}
          />
        ))}
      </div>

      <h2 className={cn(styles.sectionHeading, styles.sectionSpaced)}>
        Experiments
      </h2>
      <p className={styles.sectionIntro}>
        Past projects that didn't necessarily turn into a production app or website.
      </p>
      <div className={styles.rowList}>
        {experiments.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            assets={assets.get(project.id)}
          />
        ))}
      </div>
    </Container>
  );
}
