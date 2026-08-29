import type { Metadata } from "next";
import { DownloadIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { H1, H2, H3, Paragraph, Bold, Link } from "@/components/typography";
import { Button } from "@/components/ui/button";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Jay Griffin — full-stack developer. Projects, skills, experience, and education.",
};

const PDF_PATH = "/resume-jay-griffin.pdf";

const CONTACT = [
  { label: "jaygriff.com", href: "https://jaygriff.com" },
  { label: "jay@jaygriff.com", href: "mailto:jay@jaygriff.com" },
  { label: "github.com/jaygriffinjay", href: "https://github.com/jaygriffinjay" },
  {
    label: "linkedin.com/in/jaygriffinjay",
    href: "https://linkedin.com/in/jaygriffinjay",
  },
];

const PROJECTS = [
  {
    name: "jaygriff.com",
    tagline: "Personal Platform",
    bullets: [
      "Full-stack content and development platform powering posts, docs, and webapps in one repo",
      "Built custom component system, dev tools, and content pipeline for rapid iteration",
    ],
  },
  {
    name: "ByTheHour",
    tagline: "AI-Native Time Blocking App",
    bullets: [
      "Time blocking app with natural language scheduling using LLM structured outputs",
      "Creates, edits, and deletes multiple time block event details with a simple chat interface",
    ],
  },
  {
    name: "Strava Analyzer",
    tagline: "Fitness Data Analytics",
    bullets: [
      "Connects to the Strava API, analyzes user activity and stream data, and presents visualizations",
      "Runs entirely client-side to protect privacy, and uses caching to reduce API calls",
    ],
  },
  {
    name: "Locus",
    tagline: "Chrome Extension",
    bullets: [
      "Fast bookmark launcher with fuzzy search and keyboard navigation for large bookmark libraries",
      "Uses hotkeys to launch apps in the browser like Spotlight Search",
    ],
  },
  {
    name: "Bootstrap Full-Stack Webapp",
    tagline: "Next.js Boilerplate",
    bullets: [
      "Next.js boilerplate with theme system, component library, and dev tooling",
      "Bootstrapped multiple projects: jaygriff.com, Strava Analyzer, Fitness Data ETL Platform",
    ],
  },
  {
    name: "Bootstrap Frontend Webapp",
    tagline: "Vite Boilerplate",
    bullets: [
      "Lightweight Vite boilerplate using my underlying stack and tooling",
      "Bootstrapped Locus Chrome extension and other frontend projects",
    ],
  },
];

const SKILLS = [
  {
    label: "Languages",
    items: "TypeScript, JavaScript, Python, Shell, HTML, CSS",
  },
  { label: "Frameworks", items: "Next.js, React" },
  { label: "APIs", items: "OpenAI, Stripe, Strava" },
  { label: "Styling", items: "Tailwind CSS, CSS-in-JS" },
  { label: "Visualization", items: "Recharts, SVG/CSS animations" },
  { label: "Data", items: "Supabase (Postgres), Prisma ORM, SQLite" },
  { label: "Tooling", items: "Vite, Git, VS Code, Chrome DevTools" },
];

const EXPERIENCE = [
  {
    title: "Independent Software Developer",
    dates: "Aug 2021 – Present",
    bullets: [
      "Developing multiple full-stack apps across web, data, and developer tools",
      "Actively maintaining open-source projects with continuous feature development and refinement",
    ],
  },
  {
    title: "Crew Leader & Driver — Little Guys Movers",
    dates: "Jun 2025 – Present",
    bullets: [
      "Leading moves with up to three 26ft box trucks and six crew members",
      "Mentioned by name in multiple five-star customer reviews on Google Reviews",
    ],
  },
  {
    title: "Tax Staff Accountant — Holthouse Carlin & Van Trigt, LLP",
    dates: "Jul 2023 – Jan 2024",
    bullets: [
      "Supported all stages of a multi-deadline engagement for a new HNW client with 12+ returns",
      "Staffed three teams preparing workpapers and returns for HNW individuals and small and medium sized business clients",
    ],
  },
];

const EDUCATION = [
  {
    title: "Master of Professional Accounting — The University of Texas at Arlington",
    dates: "Sep 2019 – May 2021",
  },
  {
    title: "Bachelor of Science in Agricultural Economics — Texas A&M University",
    dates: "Sep 2016 – May 2019",
  },
];

export default function ResumePage() {
  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <H1 className={styles.name}>Jay Griffin</H1>

        <div className={styles.contact}>
          {CONTACT.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.contactLink}>
              {label}
            </Link>
          ))}
        </div>

        <Button asChild variant="outline" size="sm" className={styles.download}>
          <a href={PDF_PATH} download>
            <DownloadIcon />
            Download PDF
          </a>
        </Button>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <H2 className={styles.sectionTitle}>Projects</H2>
          <Link href="/projects" className={styles.sectionLink}>
            jaygriff.com/projects
          </Link>
        </div>

        {PROJECTS.map(({ name, tagline, bullets }) => (
          <article key={name} className={styles.entry}>
            <H3 className={styles.entryTitle}>
              {name}
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

        {EXPERIENCE.map(({ title, dates, bullets }) => (
          <article key={title} className={styles.entry}>
            <div className={styles.entryHeader}>
              <H3 className={styles.entryTitle}>{title}</H3>
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

        {EDUCATION.map(({ title, dates }) => (
          <article key={title} className={styles.entry}>
            <div className={styles.entryHeader}>
              <H3 className={styles.entryTitle}>{title}</H3>
              <span className={styles.dates}>{dates}</span>
            </div>
          </article>
        ))}
      </section>

      <Paragraph className={styles.closing}>
        <Bold>Looking for a software development role.</Bold>{" "}
        <Link href="/contact">Get in touch</Link>.
      </Paragraph>
    </Container>
  );
}
