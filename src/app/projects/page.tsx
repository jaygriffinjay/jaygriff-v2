import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { getAssetsForMany, isSvg, pickAsset } from "@/modules/assets/queries";
import { getAllProjects } from "@/modules/projects/queries";
import { getProjectIcon } from "@/modules/projects/icons";
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
          const rows = assets.get(project.id);
          const logo = pickAsset(rows, "logo");
          const thumbnail = pickAsset(rows, "thumbnail", "hero");
          const Icon = getProjectIcon(project.icon);
          return (
            <NextLink
              key={project.id}
              href={`/projects/${project.slug}`}
              className={styles.cardLink}
            >
              {thumbnail && (
                <span className={styles.cardThumb}>
                  <Image
                    src={thumbnail.url}
                    alt=""
                    // 0/0 + sizes lets the intrinsic ratio drive height instead of a fixed box
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    unoptimized={isSvg(thumbnail.url)}
                    className={styles.cardThumbImage}
                  />
                </span>
              )}
              <span className={styles.cardIcon} aria-hidden="true">
                {logo ? (
                  <Image
                    src={logo.url}
                    alt=""
                    width={18}
                    height={18}
                    unoptimized={isSvg(logo.url)}
                    className={styles.cardLogo}
                  />
                ) : (
                  <Icon />
                )}
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
