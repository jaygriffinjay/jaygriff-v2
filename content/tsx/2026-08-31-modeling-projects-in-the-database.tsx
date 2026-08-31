import { CodeBlock } from "@/components/code-block";
import {
  Bold,
  H2,
  H3,
  InlineCode,
  List,
  ListItem,
  Paragraph,
} from "@/components/typography";

export default function ModelingProjectsInTheDatabase() {
  return (
    <>
      <Paragraph>
        Projects on this site are rows in a <InlineCode>projects</InlineCode> table. Posts and docs
        attach to a project through the <InlineCode>project_id</InlineCode> column on the{" "}
        <InlineCode>content</InlineCode> table, and a single dynamic route renders a page for each
        project with its associated content listed underneath.
      </Paragraph>

      <H2>Schema</H2>

      <CodeBlock language="sql">{`CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'draft',
  icon         TEXT,
  app_href     TEXT,
  repo_url     TEXT,
  demo_url     TEXT,
  video_url    TEXT,
  thumbnail    TEXT,
  logo         TEXT,
  images       TEXT,
  tags         TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_project_id ON content(project_id);`}</CodeBlock>

      <Paragraph>
        The migration lives at{" "}
        <InlineCode>src/modules/db/migrations/004-projects-table.sql</InlineCode>. Run it with:
      </Paragraph>

      <CodeBlock language="bash">{`npx tsx --env-file=.env.local src/modules/db/pipeline/run-migration.ts src/modules/db/migrations/004-projects-table.sql`}</CodeBlock>

      <Paragraph>
        <InlineCode>images</InlineCode> and <InlineCode>tags</InlineCode> are JSON strings, parsed by{" "}
        <InlineCode>parseRow</InlineCode> in{" "}
        <InlineCode>src/modules/projects/queries.ts</InlineCode>. SQLite has no array type, so this
        matches how <InlineCode>content</InlineCode> already stores{" "}
        <InlineCode>authors</InlineCode>, <InlineCode>tags</InlineCode>, and{" "}
        <InlineCode>images</InlineCode>.
      </Paragraph>

      <H3>id is a readable string</H3>

      <Paragraph>
        <InlineCode>id</InlineCode> values are <InlineCode>pool</InlineCode>,{" "}
        <InlineCode>food-math</InlineCode>, <InlineCode>jaygriff-com</InlineCode> — not UUIDs. The
        column is what gets written into <InlineCode>content.project_id</InlineCode>, so a readable
        value means tagging content requires no lookup.
      </Paragraph>

      <Paragraph>
        <InlineCode>slug</InlineCode> is a separate column. Changing a project&apos;s URL therefore
        does not touch <InlineCode>id</InlineCode>, and existing associations survive. The seed
        upserts on <InlineCode>id</InlineCode> for the same reason: keying on{" "}
        <InlineCode>slug</InlineCode> would detach every associated row on rename.
      </Paragraph>

      <H3>Icons are keys, not components</H3>

      <Paragraph>
        <InlineCode>projects.icon</InlineCode> holds a string. A whitelist in{" "}
        <InlineCode>src/modules/projects/icons.ts</InlineCode> maps it to a Lucide component:
      </Paragraph>

      <CodeBlock language="tsx">{`const PROJECT_ICONS = {
  blocks: BlocksIcon,
  cpu: CpuIcon,
  droplet: DropletIcon,
  globe: GlobeIcon,
  shield: ShieldIcon,
  utensils: UtensilsCrossedIcon,
} satisfies Record<string, LucideIcon>;

export function getProjectIcon(key: string | null): LucideIcon {
  return PROJECT_ICONS[key as ProjectIconKey] ?? BoxIcon;
}`}</CodeBlock>

      <Paragraph>
        A React component cannot be stored in a database column, and a value read from the database
        is never resolved directly into a component. An unrecognised key falls back to{" "}
        <InlineCode>BoxIcon</InlineCode>. Adding an icon option requires editing this file — the
        database selects from the set, it cannot extend it.
      </Paragraph>

      <H2>Files</H2>

      <List>
        <ListItem>
          <InlineCode>src/modules/db/migrations/004-projects-table.sql</InlineCode> — table and
          index.
        </ListItem>
        <ListItem>
          <InlineCode>src/modules/db/pipeline/seed-projects.ts</InlineCode> — the project
          definitions and the upsert.
        </ListItem>
        <ListItem>
          <InlineCode>src/modules/projects/queries.ts</InlineCode> —{" "}
          <InlineCode>ProjectRow</InlineCode>, <InlineCode>getAllProjects()</InlineCode>,{" "}
          <InlineCode>getProjectBySlug(slug)</InlineCode>. Both filter to{" "}
          <InlineCode>status = &apos;published&apos;</InlineCode>.
        </ListItem>
        <ListItem>
          <InlineCode>src/modules/projects/icons.ts</InlineCode> — the icon whitelist.
        </ListItem>
        <ListItem>
          <InlineCode>src/modules/content/queries.ts</InlineCode> — gained{" "}
          <InlineCode>getContentByProject(projectId)</InlineCode>.
        </ListItem>
        <ListItem>
          <InlineCode>src/app/projects/[slug]/page.tsx</InlineCode> — the project detail page.
        </ListItem>
        <ListItem>
          <InlineCode>src/app/projects/page.tsx</InlineCode> and{" "}
          <InlineCode>src/app/page.tsx</InlineCode> — both now read the table. Each previously held
          its own hardcoded array.
        </ListItem>
      </List>

      <H2>Adding or editing a project</H2>

      <Paragraph>
        Edit the <InlineCode>PROJECTS</InlineCode> array in{" "}
        <InlineCode>src/modules/db/pipeline/seed-projects.ts</InlineCode>, then run:
      </Paragraph>

      <CodeBlock language="bash">{`npx tsx --env-file=.env.local src/modules/db/pipeline/seed-projects.ts`}</CodeBlock>

      <Paragraph>
        The statement is <InlineCode>INSERT ... ON CONFLICT(id) DO UPDATE</InlineCode>, so it is
        safe to run repeatedly. New entries insert, existing entries update in place, and nothing is
        duplicated.
      </Paragraph>

      <Paragraph>
        <Bold>The seed file is the source of truth.</Bold> Any edit made to the{" "}
        <InlineCode>projects</InlineCode> table by other means is overwritten the next time the seed
        runs. If an admin UI is added later, one of the two has to stop owning the data.
      </Paragraph>

      <H2>Attaching content to a project</H2>

      <CodeBlock language="sql">{`UPDATE content SET project_id = 'jaygriff-com' WHERE slug = 'some-slug';`}</CodeBlock>

      <Paragraph>
        The detail page calls <InlineCode>getContentByProject(project.id)</InlineCode>, splits the
        results by <InlineCode>type</InlineCode>, and renders Docs and Posts sections. The query
        filters to published content, so a draft stays hidden even once tagged.
      </Paragraph>

      <H2>Constraints</H2>

      <List>
        <ListItem>
          <InlineCode>project_id</InlineCode> has <Bold>no foreign key</Bold>. A typo produces a row
          that silently belongs to no project rather than an error.
        </ListItem>
        <ListItem>
          Project pages are generated by <InlineCode>generateStaticParams</InlineCode> at build
          time. A project added to the database after a deploy does not appear until the next build.
        </ListItem>
        <ListItem>
          Project cards on the home page and the listing link to{" "}
          <InlineCode>/projects/[slug]</InlineCode>, not to the live app. The detail page links on to{" "}
          <InlineCode>app_href</InlineCode>.
        </ListItem>
        <ListItem>
          The home page filters to four specific slugs through a{" "}
          <InlineCode>PROJECT_SLUGS</InlineCode> constant in{" "}
          <InlineCode>src/app/page.tsx</InlineCode>. A new project appears on{" "}
          <InlineCode>/projects</InlineCode> automatically but not on the home page.
        </ListItem>
      </List>

      <H2>Not wired up</H2>

      <List>
        <ListItem>
          <InlineCode>thumbnail</InlineCode>, <InlineCode>logo</InlineCode>,{" "}
          <InlineCode>images</InlineCode>, <InlineCode>demo_url</InlineCode>, and{" "}
          <InlineCode>video_url</InlineCode> exist as columns and are rendered by the detail page
          when present, but the seed does not set them.
        </ListItem>
        <ListItem>
          No content row has a <InlineCode>project_id</InlineCode> yet. Every project page currently
          renders metadata with no Docs or Posts sections.
        </ListItem>
        <ListItem>
          Setting <InlineCode>project_id</InlineCode> is a manual <InlineCode>UPDATE</InlineCode>.
          The sync script does not infer it, and nothing in the pipeline sets it.
        </ListItem>
        <ListItem>
          <InlineCode>src/app/resume/page.tsx</InlineCode> still holds its own separate project array
          with a different shape.
        </ListItem>
      </List>
    </>
  );
}
