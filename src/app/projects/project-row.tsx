import Image from "next/image";
import NextLink from "next/link";
import { ArrowUpRightIcon, ChromeIcon, GithubIcon } from "lucide-react";

import { Logo } from "@/components/footer/logo";
import { isSvg, pickAsset, type AssetRow } from "@/modules/assets/queries";
import { describeLink, projectUrl } from "@/modules/projects/links";
import { getProjectIcon } from "@/modules/projects/icons";
import type { ProjectRow as Project } from "@/modules/projects/queries";

import styles from "./projects.module.css";

const BRAND_ICON: Record<string, typeof ChromeIcon> = {
  "Chrome Web Store": ChromeIcon,
  GitHub: GithubIcon,
};

function DestinationPill({ project }: { project: Project }) {
  const url = projectUrl(project);
  if (!url) return <span className={styles.noLink}>not published</span>;

  const { label, kind } = describeLink(url);
  const Icon = BRAND_ICON[label] ?? ArrowUpRightIcon;
  const external = !url.startsWith("/");

  return (
    <a
      href={url}
      className={styles.linkPill}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {kind === "internal" ? (
        <Logo aria-hidden="true" className={styles.linkLogo} />
      ) : (
        <Icon aria-hidden="true" className={styles.linkIcon} />
      )}
      <span className={styles.linkLabel}>{label}</span>
    </a>
  );
}

export function ProjectRow({
  project,
  assets,
}: {
  project: Project;
  assets: AssetRow[] | undefined;
}) {
  // a logo reads better than a screenshot at 48px, so it wins when both exist
  const logo = pickAsset(assets, "logo");
  const thumbnail = logo ?? pickAsset(assets, "thumbnail", "hero");
  const Icon = getProjectIcon(project.icon);

  return (
    <div className={styles.row}>
      <span className={styles.rowThumb} aria-hidden="true">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt=""
            fill
            sizes="48px"
            unoptimized={isSvg(thumbnail.url)}
            className={logo ? styles.rowThumbLogo : styles.rowThumbImage}
          />
        ) : (
          <Icon />
        )}
      </span>

      <span className={styles.rowBody}>
        {/* title carries the row link; the pill is a sibling so anchors don't nest */}
        <NextLink
          href={`/projects/${project.slug}`}
          className={styles.rowTitle}
        >
          {project.title}
        </NextLink>
        <span className={styles.rowTagline}>
          {project.tagline ?? project.description}
        </span>
      </span>

      <span className={styles.rowLink}>
        <DestinationPill project={project} />
      </span>
    </div>
  );
}
