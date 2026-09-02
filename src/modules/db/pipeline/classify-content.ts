import { db } from "../turso";

// Notes and ideas rather than finished articles. Sync never rewrites `type`
// after insert, so these stay put once set.
const THOUGHTS = [
  // the data-modeling throughline
  "gsc-generated-semantic-companion",
  "gsc-v2-markdown-purity-tool-architecture",
  "gsc-v3-markdown-tsx-mdx-boundary",
  "gsc-v4-practical-plan",
  "block-model-architecture",
  "frontmatter-is-a-dead-end",
  "md-vs-tsx",
  "mdx-does-not-win",
  "frankenformats-stop-making-your-markdown-do-things",
  "markdown-format-rant",
  "metadata-paradox",
  "architectural-blueprint-single-file-code-as-data-cms",
  "single-file-code-as-data-cms-architecture",
  "blueprint-dynamic-ai-driven-content-engine",
  "content-system-vision",
  "programs-not-documents",
  "pdf-the-frankenformat",
  // apps I might build but haven't
  "canon-creator-content-tracker",
  "project-launchpad-spec",
  "life-logger",
  "llm-component-designer",
];

const PROJECT_OF: Record<string, string[]> = {
  locus: ["bookmark-launcher-notes", "bottom-taskbar-search"],
  postmaster: ["building-postmaster"],
  bythehour: ["time-blocking-app-security"],
  "garmin-dashboard": ["garmin-sleep-dashboard"],
  "plasma-cosmos": ["vibecoding-plasma-cosmos-evolution"],
  resume: ["building-resume-with-react"],
  pool: ["pool-tracker-public-read-private-write-plan"],
  "jaygriff-com": [
    // site design, architecture, and build notes
    "admin-ui-passkey-auth-plan",
    "admin-ui-plan",
    "architecture",
    "backlog",
    "backlog-this-metadata-editor-workflow",
    "backlog-this-trigger-word-workflow",
    "boilerplate-setup-wizard",
    "client-component-page-title-debt",
    "content-editor",
    "content-layer-docs",
    "content-pipeline-handoff-notes",
    "content-pipeline-technical-deep-dive",
    "debug-codeblocks",
    "epic-dev-routes",
    "jaygriff-v2-file-tree",
    "live-feed-spec",
    "llm-seo-roadmap",
    "markdown-table-test",
    "migrating-to-sqlite",
    "modeling-projects-in-the-database",
    "project-scoped-content",
    "projects-architecture",
    "search-feature-spec",
    "sidebar-logo-squish-investigation",
    "stack",
    "styling-conventions",
    "styling-migration",
    "thumbnail-metadata-spec",
    "todo-docs-homepage",
    "todo-hide-header-metadata",
    "todo-system-organization",
    "todo-update-authorship-metadata",
    "why-no-tailwind",
    "why-react-components-rule",
    "tailwind-rant-blog",
    "making-my-own-ai-app-builder",
    // the skills that drive this site's content workflow
    "content-creator-skill-plan",
    "building-the-new-doc-skill",
    "building-and-debugging-a-post-creator-skill",
    "renaming-new-doc-to-md-artifact",
    // the data-modeling work all came out of building this
    "gsc-generated-semantic-companion",
    "gsc-v2-markdown-purity-tool-architecture",
    "gsc-v3-markdown-tsx-mdx-boundary",
    "gsc-v4-practical-plan",
    "block-model-architecture",
    "frontmatter-is-a-dead-end",
    "md-vs-tsx",
    "mdx-does-not-win",
    "frankenformats-stop-making-your-markdown-do-things",
    "markdown-format-rant",
    "metadata-paradox",
    "architectural-blueprint-single-file-code-as-data-cms",
    "single-file-code-as-data-cms-architecture",
    "blueprint-dynamic-ai-driven-content-engine",
    "content-system-vision",
    "programs-not-documents",
    "pdf-the-frankenformat",
  ],
};

const TAGS: Record<string, string[]> = {
  "data-modeling": [
    "gsc-generated-semantic-companion",
    "gsc-v2-markdown-purity-tool-architecture",
    "gsc-v3-markdown-tsx-mdx-boundary",
    "gsc-v4-practical-plan",
    "block-model-architecture",
    "frontmatter-is-a-dead-end",
    "md-vs-tsx",
    "mdx-does-not-win",
    "frankenformats-stop-making-your-markdown-do-things",
    "markdown-format-rant",
    "metadata-paradox",
    "architectural-blueprint-single-file-code-as-data-cms",
    "single-file-code-as-data-cms-architecture",
    "blueprint-dynamic-ai-driven-content-engine",
    "content-system-vision",
    "programs-not-documents",
    "pdf-the-frankenformat",
  ],
  "project-idea": [
    "canon-creator-content-tracker",
    "project-launchpad-spec",
    "life-logger",
    "llm-component-designer",
  ],
  "ai-agents": [
    "agent-skills-are-insane",
    "building-and-debugging-a-post-creator-skill",
    "building-the-new-doc-skill",
    "content-creator-skill-plan",
    "claude-skills-and-hosting-html",
    "copilot-sdk-explainer",
    "renaming-new-doc-to-md-artifact",
    "how-i-use-ai",
    "semantic-controls-for-ai",
    "semantic-controls-for-ai-2",
    "ai-workflow-transparency",
    "llm-component-designer",
    "making-my-own-ai-app-builder",
  ],
};

async function main() {
  const rows = await db.execute(
    "SELECT slug, type, project_id, tags FROM content WHERE status != 'deleted'"
  );
  const known = new Set(rows.rows.map((r) => r.slug as string));

  // catch typos in the maps above rather than silently updating nothing
  const referenced = new Set([
    ...THOUGHTS,
    ...Object.values(PROJECT_OF).flat(),
    ...Object.values(TAGS).flat(),
  ]);
  const missing = [...referenced].filter((s) => !known.has(s));
  if (missing.length > 0) {
    throw new Error(`Unknown slugs: ${missing.join(", ")}`);
  }

  const thoughts = new Set(THOUGHTS);
  const projectBySlug = new Map<string, string>();
  for (const [project, slugs] of Object.entries(PROJECT_OF)) {
    for (const slug of slugs) projectBySlug.set(slug, project);
  }
  const tagsBySlug = new Map<string, string[]>();
  for (const [tag, slugs] of Object.entries(TAGS)) {
    for (const slug of slugs) {
      tagsBySlug.set(slug, [...(tagsBySlug.get(slug) ?? []), tag]);
    }
  }

  const now = new Date().toISOString();
  let changed = 0;

  for (const row of rows.rows) {
    const slug = row.slug as string;
    const type = thoughts.has(slug) ? "thought" : (row.type as string);
    const projectId = projectBySlug.get(slug) ?? (row.project_id as string | null);

    // union, so AI-generated tags survive
    const existing: string[] = row.tags ? JSON.parse(row.tags as string) : [];
    const tags = [...new Set([...existing, ...(tagsBySlug.get(slug) ?? [])])];

    const same =
      type === row.type &&
      projectId === (row.project_id ?? null) &&
      JSON.stringify(tags) === JSON.stringify(existing);
    if (same) continue;

    await db.execute({
      sql: "UPDATE content SET type = ?, project_id = ?, tags = ?, updated_at = ? WHERE slug = ?",
      args: [type, projectId, JSON.stringify(tags), now, slug],
    });
    changed++;
  }

  console.log(`updated ${changed} rows`);
}

main();
