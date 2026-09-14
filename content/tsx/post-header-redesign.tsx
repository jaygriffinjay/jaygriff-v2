"use client";

import { BotIcon, PenLineIcon } from "lucide-react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import {
  H2,
  H3,
  Paragraph,
  Bold,
  Italic,
  InlineCode,
  Small,
} from "@/components/typography";
import { Separator } from "@/components/ui/separator";

/**
 * Design mockup: one post header for every content type, with authorship
 * folded into the meta line instead of a callout card above the title.
 */

type Authorship = "handwritten" | "ai-generated" | "assisted";

const AUTHORSHIP = {
  handwritten: {
    icon: PenLineIcon,
    label: "Written by hand",
  },
  "ai-generated": {
    icon: BotIcon,
    label: "AI-generated",
  },
  assisted: {
    icon: BotIcon,
    label: "AI-assisted",
  },
} as const;

/**
 * Quieter than the shared Tooltip, which is a solid inverted slab with an
 * arrow — this is a bordered surface in the page's own colours, no arrow, and
 * no help cursor.
 */
function SubtleTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="border-border/70 bg-popover text-[oklch(0.68_0.012_75)] dark:text-[oklch(0.9_0.008_75)] animate-in fade-in-0 z-50 max-w-xs rounded-lg border px-3 py-2 text-xs leading-relaxed shadow-sm"
        >
          {label}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/** The full disclosure, only shown to a reader who asks for it. */
function AuthorshipMark({
  authorship,
  disclosure,
}: {
  authorship: Authorship;
  disclosure?: string;
}) {
  const { icon: Icon, label } = AUTHORSHIP[authorship];

  const mark = (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );

  if (!disclosure) return mark;

  return (
    <SubtleTooltip label={disclosure}>
      <button
        type="button"
        className="decoration-muted-foreground/30 hover:decoration-muted-foreground/60 hover:text-foreground cursor-default underline decoration-dotted underline-offset-4 transition-colors"
      >
        {mark}
      </button>
    </SubtleTooltip>
  );
}

/* ── The proposed header ───────────────────────────────────────── */

function PostHeader({
  kind,
  title,
  description,
  date,
  authorship,
  disclosure,
  note,
}: {
  kind: string;
  title: string;
  description?: string;
  date: string;
  authorship: Authorship;
  disclosure?: string;
  note?: string;
}) {
  return (
    <header className="flex flex-col gap-3">
      <span className="text-muted-foreground/70 text-xs font-medium tracking-[0.14em] uppercase">
        {kind}
      </span>

      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}

      <div className="text-muted-foreground/80 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span>{date}</span>
        <span aria-hidden="true">·</span>
        <AuthorshipMark authorship={authorship} disclosure={disclosure} />
        {note && (
          <>
            <span aria-hidden="true">·</span>
            <span className="italic">{note}</span>
          </>
        )}
      </div>

      <div className="bg-border/60 mt-1 h-px w-full" />
    </header>
  );
}

/* ── The mockup page ───────────────────────────────────────────── */

