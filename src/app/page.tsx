import { H1, Paragraph, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import styles from "./home.module.css";

const APPS = [
  { href: "/my-stack", title: "My Stack", description: "Tools and technologies I use" },
  { href: "/food-math", title: "Food Math", description: "AI-powered food portion logging" },
  { href: "/deep-dive", title: "Deep Dive", description: "AI security audit for GitHub repos" },
  { href: "/cpu-ladder", title: "CPU Ladder", description: "Intel vs AMD desktop CPU comparison" },
  { href: "/pool", title: "Pool", description: "Saltwater pool maintenance dashboard" },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <H1 className={styles.heading}>Jay Griffin</H1>
        <Paragraph className={styles.subtitle}>
          Full-stack developer building modern web applications with React, Next.js, and TypeScript.
        </Paragraph>
        <div className={styles.actions}>
          <Link href="/my-stack">My Stack</Link>
          <Link href="/apps">Apps</Link>
          <Link href="/posts">Posts</Link>
        </div>
      </section>

      <Separator />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        <div className={styles.grid}>
          {APPS.map((app) => (
            <Link key={app.href} href={app.href}>
              <Card className={styles.appCard}>
                <CardHeader>
                  <CardTitle className={styles.appCardTitle}>{app.title}</CardTitle>
                  <CardDescription className={styles.appCardDesc}>{app.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
