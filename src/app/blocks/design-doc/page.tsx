import { Metadata } from "next";
import styles from "./blocks.module.css";
import { Container } from "@/components/layout/Container";
import {
  H1,
  H2,
  H3,
  Paragraph,
  Bold,
  InlineCode,
  Italic,
  List,
  ListItem,
  Small,
  Highlight,
} from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Blocks – Data Model",
  description:
    "Design document for the Notion-inspired page tree and block data model.",
};

export default function BlocksPage() {
  return (
    <Container className={styles.page}>
      {/* ────────────────────────── Header ────────────────────────── */}
      <div className={styles.header}>
        <Badge variant="outline">Design Document</Badge>
        <H1>Blocks</H1>
        <Paragraph className={styles.subtitle}>
          A Notion-inspired page tree that powers breadcrumbs, navigation, and
          eventually infinite nested pages. Everything is a{" "}
          <Highlight>block</Highlight>.
        </Paragraph>
      </div>

      <Separator className={styles.divider} />

      {/* ──────────────────── Core Concept ──────────────────── */}
      <section>
        <H2>Core Concept</H2>
        <Paragraph>
          Inspired by{" "}
          <Italic>
            &ldquo;The Data Model Behind Notion&rdquo;
          </Italic>
          , every page in the app is a <Bold>block</Bold> with two pointers:
        </Paragraph>
        <div className={styles.compareGrid}>
          <Card>
            <CardHeader>
              <CardTitle>↑ Parent</CardTitle>
              <CardDescription>Upward pointer for ancestry</CardDescription>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Each block stores its <InlineCode>parent</InlineCode> path.
                Walk the chain upward to build breadcrumbs:
                <br />
                <InlineCode>/pool</InlineCode> →{" "}
                <InlineCode>/apps</InlineCode> →{" "}
                <InlineCode>/</InlineCode>
              </Paragraph>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>↓ Content</CardTitle>
              <CardDescription>
                Ordered children for rendering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Each block stores a <InlineCode>content</InlineCode> JSON
                array of child paths. Determines ordering in nav and
                listings.
              </Paragraph>
              <Paragraph>
                <InlineCode>
                  {`["/pool", "/cpu-ladder", "/deep-dive"]`}
                </InlineCode>
              </Paragraph>
            </CardContent>
          </Card>
        </div>
        <Paragraph className={styles.notionNote}>
          <Bold>Type determines rendering, not structure.</Bold> A{" "}
          <InlineCode>section</InlineCode>, <InlineCode>app</InlineCode>, and{" "}
          <InlineCode>admin</InlineCode> page all share the same shape — the{" "}
          <InlineCode>type</InlineCode> field tells the UI how to display
          them.
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Page Tree ──────────────────── */}
      <section>
        <H2>Page Tree</H2>
        <Paragraph>
          The complete page hierarchy as it will exist in the database. Dynamic
          slug pages (<InlineCode>/posts/[slug]</InlineCode>,{" "}
          <InlineCode>/docs/[slug]</InlineCode>) are{" "}
          <Bold>not stored</Bold> — they derive breadcrumbs from their parent
          section at runtime.
        </Paragraph>

        <div className={styles.tree}>
          {/* Root */}
          <div className={styles.treeNode}>
            <span className={styles.treePath}>/</span>
            <Badge variant="secondary">page</Badge>
            <span className={styles.treeType}>Home</span>
          </div>

          {/* Apps branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/apps</span>
            <Badge variant="outline">section</Badge>
            <span className={styles.treeType}>Apps</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/pool</span>
            <Badge variant="default">app</Badge>
            <span className={styles.treeType}>Pool</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/cpu-ladder</span>
            <Badge variant="default">app</Badge>
            <span className={styles.treeType}>CPU Ladder</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/deep-dive</span>
            <Badge variant="default">app</Badge>
            <span className={styles.treeType}>Deep Dive</span>
          </div>

          {/* Posts branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/posts</span>
            <Badge variant="outline">section</Badge>
            <span className={styles.treeType}>Posts</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treeType}>
              /posts/[slug] <Italic>(dynamic — not in DB)</Italic>
            </span>
          </div>

          {/* Docs branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/docs</span>
            <Badge variant="outline">section</Badge>
            <span className={styles.treeType}>Docs</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treeType}>
              /docs/[slug] <Italic>(dynamic — not in DB)</Italic>
            </span>
          </div>

          {/* Admin branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/admin</span>
            <Badge variant="destructive">admin</Badge>
            <span className={styles.treeType}>Admin (hidden)</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/admin/content</span>
            <Badge variant="destructive">admin</Badge>
            <span className={styles.treeType}>Content</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/admin/pool</span>
            <Badge variant="destructive">admin</Badge>
            <span className={styles.treeType}>Pool Admin</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/admin/login</span>
            <Badge variant="destructive">admin</Badge>
            <span className={styles.treeType}>Login (hidden)</span>
          </div>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Database Schema ──────────────────── */}
      <section>
        <H2>Database Schema</H2>
        <Paragraph>
          Migration <InlineCode>003-pages-table.sql</InlineCode> — Turso
          (libsql), following the existing migration pattern.
        </Paragraph>

        <div className={styles.schemaBlock}>
          <pre className={styles.schemaPre}>
            <code>
              <span className={styles.sqlKeyword}>CREATE TABLE</span>{" "}
              <span className={styles.sqlCol}>pages</span> {"(\n"}
              {"  "}
              <span className={styles.sqlCol}>id</span>{"          "}
              <span className={styles.sqlType}>TEXT PRIMARY KEY</span>
              {","}
              <span className={styles.sqlComment}>
                {"    -- UUID v4"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>path</span>{"        "}
              <span className={styles.sqlType}>TEXT UNIQUE NOT NULL</span>
              {","}
              <span className={styles.sqlComment}>
                {' -- "/pool", "/apps"'}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>type</span>{"        "}
              <span className={styles.sqlType}>TEXT NOT NULL</span>
              {","}
              <span className={styles.sqlComment}>
                {' -- "page" | "section" | "app" | "admin"'}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>title</span>{"       "}
              <span className={styles.sqlType}>TEXT NOT NULL</span>
              {","}
              <span className={styles.sqlComment}>
                {' -- "Pool", "CPU Ladder"'}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>description</span>{" "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"             -- for metadata / OG"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>icon</span>{"        "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {'             -- lucide icon name'}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>parent</span>{"      "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"             -- FK → pages.path (NULL for root)"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>content</span>{"     "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"             -- JSON array of child paths"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>hidden</span>{"      "}
              <span className={styles.sqlType}>BOOLEAN DEFAULT 0</span>
              {","}
              <span className={styles.sqlComment}>
                {"  -- exclude from nav"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>created_at</span>{"  "}
              <span className={styles.sqlType}>TEXT NOT NULL</span>
              {",\n  "}
              <span className={styles.sqlCol}>updated_at</span>{"  "}
              <span className={styles.sqlType}>TEXT NOT NULL</span>
              {",\n\n  "}
              <span className={styles.sqlKeyword}>FOREIGN KEY</span>{" "}
              {"("}
              <span className={styles.sqlCol}>parent</span>
              {") "}
              <span className={styles.sqlKeyword}>REFERENCES</span>{" "}
              <span className={styles.sqlCol}>pages</span>
              {"("}
              <span className={styles.sqlCol}>path</span>
              {")\n);"}
            </code>
          </pre>
        </div>

        <Separator className={styles.sectionDivider} />

        <H3>Column Reference</H3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <InlineCode>id</InlineCode>
              </TableCell>
              <TableCell>TEXT PK</TableCell>
              <TableCell>
                UUID v4 — stable identifier for future API / block operations
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>path</InlineCode>
              </TableCell>
              <TableCell>TEXT UNIQUE</TableCell>
              <TableCell>
                URL path — the natural key for a URL-routed app. Used as the
                FK target for <InlineCode>parent</InlineCode>.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>type</InlineCode>
              </TableCell>
              <TableCell>TEXT</TableCell>
              <TableCell>
                Determines rendering: <InlineCode>page</InlineCode>,{" "}
                <InlineCode>section</InlineCode>,{" "}
                <InlineCode>app</InlineCode>,{" "}
                <InlineCode>admin</InlineCode>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>title</InlineCode>
              </TableCell>
              <TableCell>TEXT</TableCell>
              <TableCell>
                Display name for breadcrumbs, nav, and metadata
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>description</InlineCode>
              </TableCell>
              <TableCell>TEXT?</TableCell>
              <TableCell>OG / meta description, optional</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>icon</InlineCode>
              </TableCell>
              <TableCell>TEXT?</TableCell>
              <TableCell>
                Lucide icon name for sidebar/nav (e.g.{" "}
                <InlineCode>&quot;droplets&quot;</InlineCode>,{" "}
                <InlineCode>&quot;cpu&quot;</InlineCode>)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>parent</InlineCode>
              </TableCell>
              <TableCell>TEXT? FK</TableCell>
              <TableCell>
                Path of the parent page. <InlineCode>NULL</InlineCode> only
                for root <InlineCode>/</InlineCode>.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>content</InlineCode>
              </TableCell>
              <TableCell>TEXT?</TableCell>
              <TableCell>
                JSON array of child paths, ordered. Parsed at query time.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>hidden</InlineCode>
              </TableCell>
              <TableCell>BOOLEAN</TableCell>
              <TableCell>
                If <InlineCode>1</InlineCode>, excluded from public nav/sidebar
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Query API ──────────────────── */}
      <section>
        <H2>Query API</H2>
        <Paragraph>
          Module: <InlineCode>src/modules/pages/queries.ts</InlineCode> —
          follows the pattern from{" "}
          <InlineCode>src/modules/content/queries.ts</InlineCode>.
        </Paragraph>

        <div className={styles.apiList}>
          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getPageByPath</span>
                <span className={styles.fnParams}>(path: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageRow | null"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Single page lookup by exact path match. The foundation for
                everything else.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getAncestors</span>
                <span className={styles.fnParams}>(path: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageRow[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Walk <InlineCode>parent</InlineCode> pointers upward. Returns
                ordered array{" "}
                <InlineCode>[root, ..., current]</InlineCode>.{" "}
                <Bold>This is the breadcrumb query.</Bold> Max depth ~4, so
                iterative walks are fine without recursive CTE.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getChildren</span>
                <span className={styles.fnParams}>(path: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageRow[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Parse the <InlineCode>content</InlineCode> JSON array and
                fetch those pages in order. Used for listing sub-pages and
                generating nav sections.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getRootPages</span>
                <span className={styles.fnParams}>()</span>
                <span className={styles.fnReturn}>
                  {" → PageRow[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Top-level visible pages:{" "}
                <InlineCode>
                  {`WHERE parent = '/' AND hidden = 0`}
                </InlineCode>
                . Future sidebar data source — replaces the hardcoded{" "}
                <InlineCode>navItems</InlineCode> array.
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Breadcrumb Behavior ──────────────────── */}
      <section>
        <H2>Breadcrumb Behavior</H2>
        <Paragraph>
          Component: <InlineCode>PageBreadcrumb</InlineCode> — async server
          component. Uses the existing shadcn{" "}
          <InlineCode>Breadcrumb</InlineCode> primitives from{" "}
          <InlineCode>@/components/ui/breadcrumb</InlineCode>.
        </Paragraph>

        <div className={styles.breadcrumbDemo}>
          <div>
            <div className={styles.breadcrumbLabel}>
              /pool → getAncestors(&quot;/pool&quot;)
            </div>
            <div className={styles.breadcrumbTrail}>
              <span className={styles.breadcrumbAncestor}>Apps</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Pool</span>
            </div>
          </div>

          <Separator className={styles.sectionDivider} />

          <div>
            <div className={styles.breadcrumbLabel}>
              /cpu-ladder → getAncestors(&quot;/cpu-ladder&quot;)
            </div>
            <div className={styles.breadcrumbTrail}>
              <span className={styles.breadcrumbAncestor}>Apps</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>CPU Ladder</span>
            </div>
          </div>

          <Separator className={styles.sectionDivider} />

          <div>
            <div className={styles.breadcrumbLabel}>
              /posts/hello-world → path=&quot;/posts&quot; +
              currentTitle=&quot;Hello World&quot;
            </div>
            <div className={styles.breadcrumbTrail}>
              <span className={styles.breadcrumbAncestor}>Posts</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Hello World</span>
            </div>
          </div>

          <Separator className={styles.sectionDivider} />

          <div>
            <div className={styles.breadcrumbLabel}>
              /admin/content → getAncestors(&quot;/admin/content&quot;)
            </div>
            <div className={styles.breadcrumbTrail}>
              <span className={styles.breadcrumbAncestor}>Admin</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Content</span>
            </div>
          </div>
        </div>

        <Separator className={styles.sectionDivider} />

        <H3>Props</H3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <InlineCode>path</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>string</InlineCode>
              </TableCell>
              <TableCell>
                The current page&apos;s path. For dynamic pages, pass the
                parent section path (e.g.{" "}
                <InlineCode>&quot;/posts&quot;</InlineCode>).
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>currentTitle</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>string?</InlineCode>
              </TableCell>
              <TableCell>
                Override the last breadcrumb label. Used by{" "}
                <InlineCode>/posts/[slug]</InlineCode> and{" "}
                <InlineCode>/docs/[slug]</InlineCode> to append the
                article&apos;s title without the slug page being in the DB.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Paragraph>
          <Bold>Rules:</Bold> Root <InlineCode>/</InlineCode> is never shown
          in the trail. All non-root pages get breadcrumbs. Ancestors are
          clickable links. The current page is plain text (not a link).
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Implementation Phases ──────────────────── */}
      <section>
        <H2>Implementation Phases</H2>
        <Paragraph>
          Incremental migration — breadcrumbs first, not everything at once.
        </Paragraph>

        <div className={styles.phaseGrid}>
          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>1</span>
                <CardTitle>Database</CardTitle>
              </div>
              <CardDescription>
                Migration + seed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  Create <InlineCode>003-pages-table.sql</InlineCode>
                </ListItem>
                <ListItem>
                  Run migration via{" "}
                  <InlineCode>run-migration.ts</InlineCode>
                </ListItem>
                <ListItem>
                  Create <InlineCode>seed.ts</InlineCode> — insert ~11 static
                  pages
                </ListItem>
                <ListItem>Verify with SELECT query</ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>2</span>
                <CardTitle>Module</CardTitle>
              </div>
              <CardDescription>
                Types + queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <InlineCode>src/modules/pages/types.ts</InlineCode> —{" "}
                  <InlineCode>PageRow</InlineCode> type
                </ListItem>
                <ListItem>
                  <InlineCode>src/modules/pages/queries.ts</InlineCode> — 4
                  query functions
                </ListItem>
                <ListItem>
                  Follow <InlineCode>content/queries.ts</InlineCode> pattern
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>3</span>
                <CardTitle>Breadcrumb</CardTitle>
              </div>
              <CardDescription>
                Server component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <InlineCode>PageBreadcrumb.tsx</InlineCode> — async server
                  component
                </ListItem>
                <ListItem>
                  Calls <InlineCode>getAncestors()</InlineCode>
                </ListItem>
                <ListItem>
                  Renders with shadcn <InlineCode>Breadcrumb*</InlineCode>{" "}
                  primitives
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>4</span>
                <CardTitle>Wire Pages</CardTitle>
              </div>
              <CardDescription>
                Add breadcrumbs to all routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  Static pages: <InlineCode>{`<PageBreadcrumb path="/pool" />`}</InlineCode>
                </ListItem>
                <ListItem>
                  Dynamic pages: add <InlineCode>currentTitle</InlineCode>{" "}
                  prop
                </ListItem>
                <ListItem>All non-root pages get breadcrumbs</ListItem>
              </List>
            </CardContent>
          </Card>
        </div>

        <Card className={styles.deferredCard}>
          <CardHeader>
            <div className={styles.phaseHeader}>
              <Badge variant="secondary">Deferred</Badge>
              <CardTitle>Phase 5 — Sidebar Migration</CardTitle>
            </div>
            <CardDescription>
              Replace hardcoded <InlineCode>navItems</InlineCode> with{" "}
              <InlineCode>getRootPages()</InlineCode> query. Icons from the{" "}
              <InlineCode>icon</InlineCode> column. Not this PR.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Key Decisions ──────────────────── */}
      <section>
        <H2>Key Decisions</H2>

        <div className={styles.decisionGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Path as natural key</CardTitle>
            </CardHeader>
            <CardContent>
              <Paragraph>
                <InlineCode>path</InlineCode> is UNIQUE and used as the{" "}
                <InlineCode>parent</InlineCode> FK reference — not UUID. In a
                URL-routed app you always know the path, so you never need to
                look up an ID first. Simpler queries, simpler mental model.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dynamic slugs excluded</CardTitle>
            </CardHeader>
            <CardContent>
              <Paragraph>
                <InlineCode>/posts/[slug]</InlineCode> and{" "}
                <InlineCode>/docs/[slug]</InlineCode> are not in the pages
                table. Their breadcrumbs come from the parent section + a
                runtime <InlineCode>currentTitle</InlineCode> prop. This
                avoids syncing two tables.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DB-backed from day 1</CardTitle>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Could have been a static TypeScript file, but we chose Turso
                from the start. The tree is tiny (~11 rows) but this sets the
                foundation for admin UI editing, dynamic page creation, and
                permission gates later.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content as JSON array</CardTitle>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Ordered children stored as a JSON array of paths in the{" "}
                <InlineCode>content</InlineCode> column. Could be a join table
                later but overkill for ~15 rows. Parsed at query time via{" "}
                <InlineCode>JSON.parse()</InlineCode>.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Iterative ancestor walks</CardTitle>
            </CardHeader>
            <CardContent>
              <Paragraph>
                <InlineCode>getAncestors()</InlineCode> makes one query per
                tree level (max ~4). No recursive CTE needed for this depth.
                Optimize later if the tree gets deep.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No caching yet</CardTitle>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Turso is fast and the tree is tiny.{" "}
                <InlineCode>getAncestors()</InlineCode> hits the DB on every
                page load — fine for now. Add{" "}
                <InlineCode>React.cache</InlineCode> or{" "}
                <InlineCode>unstable_cache</InlineCode> later if needed.
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── File Map ──────────────────── */}
      <section>
        <H2>File Map</H2>
        <Paragraph>
          Every file involved in this feature — what to create, what to modify,
          what to reuse.
        </Paragraph>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/db/migrations/003-pages-table.sql</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>Pages table DDL</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/pages/types.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>
                <InlineCode>PageRow</InlineCode> type definition
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/pages/queries.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>4 query functions + parseRow helper</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/pages/seed.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>One-time script to insert ~11 page rows</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/components/layout/PageBreadcrumb.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>Async server breadcrumb component</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/db/run-migration.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">reuse</Badge>
              </TableCell>
              <TableCell>Existing generic migration runner</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/db/turso.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">reuse</Badge>
              </TableCell>
              <TableCell>
                Existing DB client — import{" "}
                <InlineCode>db</InlineCode>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/components/ui/breadcrumb.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">reuse</Badge>
              </TableCell>
              <TableCell>Existing shadcn breadcrumb primitives</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/pool/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>Add breadcrumb</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/cpu-ladder/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>Add breadcrumb</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/posts/[slug]/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>
                Add breadcrumb with{" "}
                <InlineCode>currentTitle</InlineCode>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/docs/[slug]/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>
                Add breadcrumb with{" "}
                <InlineCode>currentTitle</InlineCode>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Verification ──────────────────── */}
      <section>
        <H2>Verification</H2>
        <Paragraph>
          Commands to run after implementation, in order.
        </Paragraph>

        <div className={styles.verificationList}>
          <H3>1. Run migration</H3>
          <div className={styles.cmdBlock}>
            npx tsx --env-file=.env.local src/modules/db/run-migration.ts
            src/modules/db/migrations/003-pages-table.sql
          </div>

          <H3>2. Seed data</H3>
          <div className={styles.cmdBlock}>
            npx tsx --env-file=.env.local src/modules/pages/seed.ts
          </div>

          <H3>3. Verify seed</H3>
          <div className={styles.cmdBlock}>
            npx tsx --env-file=.env.local -e &quot;import {"{ db }"} from
            &apos;./src/modules/db/turso&apos;; db.execute(&apos;SELECT
            path, title, parent FROM pages ORDER BY path&apos;).then(r
            =&gt; console.table(r.rows))&quot;
          </div>

          <H3>4. Build check</H3>
          <div className={styles.cmdBlock}>npx next build</div>

          <H3>5. Manual verification</H3>
          <List>
            <ListItem>
              Navigate to <InlineCode>/pool</InlineCode> → breadcrumb shows{" "}
              <Bold>Apps / Pool</Bold>
            </ListItem>
            <ListItem>
              Navigate to <InlineCode>/cpu-ladder</InlineCode> → breadcrumb
              shows <Bold>Apps / CPU Ladder</Bold>
            </ListItem>
            <ListItem>
              Navigate to <InlineCode>/posts/hello-world</InlineCode> →
              breadcrumb shows <Bold>Posts / Hello World</Bold>
            </ListItem>
            <ListItem>
              Navigate to <InlineCode>/admin/content</InlineCode> → breadcrumb
              shows <Bold>Admin / Content</Bold>
            </ListItem>
          </List>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Future ──────────────────── */}
      <section>
        <H2>Future</H2>
        <Paragraph>
          Things this data model unlocks once the foundation is in place.
        </Paragraph>
        <List>
          <ListItem>
            <Bold>Sidebar from DB</Bold> — replace hardcoded{" "}
            <InlineCode>navItems</InlineCode> with{" "}
            <InlineCode>getRootPages()</InlineCode> +{" "}
            <InlineCode>getChildren()</InlineCode>
          </ListItem>
          <ListItem>
            <Bold>Infinite nesting</Bold> — any page can be a parent. The
            schema already supports arbitrary depth.
          </ListItem>
          <ListItem>
            <Bold>Admin page editor</Bold> — CRUD UI for creating, reordering,
            and nesting pages. Update{" "}
            <InlineCode>content</InlineCode> arrays and{" "}
            <InlineCode>parent</InlineCode> pointers.
          </ListItem>
          <ListItem>
            <Bold>Permissions</Bold> — walk the{" "}
            <InlineCode>parent</InlineCode> chain to inherit access rules.
            Admin pages already have <InlineCode>hidden: true</InlineCode> as
            a starting point.
          </ListItem>
          <ListItem>
            <Bold>Content table integration</Bold> — add a{" "}
            <InlineCode>content_id</InlineCode> FK to merge pages and content
            rows, or keep them bridged via props.
          </ListItem>
          <ListItem>
            <Bold>Caching</Bold> — wrap{" "}
            <InlineCode>getAncestors()</InlineCode> in{" "}
            <InlineCode>React.cache</InlineCode> or{" "}
            <InlineCode>unstable_cache</InlineCode> once traffic justifies it.
          </ListItem>
        </List>
      </section>

      <Separator className={styles.divider} />

      <Small className={styles.footer}>
        Last updated: April 2026 · Source of truth for the blocks data model
      </Small>
    </Container>
  );
}