export default function PostHeaderRedesign() {
  return (
    <>
      <Paragraph>
        Right now authorship is announced three different ways: a bordered
        callout above the title on thoughts and designs, the same callout again
        on their index pages, and a bare <InlineCode>✍️</InlineCode> emoji on
        posts. The callout is the loudest element on the page — louder than the
        title it sits above — and it says roughly the same thing every time.
      </Paragraph>

      <Paragraph>
        This is the alternative: one header for every content type, with
        provenance demoted to the meta line where the date already lives.
        <Bold> A kind label, a title, a standfirst, and one quiet row.</Bold>{" "}
        The full disclosure moves into a tooltip on the authorship mark — hover
        the dotted underline on any of these.
      </Paragraph>

      <H2>The header, across all four types</H2>

      <div className="flex flex-col gap-10">
        <PostHeader
          kind="Post"
          title="How I Learned to Code"
          description="I'm self-taught, and the path was anything but straight."
          date="March 1, 2026"
          authorship="assisted"
          disclosure="Written by me. A coding agent helped with structure and edits, and I rewrote what it gave me."
        />

        <PostHeader
          kind="Thought"
          title="Modeling Projects in the Database"
          description="Projects are rows; posts and docs attach through project_id."
          date="August 31, 2026"
          authorship="ai-generated"
          disclosure="An AI-generated artifact of work I did with a coding agent. Reference material, not finished writing."
        />

        <PostHeader
          kind="Design"
          title="Design Gallery Mockup"
          description="A mockup of the design gallery, rendered through the gallery it mocks up."
          date="September 13, 2026"
          authorship="ai-generated"
          disclosure="An AI-generated design experiment, vibecoded quickly. Not a finished or reviewed design."
        />

        <PostHeader
          kind="Doc"
          title="Content Pipeline Deep Dive"
          description="How markdown and TSX files become rows in Turso."
          date="July 12, 2026"
          authorship="handwritten"
        />
      </div>

      <H2>How the tooltip carries the note</H2>

      <Paragraph>
        The tooltip is where <InlineCode>authorship_note</InlineCode> lands. A
        row with no note falls back to the default wording for its type, and a
        row with one replaces it — same override behaviour the callout had, at a
        fraction of the visual weight. A row that is handwritten gets no
        tooltip at all, because there is nothing to disclose.
      </Paragraph>

      <div className="flex flex-col gap-10">
        <PostHeader
          kind="Thought"
          title="Building and Debugging a Post Creator Skill"
          description="Three failed attempts, and the failures were the interesting part."
          date="August 28, 2026"
          authorship="ai-generated"
          disclosure="Drafted by Claude Sonnet 4.6 via GitHub Copilot from a working session, then edited by me for accuracy. The code samples are verbatim from the repo."
        />

        <PostHeader
          kind="Post"
          title="PDF Is a Dead Format"
          description="An argument with a file format I keep being handed."
          date="June 4, 2026"
          authorship="assisted"
          disclosure="Mine, start to finish. A model reviewed it for clarity and I took about half the suggestions."
          note="updated twice"
        />
      </div>

      <H2>Why this reads better</H2>

      <H3>Provenance is metadata, not an announcement</H3>
      <Paragraph>
        A reader deciding whether to trust a page wants the same three facts
        they always want: what is this, when was it written, who wrote it. Those
        belong together on one line. Hoisting one of them into a bordered box
        above the title implies it outranks the title, which it does not.
      </Paragraph>

      <H3>Progressive disclosure, literally</H3>
      <Paragraph>
        Two words answer the question for the ninety percent who only want to
        know <Italic>whether</Italic> a model was involved. The tooltip answers{" "}
        <Italic>how</Italic> for the ten percent who care. The callout forced
        the long answer on everyone, every time, which is why it read as
        boilerplate and got skipped.
      </Paragraph>

      <H3>Handwritten stops being an exception</H3>
      <Paragraph>
        Today the emoji only appears when something is handwritten, so its
        absence carries the meaning — which nobody notices. Naming the
        authorship every time means the reader never has to infer anything from
        a missing icon.
      </Paragraph>

      <H2>Open questions</H2>

      <Paragraph>
        <Bold>Three states or two?</Bold> Above I split AI-assisted (I wrote it,
        a model helped) from AI-generated (a model wrote it, I reviewed it).
        That distinction is real and worth keeping, but it does mean every post
        needs the right value set rather than defaulting to silence.
      </Paragraph>

      <Paragraph>
        <Bold>Does a tooltip hide it too well?</Bold> Hover is invisible on
        touch — Radix opens these on tap, so the content is reachable, but a
        phone reader has no dotted-underline affordance telling them to try. If
        the disclosure needs to be unmissable, it belongs on its own line under
        the meta row instead.
      </Paragraph>

      <Paragraph>
        <Bold>Does the kind label survive?</Bold> It is genuinely useful on a
        page reached from search, and pure redundancy for anyone who clicked
        through from <InlineCode>/thoughts</InlineCode>.
      </Paragraph>

      <Separator className="my-8" />

      <Small className="text-muted-foreground block">
        Mockup only — the real header would live in one shared component and
        replace ContentDisclosure, DisclosureNotice, and HandwrittenBadge.
      </Small>
    </>
  );
}
