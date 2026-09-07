"use client";

import { useState } from "react";
import { ArrowUpRightIcon, ChromeIcon, GithubIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/footer/logo";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  byGroup,
  byStage,
  describeLink,
  LAB_PROJECTS,
  STAGE_LABEL,
  type LabProject,
  type Stage,
} from "./data";
import styles from "./projects-lab.module.css";

const VARIANTS = [
  { id: "a", label: "A · Flat grid", note: "Everything together, no signal. The current behaviour — shown as a baseline to argue against." },
  { id: "b", label: "B · Grid + archive", note: "Live and benched in the grid. Shelved drops to a text-only archive with a framing sentence." },
  { id: "c", label: "C · Grouped", note: "Three labelled groups. Honest, but gives dead projects equal visual weight." },
  { id: "d", label: "D · All text", note: "No images at all. Title plus one sentence. Fastest to scan, cheapest to maintain." },
  { id: "e", label: "E · Learned-forward", note: "Shelved projects lead with the lesson instead of the product." },
  { id: "f", label: "F · Mini thumb rows", note: "Reddit-style: a small thumbnail to catch the eye, then title and one sentence. No buttons, no big art." },
  { id: "g", label: "G · Destination rows", note: "No status badge. Live is proven by showing where the row points; nothing to click says the rest." },
  { id: "h", label: "H · Apps / Experiments", note: "Same rows, split by what the reader gets. Apps are usable by a stranger. Experiments are things I built and learned from." },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

function Thumb({ project }: { project: LabProject }) {
  return (
    <div
      className={styles.thumb}
      style={{ backgroundColor: `oklch(0.55 0.12 ${project.hue})` }}
    >
      placeholder
    </div>
  );
}

function StagePill({ stage }: { stage: Stage }) {
  if (stage === "live") return null;
  return (
    <span
      className={cn(
        styles.pill,
        stage === "benched" ? styles.pillBenched : styles.pillShelved
      )}
    >
      {STAGE_LABEL[stage]}
    </span>
  );
}

function Card({ project, pill = true }: { project: LabProject; pill?: boolean }) {
  return (
    <div className={styles.card}>
      <Thumb project={project} />
      <div className={styles.cardHead}>
        <span className={styles.cardTitle}>{project.title}</span>
        {pill && <StagePill stage={project.stage} />}
      </div>
      <span className={styles.cardTagline}>{project.tagline}</span>
      <div className={styles.cardTags}>
        {project.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function Grid({ projects }: { projects: LabProject[] }) {
  return (
    <div className={styles.grid}>
      {projects.map((p) => (
        <Card key={p.slug} project={p} />
      ))}
    </div>
  );
}

const BRAND_ICON: Record<string, typeof ChromeIcon> = {
  "Chrome Web Store": ChromeIcon,
  GitHub: GithubIcon,
};

function DestinationPill({ project }: { project: LabProject }) {
  if (!project.url) {
    return <span className={styles.noHost}>not published</span>;
  }

  const { label, kind } = describeLink(project.url);
  const Icon = BRAND_ICON[label] ?? ArrowUpRightIcon;

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkPill}
    >
      {kind === "internal" ? (
        <Logo aria-hidden="true" className={styles.linkLogo} />
      ) : (
        <Icon aria-hidden="true" className={styles.linkIcon} />
      )}
      {label}
    </a>
  );
}

function DestinationRow({ project }: { project: LabProject }) {
  return (
    <div className={styles.miniRow}>
      <div
        className={styles.miniThumb}
        style={{ backgroundColor: `oklch(0.55 0.12 ${project.hue})` }}
      />
      <div className={styles.rowBody}>
        <span className={styles.miniTitle}>{project.title}</span>
        <span className={styles.miniNote}>{project.tagline}</span>
      </div>
      <DestinationPill project={project} />
    </div>
  );
}

export function ProjectsLab() {
  const [variant, setVariant] = useState<VariantId>("b");
  const active = VARIANTS.find((v) => v.id === variant)!;

  return (
    <>
      <div className={styles.switcher}>
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVariant(v.id)}
            className={cn(
              styles.switchButton,
              v.id === variant && styles.switchButtonActive
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <H1>Projects</H1>
      <Paragraph className={styles.variantNote}>{active.note}</Paragraph>
      <Separator className="mb-6" />

      {variant === "a" && <Grid projects={LAB_PROJECTS} />}

      {variant === "b" && (
        <>
          <Grid projects={[...byStage("live"), ...byStage("benched")]} />
          <div className={styles.archive}>
            <h2 className={styles.archiveHeading}>Archive</h2>
            <p className={styles.archiveIntro}>
              Things I stopped working on. Kept because I learned something.
            </p>
            <div className={styles.archiveList}>
              {byStage("shelved").map((p) => (
                <div key={p.slug} className={styles.archiveRow}>
                  <span className={styles.archiveTitle}>{p.title}</span>
                  <span className={styles.archiveNote}>{p.tagline}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {variant === "c" &&
        (["live", "benched", "shelved"] as Stage[]).map((stage) => (
          <div key={stage}>
            <h2 className={styles.groupHeading}>{STAGE_LABEL[stage]}</h2>
            <Grid projects={byStage(stage)} />
          </div>
        ))}

      {variant === "d" && (
        <div className={styles.textList}>
          {LAB_PROJECTS.map((p) => (
            <div
              key={p.slug}
              className={cn(
                styles.textRow,
                p.stage === "shelved" && styles.textRowMuted
              )}
            >
              <span className={styles.textTitle}>
                {p.title} <StagePill stage={p.stage} />
              </span>
              <span className={styles.textNote}>{p.tagline}</span>
            </div>
          ))}
        </div>
      )}

      {variant === "e" && (
        <>
          <Grid projects={[...byStage("live"), ...byStage("benched")]} />
          <div className={styles.archive}>
            <h2 className={styles.archiveHeading}>What I learned elsewhere</h2>
            <p className={styles.archiveIntro}>
              Projects that never shipped, and the thing each one taught me.
            </p>
            <div className={styles.grid}>
              {byStage("shelved").map((p) => (
                <div key={p.slug} className={styles.learnCard}>
                  <span className={styles.learnLesson}>{p.learned}</span>
                  <span className={styles.learnFrom}>from {p.title}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {variant === "f" && (
        <div className={styles.miniList}>
          {LAB_PROJECTS.map((p) => (
            <div
              key={p.slug}
              className={cn(
                styles.miniRow,
                p.stage === "shelved" && styles.miniRowMuted
              )}
            >
              <div
                className={styles.miniThumb}
                style={{ backgroundColor: `oklch(0.55 0.12 ${p.hue})` }}
              />
              <div className={styles.miniBody}>
                <span className={styles.miniTitle}>
                  {p.title}
                  <StagePill stage={p.stage} />
                </span>
                <span className={styles.miniNote}>{p.tagline}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "g" && (
        <div className={styles.miniList}>
          {LAB_PROJECTS.map((p) => (
            <div key={p.slug} className={styles.miniRow}>
              <div
                className={styles.miniThumb}
                style={{ backgroundColor: `oklch(0.55 0.12 ${p.hue})` }}
              />
              <div className={styles.rowBody}>
                <span className={styles.miniTitle}>{p.title}</span>
                <span className={styles.miniNote}>{p.tagline}</span>
              </div>
              <DestinationPill project={p} />
            </div>
          ))}
        </div>
      )}

      {variant === "h" && (
        <>
          <h2 className={styles.groupHeading}>Apps</h2>
          <p className={styles.archiveIntro}>
            Things you can open and use right now.
          </p>
          <div className={styles.miniList}>
            {byGroup("app").map((p) => (
              <DestinationRow key={p.slug} project={p} />
            ))}
          </div>

          <h2 className={cn(styles.groupHeading, styles.groupHeadingSpaced)}>
            Experiments
          </h2>
          <p className={styles.archiveIntro}>
            Built to learn something. Some are v1s of ideas I want to take
            further.
          </p>
          <div className={styles.miniList}>
            {byGroup("experiment").map((p) => (
              <DestinationRow key={p.slug} project={p} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
