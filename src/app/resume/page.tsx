import type { Metadata } from "next";
import NextLink from "next/link";

import { Container } from "@/components/layout/Container";
import { H1, H2, H3, Link } from "@/components/typography";
import { AvailabilityBanner } from "@/components/availability-banner";
import { PrintButton } from "./print-button";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Jay Griffin — full-stack developer. Projects, skills, experience, and education.",
};

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
    slug: "jaygriff",
    tagline: "Personal Platform",
    bullets: [
      "Full-stack content and development platform powering posts, docs, and webapps in one repo",
      "Built custom component system, dev tools, admin interface, and content pipeline for rapid iteration",
    ],
  },
  {
    name: "Deep Dive",
    slug: "deep-dive",
    tagline: "AI Security Auditor",
    bullets: [
      "Streams an LLM-generated vulnerability report as it reads a public GitHub repo file by file",
      "Lets users choose exactly which files to scan, rather than auditing an entire repo indiscriminately",
    ],
  },
  {
    name: "Food Math",
    slug: "food-math",
    tagline: "AI Nutrition Logger",
    bullets: [
      "Parses plain-language food descriptions into structured nutrition data using LLM structured outputs",
      "Human-in-the-loop approval flow keeps logging fast without sacrificing accuracy",
    ],
  },
  {
    name: "Strava Analyzer",
    slug: "strava-analyzer",
    tagline: "Fitness Data Analytics",
    bullets: [
      "Connects to the Strava API, analyzes user activity and stream data, and presents visualizations",
      "Runs entirely client-side to protect privacy, and uses caching to reduce API calls",
    ],
  },
  {
    name: "Locus",
    slug: "locus",
    tagline: "Chrome Extension",
    bullets: [
      "Fast bookmark launcher with fuzzy search and keyboard navigation for large bookmark libraries",
      "Uses hotkeys to launch apps in the browser like Spotlight Search",
    ],
  },
];

const SKILLS = [
  {
    label: "Languages",
    items: "TypeScript, JavaScript, Python, SQL, Shell, HTML, CSS",
  },
  { label: "Frameworks", items: "Next.js, React" },
  { label: "APIs", items: "OpenAI, Claude, Stripe, Strava" },
  { label: "Styling", items: "Tailwind CSS, CSS Modules, Radix UI, shadcn/ui" },
  { label: "Visualization", items: "Recharts, Vanilla JS, SVG, CSS animations" },
  { label: "Data", items: "Turso (SQLite), Supabase (Postgres), Zod (validation)" },
  { label: "Deployment", items: "Vercel, Cloudflare" },
  { label: "Tooling", items: "Vite, Git, VS Code, Chrome DevTools" },
];

const EXPERIENCE = [
  {
    role: "Crew Leader & Driver",
    org: "Little Guys Movers",
    dates: "Jun 2025 – Present",
    bullets: [
      "Leading moves with up to three 26ft box trucks and six crew members",
      "Mentioned by name in multiple five-star customer reviews on Google Reviews",
    ],
  },
  {
    role: "Tax Staff Accountant",
    org: "Holthouse Carlin & Van Trigt, LLP",
    dates: "Jul 2023 – Jan 2024",
    bullets: [
      "Supported all stages of a multi-deadline engagement for a new HNW client with 12+ returns",
      "Staffed three teams preparing workpapers and returns for HNW individuals and small and medium sized business clients",
    ],
  },
];

const EDUCATION = [
  {
    degree: "Master of Professional Accounting",
    school: "The University of Texas at Arlington",
    dates: "Sep 2019 – May 2021",
  },
  {
    degree: "Bachelor of Science in Agricultural Economics",
    school: "Texas A&M University",
    dates: "Sep 2016 – May 2019",
    honor: "Cum Laude",
  },
];

export default function ResumePage() {
  return (
    <>
      <AvailabilityBanner className={styles.banner} />

      <Container className={styles.container}>
        <header className={styles.header}>
          <PrintButton className={styles.download} />

          <H1 className={styles.name}>Jay Griffin</H1>

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
