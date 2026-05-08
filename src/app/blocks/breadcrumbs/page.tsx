import type { Metadata } from "next";
import styles from "./breadcrumbs.module.css";
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
  title: "Blocks – Breadcrumb Implementation",
  description:
    "Design document for the initial breadcrumb implementation using the blocks + page_properties tables.",
};

export default function BreadcrumbsPage() {
  return (
    <Container className={styles.page}>
      {/* ────────────────────────── Header ────────────────────────── */}
      <div className={styles.header}>
        <Badge variant="outline">Design Document</Badge>
        <H1>Breadcrumb Implementation</H1>
        <Paragraph className={styles.subtitle}>
          The first consumer of the <Highlight>blocks</Highlight> data model —
          a{" "}
          <InlineCode>PageBreadcrumb</InlineCode> server component that walks
          the block tree to render navigation breadcrumbs on every non-root
          page.
        </Paragraph>
      </div>

      <Separator className={styles.divider} />

      {/* ──────────────────── Overview ──────────────────── */}
      <section>
        <H2>Overview</H2>
        <Paragraph>
          Every page in the app is represented as a row spanning{" "}
          <Bold>two tables</Bold>: a shared{" "}
          <InlineCode>blocks</InlineCode> table that holds the tree structure,
          and a <InlineCode>page_properties</InlineCode> table that holds
          page-specific columns with real database constraints.
        </Paragraph>
        <Paragraph>
          This is the <Bold>shared skeleton + type tables</Bold> pattern.
          The <InlineCode>blocks</InlineCode> table owns the universal tree
          shape (<InlineCode>id</InlineCode>, <InlineCode>type</InlineCode>,{" "}
          <InlineCode>parent</InlineCode>, <InlineCode>content</InlineCode>).
          Each block type gets its own properties table with proper columns,
          indexes, and constraints — never a JSON blob.
        </Paragraph>
        <Paragraph>
          Breadcrumbs are built by joining{" "}
          <InlineCode>blocks</InlineCode> with{" "}
          <InlineCode>page_properties</InlineCode> and walking the{" "}
          <InlineCode>parent</InlineCode> pointer chain upward. Path lookups
          hit an indexed <InlineCode>UNIQUE</InlineCode> column, not{" "}
          <InlineCode>json_extract()</InlineCode>.
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Why Table-Per-Type ──────────────────── */}
      <section>
        <H2>Why Table-Per-Type</H2>
        <Paragraph>
          &ldquo;Everything is a block&rdquo; doesn&apos;t mean everything
          goes in one table. The block model defines the{" "}
          <Bold>tree structure</Bold> — parent/child relationships. The{" "}
          <Bold>properties</Bold> of each type are fundamentally different and
          deserve their own schema.
        </Paragraph>

        <div className={styles.compareGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Single-table JSON</CardTitle>
              <CardDescription>
                What we considered first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.tradeoffList}>
                <Paragraph>
                  <Bold>Problem:</Bold> No{" "}
                  <InlineCode>UNIQUE</InlineCode> constraint on path inside
                  JSON — the DB can&apos;t protect your data.
                </Paragraph>
                <Paragraph>
                  <Bold>Problem:</Bold>{" "}
                  <InlineCode>json_extract()</InlineCode> lookups are full
                  table scans. Expression indexes exist but are fragile.
                </Paragraph>
                <Paragraph>
                  <Bold>Problem:</Bold> No{" "}
                  <InlineCode>NOT NULL</InlineCode> enforcement on required
                  fields. A typo in a key name silently passes.
                </Paragraph>
                <Paragraph>
                  <Bold>Problem:</Bold> Every query for page data needs{" "}
                  <InlineCode>json_extract()</InlineCode> calls, making SQL
                  verbose and harder to reason about.
                </Paragraph>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table-per-type</CardTitle>
              <CardDescription>What we&apos;re doing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.tradeoffList}>
                <Paragraph>
                  <InlineCode>path UNIQUE NOT NULL</InlineCode> — the DB
                  enforces uniqueness and presence.
                </Paragraph>
                <Paragraph>
                  <InlineCode>title NOT NULL</InlineCode> — can&apos;t
                  accidentally insert a page without a name.
                </Paragraph>
                <Paragraph>
                  Standard indexed columns — fast lookups, standard tooling,
                  no <InlineCode>json_extract()</InlineCode>.
                </Paragraph>
                <Paragraph>
                  Adding a new block type = <InlineCode>CREATE TABLE</InlineCode>{" "}
                  for its properties. No <InlineCode>ALTER TABLE</InlineCode>{" "}
                  on existing tables.
                </Paragraph>
              </div>
            </CardContent>
          </Card>
        </div>

        <Paragraph className={styles.tableNote}>
          With ~15 rows the performance difference is zero. This is a{" "}
          <Bold>data design</Bold> decision, not a performance one — we want
          the DB to enforce correctness so the application layer doesn&apos;t
          have to.
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Database Schema ──────────────────── */}
      <section>
        <H2>Database Schema</H2>
        <Paragraph>
          Migration <InlineCode>003-blocks-table.sql</InlineCode> — two
          tables in one migration. The tree lives in{" "}
          <InlineCode>blocks</InlineCode>, page-specific data lives in{" "}
          <InlineCode>page_properties</InlineCode>.
        </Paragraph>

        <div className={styles.schemaLabel}>blocks — shared tree skeleton</div>
        <div className={styles.schemaBlock}>
          <pre className={styles.schemaPre}>
            <code>
              <span className={styles.sqlKeyword}>CREATE TABLE</span>{" "}
              <span className={styles.sqlCol}>blocks</span> {"(\n"}
              {"  "}
              <span className={styles.sqlCol}>id</span>{"          "}
              <span className={styles.sqlType}>TEXT PRIMARY KEY</span>
              {","}
              <span className={styles.sqlComment}>
                {"  -- crypto.randomUUID()"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>type</span>{"        "}
              <span className={styles.sqlType}>TEXT NOT NULL</span>
              {","}
              <span className={styles.sqlComment}>
                {"     -- \"page\" (future: \"text\", \"heading\", \"image\")"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>content</span>{"     "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"               -- JSON array of child block IDs"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>parent</span>{"      "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"               -- FK → blocks.id (NULL for root)"}
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
              <span className={styles.sqlCol}>blocks</span>
              {"("}
              <span className={styles.sqlCol}>id</span>
              {")\n);"}
            </code>
          </pre>
        </div>

        <div className={styles.schemaLabel}>page_properties — page-specific columns</div>
        <div className={styles.schemaBlock}>
          <pre className={styles.schemaPre}>
            <code>
              <span className={styles.sqlKeyword}>CREATE TABLE</span>{" "}
              <span className={styles.sqlCol}>page_properties</span> {"(\n"}
              {"  "}
              <span className={styles.sqlCol}>block_id</span>{"     "}
              <span className={styles.sqlType}>TEXT PRIMARY KEY</span>
              {","}
              <span className={styles.sqlComment}>
                {"  -- FK → blocks.id (1:1)"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>path</span>{"         "}
              <span className={styles.sqlType}>TEXT UNIQUE NOT NULL</span>
              {","}
              <span className={styles.sqlComment}>
                {" -- \"/pool\", \"/apps\""}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>title</span>{"        "}
              <span className={styles.sqlType}>TEXT NOT NULL</span>
              {","}
              <span className={styles.sqlComment}>
                {"        -- \"Pool\", \"CPU Ladder\""}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>description</span>{"  "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"               -- OG / meta description"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>icon</span>{"         "}
              <span className={styles.sqlType}>TEXT</span>
              {","}
              <span className={styles.sqlComment}>
                {"               -- lucide icon name"}
              </span>
              {"\n  "}
              <span className={styles.sqlCol}>hidden</span>{"       "}
              <span className={styles.sqlType}>BOOLEAN DEFAULT 0</span>
              {","}
              <span className={styles.sqlComment}>
                {"  -- exclude from nav"}
              </span>
              {"\n\n  "}
              <span className={styles.sqlKeyword}>FOREIGN KEY</span>{" "}
              {"("}
              <span className={styles.sqlCol}>block_id</span>
              {") "}
              <span className={styles.sqlKeyword}>REFERENCES</span>{" "}
              <span className={styles.sqlCol}>blocks</span>
              {"("}
              <span className={styles.sqlCol}>id</span>
              {")\n);"}
            </code>
          </pre>
        </div>

        <Separator className={styles.sectionDivider} />

        <H3>Column Reference — blocks</H3>
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
                UUID v4 via <InlineCode>crypto.randomUUID()</InlineCode> —
                the stable identifier for all references
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>type</InlineCode>
              </TableCell>
              <TableCell>TEXT</TableCell>
              <TableCell>
                Block type discriminator. Initially just{" "}
                <InlineCode>&quot;page&quot;</InlineCode>. Tells you which
                properties table to join.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>content</InlineCode>
              </TableCell>
              <TableCell>TEXT? (JSON)</TableCell>
              <TableCell>
                Ordered JSON array of child block IDs. Determines rendering
                order in nav and listings.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>parent</InlineCode>
              </TableCell>
              <TableCell>TEXT? FK</TableCell>
              <TableCell>
                UUID of the parent block. <InlineCode>NULL</InlineCode> only
                for root <InlineCode>/</InlineCode>. FK to{" "}
                <InlineCode>blocks.id</InlineCode>.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>created_at</InlineCode>
              </TableCell>
              <TableCell>TEXT</TableCell>
              <TableCell>ISO 8601 timestamp</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>updated_at</InlineCode>
              </TableCell>
              <TableCell>TEXT</TableCell>
              <TableCell>ISO 8601 timestamp</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator className={styles.sectionDivider} />

        <H3>Column Reference — page_properties</H3>
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
                <InlineCode>block_id</InlineCode>
              </TableCell>
              <TableCell>TEXT PK FK</TableCell>
              <TableCell>
                1:1 with <InlineCode>blocks.id</InlineCode>. Also the
                primary key — enforces one properties row per block.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>path</InlineCode>
              </TableCell>
              <TableCell>TEXT UNIQUE NOT NULL</TableCell>
              <TableCell>
                URL path — the natural lookup key. Enforced unique at the DB
                level.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>title</InlineCode>
              </TableCell>
              <TableCell>TEXT NOT NULL</TableCell>
              <TableCell>
                Display name for breadcrumbs, nav, and metadata. Cannot be
                null.
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
                <InlineCode>hidden</InlineCode>
              </TableCell>
              <TableCell>BOOLEAN</TableCell>
              <TableCell>
                If <InlineCode>1</InlineCode>, excluded from public
                nav/sidebar
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Paragraph className={styles.tableNote}>
          Future block types get their own table:{" "}
          <InlineCode>text_properties</InlineCode>,{" "}
          <InlineCode>image_properties</InlineCode>, etc. Each with its own
          shape, constraints, and indexes. No{" "}
          <InlineCode>ALTER TABLE</InlineCode> on existing tables — just{" "}
          <InlineCode>CREATE TABLE</InlineCode>.
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Page Tree ──────────────────── */}
      <section>
        <H2>Page Tree</H2>
        <Paragraph>
          The complete hierarchy to seed. Each entry creates one row in{" "}
          <InlineCode>blocks</InlineCode> (type ={" "}
          <InlineCode>&quot;page&quot;</InlineCode>) and one row in{" "}
          <InlineCode>page_properties</InlineCode>. Dynamic slug pages
          (<InlineCode>/posts/[slug]</InlineCode>,{" "}
          <InlineCode>/docs/[slug]</InlineCode>) are{" "}
          <Bold>not stored</Bold> — they derive breadcrumbs from their parent
          section at runtime using the <InlineCode>currentTitle</InlineCode>{" "}
          prop.
        </Paragraph>

        <div className={styles.tree}>
          {/* Root */}
          <div className={styles.treeNode}>
            <span className={styles.treePath}>/</span>
            <Badge variant="secondary">page</Badge>
            <span className={styles.treeLabel}>Home · parent: null</span>
          </div>

          {/* Apps branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/apps</span>
            <Badge variant="outline">page</Badge>
            <span className={styles.treeLabel}>Apps</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/pool</span>
            <Badge variant="default">page</Badge>
            <span className={styles.treeLabel}>Pool</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/cpu-ladder</span>
            <Badge variant="default">page</Badge>
            <span className={styles.treeLabel}>CPU Ladder</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/deep-dive</span>
            <Badge variant="default">page</Badge>
            <span className={styles.treeLabel}>Deep Dive</span>
          </div>

          {/* Posts branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/posts</span>
            <Badge variant="outline">page</Badge>
            <span className={styles.treeLabel}>Posts</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treeLabel}>
              /posts/[slug] <Italic>(dynamic — not in DB)</Italic>
            </span>
          </div>

          {/* Docs branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/docs</span>
            <Badge variant="outline">page</Badge>
            <span className={styles.treeLabel}>Docs</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treeLabel}>
              /docs/[slug] <Italic>(dynamic — not in DB)</Italic>
            </span>
          </div>

          {/* Blocks branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/blocks</span>
            <Badge variant="outline">page</Badge>
            <span className={styles.treeLabel}>Blocks</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/blocks/design-doc</span>
            <Badge variant="default">page</Badge>
            <span className={styles.treeLabel}>Design Document</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/blocks/breadcrumbs</span>
            <Badge variant="default">page</Badge>
            <span className={styles.treeLabel}>Breadcrumbs (this page)</span>
          </div>

          {/* Admin branch */}
          <div className={`${styles.treeNode} ${styles.indent1}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/admin</span>
            <Badge variant="destructive">page</Badge>
            <span className={styles.treeLabel}>Admin (hidden)</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/admin/content</span>
            <Badge variant="destructive">page</Badge>
            <span className={styles.treeLabel}>Content</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>├─</span>
            <span className={styles.treePath}>/admin/pool</span>
            <Badge variant="destructive">page</Badge>
            <span className={styles.treeLabel}>Pool Admin</span>
          </div>
          <div className={`${styles.treeNode} ${styles.indent2}`}>
            <span className={styles.treeBranch}>└─</span>
            <span className={styles.treePath}>/admin/login</span>
            <Badge variant="destructive">page</Badge>
            <span className={styles.treeLabel}>Login (hidden)</span>
          </div>
        </div>

        <Paragraph className={styles.tableNote}>
          <Bold>~15 page blocks.</Bold> Each creates one row in{" "}
          <InlineCode>blocks</InlineCode> and one in{" "}
          <InlineCode>page_properties</InlineCode>. The seed script inserts
          both in a transaction.
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Query API ──────────────────── */}
      <section>
        <H2>Query API</H2>
        <Paragraph>
          Module: <InlineCode>src/modules/blocks/queries.ts</InlineCode> —
          follows the pattern from{" "}
          <InlineCode>src/modules/content/queries.ts</InlineCode>. Page
          lookups join <InlineCode>blocks</InlineCode> with{" "}
          <InlineCode>page_properties</InlineCode> using an indexed{" "}
          <InlineCode>path</InlineCode> column — no{" "}
          <InlineCode>json_extract()</InlineCode>.
        </Paragraph>

        <div className={styles.apiList}>
          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getBlockById</span>
                <span className={styles.fnParams}>(id: string)</span>
                <span className={styles.fnReturn}>
                  {" → Block | null"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Direct lookup by UUID primary key on the{" "}
                <InlineCode>blocks</InlineCode> table. The foundation query.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getPageByPath</span>
                <span className={styles.fnParams}>(path: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageBlock | null"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Join <InlineCode>blocks</InlineCode> with{" "}
                <InlineCode>page_properties</InlineCode> and look up by the
                indexed <InlineCode>path</InlineCode> column:{" "}
                <InlineCode>
                  WHERE pp.path = ?
                </InlineCode>
                . The primary entry point for breadcrumbs — you always know
                the current URL.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getAncestors</span>
                <span className={styles.fnParams}>(id: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageBlock[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Walk <InlineCode>parent</InlineCode> pointers upward from a
                block ID, joining <InlineCode>page_properties</InlineCode> at
                each step to get titles and paths. Returns ordered array{" "}
                <InlineCode>[root, ..., grandparent, parent]</InlineCode> —
                excludes the current block.{" "}
                <Bold>This is the core breadcrumb query.</Bold> Max depth ~4,
                so iterative walks are fine without recursive CTE.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getAncestorsByPath</span>
                <span className={styles.fnParams}>(path: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageBlock[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Convenience wrapper: calls{" "}
                <InlineCode>getPageByPath()</InlineCode> then{" "}
                <InlineCode>getAncestors()</InlineCode>. This is what{" "}
                <InlineCode>PageBreadcrumb</InlineCode> actually calls —
                pass a URL path, get the ancestor chain back.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getChildren</span>
                <span className={styles.fnParams}>(id: string)</span>
                <span className={styles.fnReturn}>
                  {" → PageBlock[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Parse the <InlineCode>content</InlineCode> JSON array on the
                parent block and fetch those blocks (joined with{" "}
                <InlineCode>page_properties</InlineCode>) in order. Used for
                listing sub-pages and generating nav sections.{" "}
                <Italic>Not needed for breadcrumbs but included for
                completeness.</Italic>
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.fnSignature}>
                <span className={styles.fnName}>getRootChildren</span>
                <span className={styles.fnParams}>()</span>
                <span className={styles.fnReturn}>
                  {" → PageBlock[]"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph>
                Top-level visible page blocks:{" "}
                <InlineCode>
                  {`WHERE b.parent = (root_id) AND pp.hidden = 0`}
                </InlineCode>
                . Future sidebar data source — not needed for breadcrumbs but
                sets up the next phase.
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Breadcrumb Component ──────────────────── */}
      <section>
        <H2>PageBreadcrumb Component</H2>
        <Paragraph>
          An <Bold>async server component</Bold> in{" "}
          <InlineCode>src/components/layout/PageBreadcrumb.tsx</InlineCode>.
          Uses the existing shadcn{" "}
          <InlineCode>Breadcrumb</InlineCode> primitives from{" "}
          <InlineCode>@/components/ui/breadcrumb</InlineCode>.
        </Paragraph>

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
                The current page&apos;s URL path. For dynamic slug pages, pass
                the <Bold>parent section</Bold> path (e.g.{" "}
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
                Override the last breadcrumb segment. Used by{" "}
                <InlineCode>/posts/[slug]</InlineCode> and{" "}
                <InlineCode>/docs/[slug]</InlineCode> to append the
                article&apos;s title as the final crumb — without the slug
                page needing a row in the DB.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator className={styles.sectionDivider} />

        <H3>Rendering Logic</H3>
        <List>
          <ListItem>
            Call <InlineCode>getPageByPath(path)</InlineCode> to find the
            current page block (joins{" "}
            <InlineCode>blocks</InlineCode> + <InlineCode>page_properties</InlineCode>).
          </ListItem>
          <ListItem>
            Call <InlineCode>getAncestors(block.id)</InlineCode> to get the
            ancestor chain — returns{" "}
            <InlineCode>[root, ..., parent]</InlineCode>, each with{" "}
            <InlineCode>path</InlineCode> and <InlineCode>title</InlineCode>{" "}
            from the joined properties.
          </ListItem>
          <ListItem>
            <Bold>Skip root</Bold> — the <InlineCode>/</InlineCode> block is
            never shown in the breadcrumb trail.
          </ListItem>
          <ListItem>
            Render each ancestor (except root) as a{" "}
            <InlineCode>BreadcrumbLink</InlineCode> pointing to its path.
          </ListItem>
          <ListItem>
            Render the <Bold>current page</Bold> as a{" "}
            <InlineCode>BreadcrumbPage</InlineCode> (plain text, not a link).
          </ListItem>
          <ListItem>
            If <InlineCode>currentTitle</InlineCode> is provided, use it
            as the final crumb label instead of the block&apos;s title. The block
            at <InlineCode>path</InlineCode> becomes an ancestor link, and{" "}
            <InlineCode>currentTitle</InlineCode> becomes the current page
            text.
          </ListItem>
          <ListItem>
            Separate crumbs with{" "}
            <InlineCode>BreadcrumbSeparator</InlineCode> (renders a chevron).
          </ListItem>
        </List>

        <Separator className={styles.sectionDivider} />

        <H3>Examples</H3>
        <div className={styles.breadcrumbDemo}>
          <div>
            <div className={styles.breadcrumbLabel}>
              {`<PageBreadcrumb path="/pool" />`}
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
              {`<PageBreadcrumb path="/cpu-ladder" />`}
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
              {`<PageBreadcrumb path="/posts" currentTitle="Hello World" />`}
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
              {`<PageBreadcrumb path="/blocks/breadcrumbs" />`}
            </div>
            <div className={styles.breadcrumbTrail}>
              <span className={styles.breadcrumbAncestor}>Blocks</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Breadcrumbs</span>
            </div>
          </div>

          <Separator className={styles.sectionDivider} />

          <div>
            <div className={styles.breadcrumbLabel}>
              {`<PageBreadcrumb path="/admin/content" />`}
            </div>
            <div className={styles.breadcrumbTrail}>
              <span className={styles.breadcrumbAncestor}>Admin</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Content</span>
            </div>
          </div>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Route Coverage ──────────────────── */}
      <section>
        <H2>Route Coverage</H2>
        <Paragraph>
          Every route in the app and how it receives breadcrumbs.
        </Paragraph>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Approach</TableHead>
              <TableHead>Trail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <InlineCode>/</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">skip</Badge>
              </TableCell>
              <TableCell>Root — no breadcrumb</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/apps</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/apps"`}</InlineCode>
              </TableCell>
              <TableCell>Apps</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/pool</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/pool"`}</InlineCode>
              </TableCell>
              <TableCell>Apps / Pool</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/cpu-ladder</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/cpu-ladder"`}</InlineCode>
              </TableCell>
              <TableCell>Apps / CPU Ladder</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/deep-dive</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">skip</Badge>
              </TableCell>
              <TableCell>
                Client component — needs refactoring first
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/posts</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/posts"`}</InlineCode>
              </TableCell>
              <TableCell>Posts</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/posts/[slug]</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/posts" currentTitle={title}`}</InlineCode>
              </TableCell>
              <TableCell>Posts / Article Title</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/docs</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/docs"`}</InlineCode>
              </TableCell>
              <TableCell>Docs</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/docs/[slug]</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/docs" currentTitle={title}`}</InlineCode>
              </TableCell>
              <TableCell>Docs / Doc Title</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/blocks</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/blocks"`}</InlineCode>
              </TableCell>
              <TableCell>Blocks</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/blocks/*</InlineCode>
              </TableCell>
              <TableCell>
                <InlineCode>{`path="/blocks/..."`}</InlineCode>
              </TableCell>
              <TableCell>Blocks / Sub-page</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/admin/*</InlineCode>
              </TableCell>
              <TableCell>
                via <InlineCode>admin/layout.tsx</InlineCode>
              </TableCell>
              <TableCell>Admin / Content, Admin / Pool</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/admin/login</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">skip</Badge>
              </TableCell>
              <TableCell>Hidden login page — no breadcrumb</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>/pool/test</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">skip</Badge>
              </TableCell>
              <TableCell>Dev-only test page — no breadcrumb</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Implementation Phases ──────────────────── */}
      <section>
        <H2>Implementation Phases</H2>
        <Paragraph>
          Four phases, done incrementally. Each phase produces a working state.
        </Paragraph>

        <div className={styles.phaseGrid}>
          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>1</span>
                <CardTitle>Database</CardTitle>
              </div>
              <CardDescription>Migration + seed</CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  Create <InlineCode>003-blocks-table.sql</InlineCode> with
                  both <InlineCode>blocks</InlineCode> and{" "}
                  <InlineCode>page_properties</InlineCode> tables
                </ListItem>
                <ListItem>
                  Run migration via{" "}
                  <InlineCode>run-migration.ts</InlineCode>
                </ListItem>
                <ListItem>
                  Create <InlineCode>seed.ts</InlineCode> — insert ~15 page
                  blocks with UUIDs, parent pointers, and matching
                  page_properties rows in a transaction
                </ListItem>
                <ListItem>
                  Verify with{" "}
                  <InlineCode>SELECT b.id, pp.path, pp.title FROM blocks b JOIN page_properties pp ON pp.block_id = b.id</InlineCode>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>2</span>
                <CardTitle>Module</CardTitle>
              </div>
              <CardDescription>Types + queries</CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <InlineCode>src/modules/blocks/types.ts</InlineCode> —{" "}
                  <InlineCode>Block</InlineCode>,{" "}
                  <InlineCode>PageProperties</InlineCode>,{" "}
                  <InlineCode>PageBlock</InlineCode> types
                </ListItem>
                <ListItem>
                  <InlineCode>src/modules/blocks/queries.ts</InlineCode> — 6
                  query functions using JOIN-based lookups
                </ListItem>
                <ListItem>
                  Follow <InlineCode>content/queries.ts</InlineCode> pattern:
                  db import, <InlineCode>parseBlock()</InlineCode> helper,
                  parameterized SQL
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>3</span>
                <CardTitle>Component</CardTitle>
              </div>
              <CardDescription>PageBreadcrumb</CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  <InlineCode>src/components/layout/PageBreadcrumb.tsx</InlineCode>{" "}
                  — async server component
                </ListItem>
                <ListItem>
                  Co-located <InlineCode>PageBreadcrumb.module.css</InlineCode>
                </ListItem>
                <ListItem>
                  Calls <InlineCode>getAncestorsByPath()</InlineCode>, renders
                  with shadcn <InlineCode>Breadcrumb*</InlineCode> primitives
                </ListItem>
                <ListItem>
                  Handles both static pages and dynamic{" "}
                  <InlineCode>currentTitle</InlineCode> override
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
              <CardDescription>Add breadcrumbs to all routes</CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                <ListItem>
                  Static pages:{" "}
                  <InlineCode>{`<PageBreadcrumb path="/pool" />`}</InlineCode>
                </ListItem>
                <ListItem>
                  Dynamic pages: pass{" "}
                  <InlineCode>currentTitle</InlineCode> from content query
                </ListItem>
                <ListItem>
                  Admin pages: add to{" "}
                  <InlineCode>admin/layout.tsx</InlineCode>
                </ListItem>
                <ListItem>
                  Skip: <InlineCode>/</InlineCode>,{" "}
                  <InlineCode>/deep-dive</InlineCode>,{" "}
                  <InlineCode>/pool/test</InlineCode>,{" "}
                  <InlineCode>/admin/login</InlineCode>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Types ──────────────────── */}
      <section>
        <H2>TypeScript Types</H2>
        <Paragraph>
          Module: <InlineCode>src/modules/blocks/types.ts</InlineCode>
        </Paragraph>

        <div className={styles.codeBlock}>
          <span className={styles.jsonComment}>
            {"// The shared block tree row"}
          </span>
          {"\n"}
          <span className={styles.sqlKeyword}>type</span>{" "}
          <span className={styles.sqlCol}>Block</span>
          {" = {\n"}
          {"  id: string;\n"}
          {"  type: string;\n"}
          {"  content: string[] | null;\n"}
          {"  parent: string | null;\n"}
          {"  created_at: string;\n"}
          {"  updated_at: string;\n"}
          {"}\n\n"}
          <span className={styles.jsonComment}>
            {"// The page_properties row"}
          </span>
          {"\n"}
          <span className={styles.sqlKeyword}>type</span>{" "}
          <span className={styles.sqlCol}>PageProperties</span>
          {" = {\n"}
          {"  block_id: string;\n"}
          {"  path: string;\n"}
          {"  title: string;\n"}
          {"  description: string | null;\n"}
          {"  icon: string | null;\n"}
          {"  hidden: boolean;\n"}
          {"}\n\n"}
          <span className={styles.jsonComment}>
            {"// Joined result: block + page_properties"}
          </span>
          {"\n"}
          <span className={styles.sqlKeyword}>type</span>{" "}
          <span className={styles.sqlCol}>PageBlock</span>
          {" = Block & PageProperties"}
        </div>

        <Paragraph className={styles.tableNote}>
          <InlineCode>PageBlock</InlineCode> is the flattened result of
          joining <InlineCode>blocks</InlineCode> with{" "}
          <InlineCode>page_properties</InlineCode>. No{" "}
          <InlineCode>JSON.parse()</InlineCode> needed — every field is a
          proper column with a known type. The{" "}
          <InlineCode>parseBlock()</InlineCode> helper only needs to handle{" "}
          <InlineCode>JSON.parse()</InlineCode> on{" "}
          <InlineCode>content</InlineCode> (the child ID array) and the{" "}
          <InlineCode>hidden</InlineCode> boolean coercion.
        </Paragraph>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── File Map ──────────────────── */}
      <section>
        <H2>File Map</H2>
        <Paragraph>
          Every file involved — what to create, what to modify, what to reuse.
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
                <InlineCode>src/modules/db/migrations/003-blocks-table.sql</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>
                <InlineCode>blocks</InlineCode> +{" "}
                <InlineCode>page_properties</InlineCode> DDL
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/blocks/types.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>
                <InlineCode>Block</InlineCode>,{" "}
                <InlineCode>PageProperties</InlineCode>,{" "}
                <InlineCode>PageBlock</InlineCode>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/blocks/queries.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>6 query functions (JOIN-based) + parseBlock helper</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/modules/blocks/seed.ts</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>
                Insert ~15 blocks + page_properties rows in transaction
              </TableCell>
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
                <InlineCode>src/components/layout/PageBreadcrumb.module.css</InlineCode>
              </TableCell>
              <TableCell>
                <Badge>create</Badge>
              </TableCell>
              <TableCell>Breadcrumb component styles</TableCell>
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
                Existing DB client — import <InlineCode>db</InlineCode>
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
                <InlineCode>src/app/apps/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>Add breadcrumb</TableCell>
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
                <InlineCode>src/app/posts/page.tsx</InlineCode>
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
                Add breadcrumb with <InlineCode>currentTitle</InlineCode>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/docs/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>Add breadcrumb</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/docs/[slug]/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>
                Add breadcrumb with <InlineCode>currentTitle</InlineCode>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/blocks/page.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>Add breadcrumb</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InlineCode>src/app/admin/layout.tsx</InlineCode>
              </TableCell>
              <TableCell>
                <Badge variant="outline">modify</Badge>
              </TableCell>
              <TableCell>Add breadcrumb for all admin routes</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator className={styles.divider} />

      {/* ──────────────────── Verification ──────────────────── */}
      <section>
        <H2>Verification</H2>
        <Paragraph>
          Commands and checks to run after each phase, in order.
        </Paragraph>

        <div className={styles.verificationList}>
          <H3>1. Run migration</H3>
          <div className={styles.cmdBlock}>
            npx tsx --env-file=.env.local src/modules/db/run-migration.ts
            src/modules/db/migrations/003-blocks-table.sql
          </div>

          <H3>2. Seed data</H3>
          <div className={styles.cmdBlock}>
            npx tsx --env-file=.env.local src/modules/blocks/seed.ts
          </div>

          <H3>3. Verify seed</H3>
          <div className={styles.cmdBlock}>
            {`SELECT b.id, b.type, pp.path, pp.title, b.parent`}
            {"\nFROM blocks b"}
            {"\nJOIN page_properties pp ON pp.block_id = b.id"}
            {"\nORDER BY pp.path;"}
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
              Navigate to a post → breadcrumb shows{" "}
              <Bold>Posts / Article Title</Bold>
            </ListItem>
            <ListItem>
              Navigate to <InlineCode>/admin/content</InlineCode> → breadcrumb
              shows <Bold>Admin / Content</Bold>
            </ListItem>
            <ListItem>
              Navigate to <InlineCode>/blocks/design-doc</InlineCode> →
              breadcrumb shows <Bold>Blocks / Design Document</Bold>
            </ListItem>
            <ListItem>
              Root <InlineCode>/</InlineCode> → no breadcrumb rendered
            </ListItem>
          </List>
        </div>
      </section>

      <Separator className={styles.divider} />

      <Small className={styles.footer}>
        Last updated: April 2026 · Breadcrumb implementation plan using the
        table-per-type blocks data model
      </Small>
    </Container>
  );
}
