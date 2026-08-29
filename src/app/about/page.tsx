import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1, H2, Paragraph, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Answers about my background, what I'm working on, and how this site is built.",
};

const ABOUT_ME = [
  {
    question: "What's your background?",
    answer: (
      <>
        I have a bachelor&apos;s degree in agricultural economics, a
        master&apos;s degree in accounting, and I worked in public tax
        accounting before transitioning to software development. I&apos;ve also
        worked as a professional mover and driver.
      </>
    ),
  },
  {
    question: "What kind of developer are you?",
    answer: (
      <>
        I am interested in a wide spectrum of computing across hardware and software, but the majority of my work is in webapp development and scaling webapps.
      </>
    ),
  },
  {
    question: "What are you focused on right now?",
    answer: (
      <>
        Currently I&apos;m spending significant time on this website — building
        new features, improving the framework, and writing. I&apos;m also
        actively working on AI-native dev tools and workflows, AI-native apps,
        and data analysis apps.
      </>
    ),
  },
  {
    question: "What do you actually want to be doing?",
    answer: (
      <>
        I want to ship and run my own webapps end-to-end from conception to production. I also love working on this site, which is a content platform, documentation system, and testbed for webapps and larger-scale backends all at once.
      </>
    ),
  },
  {
    question: "Do you freelance?",
    answer: (
      <>
        Currently no. I&apos;m looking for a full-time role, and I&apos;m also
        interested in selling my own software products. I want to focus on those
        things right now, but maybe in the future I&apos;ll be open to freelance
        work.
      </>
    ),
  },
  {
    question: "What's your end goal?",
    answer: (
      <>
        I want to create my own software businesses to support my life and work
        indefinitely. I&apos;d also love to work with talented developers and
        learn from them.
      </>
    ),
  },
  {
    question: "How did you learn to code?",
    answer: (
      <>
        I go into detail about it in{" "}
        <Link href="/posts/how-i-learned-to-code">this post</Link>.
      </>
    ),
  },
  {
    question: "How do you use AI in your work?",
    answer: (
      <>
        It&apos;s changed how I work pretty fundamentally. I wrote up the full
        story in <Link href="/posts/how-i-use-ai">How I Use AI</Link>.
      </>
    ),
  },
  {
    question: "Will AI replace you?",
    answer: (
      <>
        I don&apos;t think AI will replace me. I think it has replaced some
        types of work though. AI is just like any other innovation: it has
        changed how we do things, made some things obsolete, and created new
        opportunities.
      </>
    ),
  },
  {
    question: "What are you excited to build next?",
    answer: (
      <>
        AI-native apps. They can solve problems in ways we couldn&apos;t achieve
        even a few years ago. This is keeping me busy because it takes plenty of
        real work to build them.
      </>
    ),
  },
  {
    question: "What would you build with unlimited time?",
    answer: (
      <>
        With unlimited time I think I&apos;d get bored of regular work and build
        tools for science — either biology or space. So trying to get to the
        bottom of life or the universe.
      </>
    ),
  },
  {
    question: "Why should anyone care?",
    answer: <>{"¯\\_(ツ)_/¯"}</>,
  },
];

const ABOUT_SITE = [
  {
    question: "What is this site?",
    answer: (
      <>
        A custom-built web app that serves as both my workspace and publishing
        platform. It&apos;s the container for a lot of my other apps, because I
        can build them in this repo and then host and demo them here.
      </>
    ),
  },
  {
    question: "What's under the hood?",
    answer: (
      <>
        On the frontend it just looks like a website. On the backend it&apos;s a
        testbed for the application framework I use to make all my apps. The
        site is partly an excuse to improve that framework and factor out my
        best work into a reusable system. The full toolchain is in{" "}
        <Link href="/my-stack">my stack</Link>.
      </>
    ),
  },
  {
    question: "How long did this take to build?",
    answer: (
      <>
        This version of the site is fairly recent, but the framework and methods
        behind it have been refined over years of iteration.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <H1>About</H1>
        <Paragraph className={styles.intro}>
          A bit about how I got here, plus questions I get asked and a few I ask
          myself.
        </Paragraph>
      </header>

      <Separator className={styles.divider} />

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>Background</H2>
        <div className={styles.bio}>
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
            About five years of writing code in, the shape of it is clear:
            backend and full-stack, on the web, with a preference for owning the
            whole path from schema to deployed URL. I&apos;m not a designer and
            I&apos;m a genuinely terrible artist, but I think UI and UX matter
            enormously — I just get there by studying patterns that already work
            and iterating on them rather than drawing something beautiful from a
            blank canvas. The one-page version of all this is on my{" "}
            <Link href="/resume">resume</Link>.
          </Paragraph>
          <Paragraph>
            I work with AI agents daily and I&apos;m opinionated about how.
            They&apos;re very good at execution and still need someone holding
            the architecture. I write down decisions as I make them — why a
            format was chosen, why an approach failed — which is partly how I
            learn and partly so the reasoning survives past the moment.
          </Paragraph>
          <Paragraph>
            Away from the keyboard I collect Rubik&apos;s cubes, and I hike,
            bike, run, and lift. I track most of it, which is where a lot of my
            projects actually come from — <Link href="/food-math">Food Math</Link>{" "}
            exists because I wanted a faster way to log what I ate, not because
            I set out to build a nutrition app. Most of what I build starts as
            something I wanted to use.
          </Paragraph>
        </div>
      </section>

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>About me</H2>
        <Accordion type="multiple" className={styles.accordion}>
          {ABOUT_ME.map(({ question, answer }) => (
            <AccordionItem
              key={question}
              value={question}
              className={styles.item}
            >
              <AccordionTrigger className={styles.question}>
                {question}
              </AccordionTrigger>
              <AccordionContent className={styles.answer}>
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className={styles.section}>
        <H2 className={styles.sectionTitle}>About this site</H2>
        <Accordion type="multiple" className={styles.accordion}>
          {ABOUT_SITE.map(({ question, answer }) => (
            <AccordionItem
              key={question}
              value={question}
              className={styles.item}
            >
              <AccordionTrigger className={styles.question}>
                {question}
              </AccordionTrigger>
              <AccordionContent className={styles.answer}>
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Paragraph className={styles.closing}>
        Something not answered here?{" "}
        <Link href="/contact">Get in touch</Link>.
      </Paragraph>
    </Container>
  );
}
