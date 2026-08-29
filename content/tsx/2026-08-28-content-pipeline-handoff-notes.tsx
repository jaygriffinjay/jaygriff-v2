import { CodeBlock } from "@/components/code-block";
import {
  Blockquote,
  Bold,
  H2,
  H3,
  InlineCode,
  List,
  ListItem,
  Paragraph,
} from "@/components/typography";

export default function ContentPipelineHandoffNotes() {
  return (
    <>
      <Paragraph>
        Notes to myself, written while tired, so that picking this back up does
        not require re-deriving everything. The feature is not done. What follows
        is what exists, why it is shaped the way it is, and the exact next
        decision I have to make.
      </Paragraph>

      <H2>The idea</H2>

      <Paragraph>
        Treat TSX as content data rather than as code. A post is a file that may
        only use a fixed whitelist of components. No arbitrary imports, no
        expressions, no logic. Conceptually similar to MDX, except the authoring
        surface is pure React components instead of markdown with escape hatches.
      </Paragraph>

      <Paragraph>
        The reason this matters: if content is constrained enough to be
        predictable, it can eventually be stored in the database rather than the
        filesystem, which unlocks private drafts and a real staging flow in
        production.
      </Paragraph>

      <H2>What is built and working</H2>

      <H3>The whitelist contract</H3>

      <Paragraph>
        <InlineCode>whitelist.ts</InlineCode> holds the allowed component names
        and allowed import specifiers. It exports names only, with no React
        imports, so the sync script can read it from plain Node without dragging
        CSS modules along.
      </Paragraph>

      <Paragraph>
        <InlineCode>component-map.tsx</InlineCode> maps those names to the real
        components. It is typed as a record keyed by the whitelist union, so
        adding a name without adding a component is a compile error. The two
        files cannot drift.
      </Paragraph>

      <H3>Rendering</H3>

      <Paragraph>
        <InlineCode>render.tsx</InlineCode> holds{" "}
        <InlineCode>ContentBody</InlineCode>, which was previously duplicated
        across the posts and docs routes. It handles the TSX branch via dynamic
        import and the markdown branch separately. Both slug routes now import it
        instead of carrying their own copy.
      </Paragraph>

      <Blockquote>
        Worth remembering: rendering already works. Dynamic import of the file is
        enough. The AST work described below is the price of database storage,
        not of rendering. I conflated those two things earlier and wasted time on
        it.
      </Blockquote>

      <H3>The pipeline split</H3>

      <Paragraph>
        Everything that runs at build time now lives in a{" "}
        <InlineCode>pipeline/</InlineCode> subfolder, separate from what the app
        imports at runtime.
      </Paragraph>

      <CodeBlock language="text">{`src/modules/
  content/
    whitelist.ts          shared by both sides
    queries.ts            runtime
    render.tsx            runtime
    component-map.tsx     runtime
    pipeline/
      sync.ts
      sync2.ts
      generate-metadata.ts
      validate.ts
  db/
    turso.ts              runtime
    pipeline/
      migrate.ts
      run-migration.ts
      inspect-dates.ts`}</CodeBlock>

      <Paragraph>
        The rule is simple: anything run by hand from a terminal goes in{" "}
        <InlineCode>pipeline/</InlineCode>. Anything a route imports stays at the
        module root. <InlineCode>whitelist.ts</InlineCode> stays at the root
        because both sides need it, which is exactly why it kept resisting
        placement.
      </Paragraph>

      <H3>Server boundaries</H3>

      <Paragraph>
        Added the <InlineCode>server-only</InlineCode> package to{" "}
        <InlineCode>queries.ts</InlineCode> and{" "}
        <InlineCode>lib/content.ts</InlineCode>. It works by export condition:
        inside the server component graph it resolves to an empty file, and
        anywhere else it resolves to a module that throws, which fails the build.
        It follows the real bundler graph, so it catches transitive chains that a
        lint rule would miss.
      </Paragraph>

      <Paragraph>
        <Bold>Do not put it on turso.ts.</Bold> The pipeline scripts import that
        file and run under plain Node, where the marker throws. This was almost a
        self-inflicted outage. Coverage is still complete because those two
        marked files are the only app-side paths to the database client.
      </Paragraph>

      <H3>The draft leak</H3>

      <Paragraph>
        <InlineCode>getContentBySlug</InlineCode> filtered on status not equal to
        deleted, which meant every draft row was publicly readable by guessing
        the slug. It now filters on published. The admin view uses a different
        query and is unaffected.
      </Paragraph>

      <H2>What is not done</H2>

      <List>
        <ListItem>
          <Bold>The validator is dead code.</Bold> It exists, it traverses
          correctly, but nothing imports it. Sync still reads TSX as opaque text
          and writes it to the database without checking anything. The whitelist
          is currently a suggestion, not a rule.
        </ListItem>
        <ListItem>
          <Bold>Fragments pass silently.</Bold> The traversal handles JSX
          elements and self-closing elements but not fragments. The post template
          emits a fragment as its root, so this is not a hypothetical gap.
        </ListItem>
        <ListItem>
          <Bold>Prettier fights the validator.</Bold> When Prettier wraps a JSX
          line it inserts an explicit space expression. The validator rejects
          every expression, including that one. The formatter will routinely
          produce content the validator refuses. Needs a narrow exemption for
          string literal expressions before the gate can be turned on.
        </ListItem>
      </List>

      <H2>The decision waiting for me</H2>

      <Paragraph>
        Two paths, and I should pick one rather than trying to do both.
      </Paragraph>

      <H3>Option one: ship the gate</H3>

      <Paragraph>
        Wire the validator into sync so bad content is rejected at authoring
        time. Keep the current dynamic import rendering. No storage change. This
        is a working increment that can land quickly, and it makes the whitelist
        real. It does not unlock private drafts.
      </Paragraph>

      <H3>Option two: go to stored JSON</H3>

      <Paragraph>
        Parse each file to JSON at sync time, store it in a body column on the
        existing content table, and render from data instead of from the
        filesystem. Roughly sixty to eighty lines, reusing the traversal the
        validator already has. This is what actually unlocks private drafts and
        production staging.
      </Paragraph>

      <Paragraph>
        Leaning toward option one first, purely because it is a smaller step that
        leaves the system working. Option two is the real destination.
      </Paragraph>

      <H2>Decisions already locked</H2>

      <List>
        <ListItem>Shadcn components are out of the content whitelist.</ListItem>
        <ListItem>Expressions are banned for now.</ListItem>
        <ListItem>
          Body goes on the existing content table as a column, not a new table.
          List queries switch to explicit column lists when that happens.
        </ListItem>
        <ListItem>
          No barrel file for the content module. Re-exporting the component map
          pulled all the typography components and their CSS into anything that
          only wanted a query function.
        </ListItem>
      </List>

      <H2>Things I got wrong last time</H2>

      <Paragraph>
        Recording these so I do not repeat them. A staging route and an inbox
        directory got built that were never asked for, and all of it had to be
        deleted. A barrel file was added reflexively, then removed. There was an
        assumption that devDependencies are unavailable at build time on the
        host, which is false. The actual concern with the validator was never
        availability, it was bundling a large compiler into a serverless
        function.
      </Paragraph>

      <Blockquote>
        The pattern in all three: acting on an assumption instead of checking it.
        The check was cheap every single time.
      </Blockquote>
    </>
  );
}
