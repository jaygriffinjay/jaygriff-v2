import {
  H2,
  H3,
  Paragraph,
  Bold,
  InlineCode,
  List,
  ListItem,
} from "@/components/typography";
import { CodeBlock } from "@/components/code-block";

export default function BuildingAndDebuggingAPostCreatorSkill() {
  return (
    <>
      <Paragraph>
        I added a skill to this repo today whose entire job is creating one
        file. It took three failed attempts to get it working, and the failures
        were more interesting than the skill.
      </Paragraph>

      <H2>What a skill actually is</H2>
      <Paragraph>
        A skill is a markdown file with frontmatter. That&apos;s it. There is no
        runtime, no sandbox, no execution model. The agent reads{" "}
        <InlineCode>SKILL.md</InlineCode> and follows what it says, the same way
        it would follow anything else you type at it.
      </Paragraph>
      <Paragraph>
        The frontmatter <InlineCode>description</InlineCode> is the only part
        that behaves specially — it&apos;s always in the agent&apos;s context,
        so it functions as the trigger. The body is loaded on demand, once the
        description convinces the agent this is the right file to open.
      </Paragraph>
      <Paragraph>
        Which means a skill is best understood as{" "}
        <Bold>a lookup table entry</Bold>: a condition, and a procedure to run
        when it matches.
      </Paragraph>

      <H2>The one I built</H2>
      <Paragraph>
        Creating a post here means putting a file at{" "}
        <InlineCode>content/tsx/YYYY-MM-DD-slug.tsx</InlineCode>. The date has
        to be today. The slug has to be derived from the title consistently. Get
        either wrong and the content sync produces a duplicate or a broken URL.
      </Paragraph>
      <Paragraph>
        This is exactly the kind of thing an LLM does <Bold>almost</Bold>{" "}
        right — a slug that hyphenates slightly differently, a date pulled from
        the wrong place. So the skill delegates: a Node script owns the naming
        logic, and the skill&apos;s main instruction is to shut up and call it.
      </Paragraph>

      <CodeBlock language="markdown">{`- **Always call the script. Never hand-write the post file yourself**,
  even though you technically could. The whole point of this skill is that
  the filename/date/path logic lives in one place and never drifts.`}</CodeBlock>

      <Paragraph>
        The skill is documentation. The script is the implementation. The skill
        exists to make sure the script gets used.
      </Paragraph>

      <H2>Then it failed three times</H2>
      <Paragraph>
        First real invocation, the agent ran this and got an immediate{" "}
        <InlineCode>Cannot find module</InlineCode>:
      </Paragraph>

      <CodeBlock language="bash">{`node scripts/new-post.js "Building a Post-Creator Skill"`}</CodeBlock>

      <Paragraph>
        Because the script isn&apos;t at{" "}
        <InlineCode>scripts/new-post.js</InlineCode>. It&apos;s at{" "}
        <InlineCode>.github/skills/post-creator/scripts/new-post.js</InlineCode>
        , sitting next to the SKILL.md that describes it. The skill had written
        the short path, the agent copied it verbatim, and Node went looking in a
        directory that doesn&apos;t exist.
      </Paragraph>
      <Paragraph>
        Nothing was wrong with the reasoning. The instructions were wrong, and
        they were followed exactly.
      </Paragraph>

      <H3>The part that makes this a real trap</H3>
      <Paragraph>
        Skill paths resolve from the <Bold>workspace root</Bold>, not from the
        skill&apos;s own directory. So a skill has to refer to its own
        neighbouring files using their full path from the repo root. Relative
        paths read naturally and are silently wrong.
      </Paragraph>
      <Paragraph>
        Worse, the wrong path is the intuitive one. A file called{" "}
        <InlineCode>new-post.js</InlineCode> lives in{" "}
        <InlineCode>scripts/</InlineCode> in roughly every repo ever written. So
        the failure mode isn&apos;t just &ldquo;path is wrong&rdquo; —
        it&apos;s &ldquo;path is wrong in the direction everyone guesses.&rdquo;
      </Paragraph>

      <H2>The fix</H2>
      <Paragraph>
        Three changes, only one of which is the obvious one.
      </Paragraph>

      <List ordered>
        <ListItem>
          <Bold>Correct the path</Bold>, and explicitly name the wrong one:
          &ldquo;Do not shorten it to{" "}
          <InlineCode>scripts/new-post.js</InlineCode>.&rdquo; Naming the
          plausible mistake beats stating the correct answer alone, because the
          mistake is what the reader is already reaching for.
        </ListItem>
        <ListItem>
          <Bold>Separate the two paths that were being conflated.</Bold> The
          script lives nested; the working directory must still be the repo
          root, since the script resolves <InlineCode>content/tsx/</InlineCode>{" "}
          from <InlineCode>process.cwd()</InlineCode>. Two different path rules
          in one command, and the skill originally explained neither.
        </ListItem>
        <ListItem>
          <Bold>Add a recovery rule.</Bold> If the command fails with{" "}
          <InlineCode>Cannot find module</InlineCode>, re-run with the full path
          — don&apos;t go hunting for the file, and don&apos;t fall back to
          writing the post by hand.
        </ListItem>
      </List>

      <Paragraph>
        The third one is the one I&apos;d have skipped. A skill that only
        describes its happy path leaves the agent to improvise when things
        break, and improvisation is precisely what the skill was written to
        prevent. The failure branch deserves as much specification as the
        success branch.
      </Paragraph>

      <H2>What I took from it</H2>
      <List>
        <ListItem>
          <Bold>Skills fail like documentation, not like code.</Bold> No stack
          trace points at the sentence that was wrong. The agent does what it
          was told, and the error surfaces somewhere downstream.
        </ListItem>
        <ListItem>
          <Bold>Every path in a skill is load-bearing.</Bold> Prose can be
          approximate. Paths cannot.
        </ListItem>
        <ListItem>
          <Bold>Say what to do when it breaks.</Bold> Otherwise the fallback is
          whatever the agent invents, which is the thing you were trying to
          eliminate.
        </ListItem>
        <ListItem>
          <Bold>Test by using it, not by reading it.</Bold> The skill looked
          completely fine. It broke on first contact.
        </ListItem>
      </List>

      <Paragraph>
        This post was created by the skill, on the fourth try, after the skill
        was fixed. Which is the only endorsement it needs.
      </Paragraph>
    </>
  );
}
