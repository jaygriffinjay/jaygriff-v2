import Image from "next/image";
import {
  CpuIcon,
  DropletIcon,
  ShieldIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import { H1, H2, Paragraph, Small, Link } from "@/components/typography";
import styles from "./home.module.css";

const PROJECTS = [
  {
    href: "/deep-dive",
    title: "Deep Dive",
    icon: ShieldIcon,
    description:
      "Point an LLM at any public GitHub repo and get a vulnerability report. It walks the source file by file and streams findings as the model reads.",
    tags: ["AI", "Streaming", "Bring your own key"],
  },
  {
    href: "/food-math",
    title: "Food Math",
    icon: UtensilsCrossedIcon,
    description:
      "The fastest food portion logger. Type what you ate in plain language, the model parses it into structured nutrition data, you approve or correct it.",
    tags: ["AI", "Structured output", "Conversational editing"],
  },
  {
    href: "/pool",
    title: "Pool",
    icon: DropletIcon,
    description:
      "A saltwater pool maintenance dashboard with test logging, a dosing calculator, and a reference section — built because test strips and guesswork weren't cutting it.",
    tags: ["Dashboard", "Calculator", "Reference"],
  },
  {
    href: "/cpu-ladder",
    title: "CPU Ladder",
    icon: CpuIcon,
    description:
      "A visual Intel vs AMD desktop CPU comparison. See equivalents at a glance without digging through benchmark tables.",
    tags: ["Data viz", "Comparison"],
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <Image
          src="/images/me.jpg"
          alt="Jay Griffin"
          width={200}
          height={200}
          priority
          className={styles.portrait}
        />
        <H1 className={styles.heading}>Hi, I'm Jay</H1>
        <Paragraph className={styles.subtitle}>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
        <div className={styles.actions}>
          <Link href="/projects" className={styles.primaryAction}>
            See what I&apos;ve built
          </Link>
          <Link href="/posts" className={styles.secondaryAction}>
            Read my writing
          </Link>
          <Link href="/contact" className={styles.secondaryAction}>
            Get in touch
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <H2 className={styles.sectionTitle}>Projects</H2>
          <Paragraph className={styles.sectionIntro}>
            Each of these is live on this site — click into any of them.
          </Paragraph>
        </div>

        <div className={styles.grid}>
          {PROJECTS.map(({ href, title, icon: Icon, description }) => (
            <Link key={href} href={href} className={styles.cardLink}>
              <span className={styles.cardIcon} aria-hidden="true">
                <Icon />
              </span>
              <span className={styles.appCardTitle}>{title}</span>
              <span className={styles.appCardDesc}>{description}</span>
            </Link>
          ))}
        </div>

        <Paragraph className={styles.sectionFooter}>
          More in <Link href="/projects">projects</Link>.
        </Paragraph>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <H2 className={styles.sectionTitle}>Background</H2>
        </div>

        <div className={styles.prose}>
          <Paragraph>
            I&apos;ve been living inside computers since I was five — Paint and
            Pinball first, then PC gaming, modding, running game servers,
            building machines from parts, and reinstalling Linux more times than
            I can count. By the time I wrote a line of code I was already
            comfortable with filesystems, config files, and the command line. I
            just didn&apos;t know yet that being unafraid of the machine was
            most of the battle.
          </Paragraph>
          <Paragraph>
            The click came from AutoHotkey. I wanted one hotkey that opened the
            five websites I checked every morning. It worked — and then I
            realized the list could just as easily be a hundred. That&apos;s the
            whole idea of a program: write the instructions once, and the
            machine runs them instantly, perfectly, every time.
          </Paragraph>
          <Paragraph>
            Everything since has been self-taught and problem-first. I learn by
            building something I want to exist, getting it working end to end,
            and writing down what I figured out along the way. These days that
            means full-stack TypeScript, a database, an LLM somewhere in the
            loop, and a deployed URL at the end of it — the whole setup is in{" "}
            <Link href="/my-stack">my stack</Link>.
          </Paragraph>
          <Paragraph>
            I work with AI agents daily and I&apos;m opinionated about how.
            They&apos;re very good at execution and still need someone holding
            the architecture. I write down decisions as I make them — why a
            format was chosen, why an approach failed — which is partly how I
            learn and partly so the reasoning survives past the moment.
          </Paragraph>
        </div>
      </section>

      <section className={styles.section}>
        <Paragraph className={styles.closing}>
          I&apos;m looking for a software development role. If you want to talk,{" "}
          <Link href="/contact">get in touch</Link>.
        </Paragraph>
      </section>
    </>
  );
}
