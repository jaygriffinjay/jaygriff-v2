import type { Metadata } from "next";
import Image from "next/image";
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
        <Image
          src="/images/me.jpg"
          alt="Jay Griffin"
          width={200}
          height={200}
          priority
          className={styles.portrait}
        />
        <H1>About</H1>
        <Paragraph className={styles.intro}>
          A bit about how I got here, plus a Q&A for fun.
        </Paragraph>
      </header>

      <Separator className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.bio}>
          <Paragraph>
            I&apos;ve been living inside computers since I was five.
          </Paragraph>
          <Paragraph>
            I remember being very curious about our family Windows PC growing
            up. I would navigate through the Start Menu like a maze, and I
            enjoyed playing Microsoft Paint, Pinball, and Solitaire.
          </Paragraph>
          <Paragraph>
            Over time I have realized something important about the many times I
            sat at a computer completely enamored. I realized that the source of
            my curiosity and persistence with using computers usually revolved
            around the mechanics of using them and how they work.
          </Paragraph>
          <Paragraph>
            Microsoft Paint is a good example of what I mean. You see, after all
            those years of playing Paint as a child, you might think I managed
            to produce at least a few decent pieces of artwork. You could not be
            more wrong. All I ever managed to create in Paint were artistic
            atrocities.
          </Paragraph>
          <Paragraph>
            So what was I doing then? Well, I remember the spray paint and the
            paint bucket the most. I loved resizing the spray paint and just…
            spraying. Resize again. Spray again. Switch to the largest size and
            see how long it takes to fill in. Be very interested in how it
            eventually managed to fill in perfectly. It&apos;s the same story
            with the paint bucket. Put two colors on the bucket. Right click.
            Left click. Do this over and over until everything is one color and
            everything is erased.
          </Paragraph>
          <Paragraph>
            I was honing in on the power of the tools Paint made available to
            me, and I liked playing with the tools themselves more than I liked
            drawing pictures with them.
          </Paragraph>
          <Paragraph>
            Fast forward to today. I am a software developer still driven by
            that same core insight I felt as a child but didn&apos;t have the
            words for: computers are incredibly powerful tools that are fun to
            use. They enable us to do incredible things perfectly, instantly,
            and at scale.
          </Paragraph>
          <Paragraph>
            Despite the power and ease of computers, it remains difficult to
            make something truly useful and impactful with them, and I now work
            on software almost every single day trying to do this.
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
