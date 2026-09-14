import type { Metadata } from "next";
import NextLink from "next/link";

import { Container } from "@/components/layout/Container";
import { H1, H2, H3, Link } from "@/components/typography";
import { AvailabilityBanner } from "@/components/availability-banner";
import { DownloadButton } from "./download-button";
import {
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  NAME,
  PROJECTS,
  SKILLS,
} from "./resume-data";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Jay Griffin — full-stack developer. Projects, skills, experience, and education.",
};

export default function ResumePage() {
  return (
    <>
      <AvailabilityBanner className={styles.banner} />

      <Container className={styles.container}>
        <header className={styles.header}>
          <DownloadButton className={styles.download} />

          <H1 className={styles.name}>{NAME}</H1>

          <div className={styles.contact}>
            {CONTACT.map(({ label, href }, index) => (
              <span key={href} className={styles.contactItem}>
                {index > 0 && (
                  <span className={styles.contactDot} aria-hidden="true">
                    •
                  </span>
                )}
                <NextLink href={href} className={styles.contactLink}>
                  {label}
                </NextLink>
              </span>
            ))}
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <H2 className={styles.sectionTitle}>Projects</H2>
            <Link href="/projects" className={styles.sectionLink}>
              jaygriff.com/projects
            </Link>
          </div>

          {PROJECTS.map(({ name, slug, tagline, bullets }) => (
            <article key={name} className={styles.entry}>
              <H3 className={styles.entryTitle}>
                <NextLink href={`/projects/${slug}`} className={styles.entryLink}>
                  {name}
                </NextLink>
                <span className={styles.tagline}> — {tagline}</span>
              </H3>
              <ul className={styles.bullets}>
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <H2 className={styles.sectionTitle}>Core Skills</H2>
            <Link href="/my-stack" className={styles.sectionLink}>
              jaygriff.com/my-stack
            </Link>
          </div>

          <dl className={styles.skills}>
            {SKILLS.map(({ label, items }) => (
              <div key={label} className={styles.skillRow}>
                <dt className={styles.skillLabel}>{label}</dt>
                <dd className={styles.skillItems}>{items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <H2 className={styles.sectionTitle}>Experience</H2>
          </div>

          {EXPERIENCE.map(({ role, org, dates, bullets }) => (
            <article key={role} className={styles.entry}>
              <div className={styles.entryHeader}>
                <H3 className={styles.entryTitle}>
                  {role}
                  <span className={styles.tagline}> — {org}</span>
                </H3>
                <span className={styles.dates}>{dates}</span>
              </div>
              <ul className={styles.bullets}>
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <H2 className={styles.sectionTitle}>Education</H2>
          </div>

          {EDUCATION.map(({ degree, school, dates, honor }) => (
            <article key={degree} className={styles.entry}>
              <div className={styles.entryHeader}>
                <H3 className={styles.entryTitle}>
                  {degree}
                  <span className={styles.tagline}> — {school}</span>
                </H3>
                <span className={styles.dates}>{dates}</span>
              </div>
              {honor && <span className={styles.honor}>{honor}</span>}
            </article>
          ))}
        </section>
      </Container>
    </>
  );
}
