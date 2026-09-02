import { db } from "../turso";

// content.slug -> projects.id. Edit this map, rerun, it converges.
const LINKS: Record<string, string> = {
  // Postmaster
  "building-postmaster": "postmaster",

  // Locus
  "bookmark-launcher-notes": "locus",

  // Life Logger
  "life-logger": "life-logger",

  // Garmin dashboard
  "garmin-sleep-dashboard": "garmin-dashboard",

  // Plasma Cosmos
  "vibecoding-plasma-cosmos-evolution": "plasma-cosmos",

  // Resume
  "building-resume-with-react": "resume",

  // Canon
  "canon-creator-content-tracker": "canon",

  // GSC
  "gsc-generated-semantic-companion": "gsc",
  "gsc-v2-markdown-purity-tool-architecture": "gsc",
  "gsc-v3-markdown-tsx-mdx-boundary": "gsc",
  "gsc-v4-practical-plan": "gsc",

  // Copilot skills
  "agent-skills-are-insane": "copilot-skills",
  "building-and-debugging-a-post-creator-skill": "copilot-skills",
  "building-the-new-doc-skill": "copilot-skills",
  "content-creator-skill-plan": "copilot-skills",
  "renaming-new-doc-to-md-artifact": "copilot-skills",
  "claude-skills-and-hosting-html": "copilot-skills",

  // AI app builder
  "making-my-own-ai-app-builder": "ai-app-builder",

  // Time blocking
  "time-blocking-app-security": "time-blocking",

  // Project launchpad
  "project-launchpad-spec": "project-launchpad",

  // Pool
  "pool-tracker-public-read-private-write-plan": "pool",

  // Blocks
  "block-model-architecture": "blocks",

  // jaygriff.com — the site's own design docs, specs, and build posts
  "admin-ui-passkey-auth-plan": "jaygriff-com",
  "admin-ui-plan": "jaygriff-com",
  "architectural-blueprint-single-file-code-as-data-cms": "jaygriff-com",
  architecture: "jaygriff-com",
  backlog: "jaygriff-com",
  "backlog-this-metadata-editor-workflow": "jaygriff-com",
  "backlog-this-trigger-word-workflow": "jaygriff-com",
  "blueprint-dynamic-ai-driven-content-engine": "jaygriff-com",
  "boilerplate-setup-wizard": "jaygriff-com",
  "bottom-taskbar-search": "jaygriff-com",
  "client-component-page-title-debt": "jaygriff-com",
  "cloudflare-tunnel-deploy-notifications": "jaygriff-com",
  "content-editor": "jaygriff-com",
  "content-layer-docs": "jaygriff-com",
  "content-pipeline-handoff-notes": "jaygriff-com",
  "content-pipeline-technical-deep-dive": "jaygriff-com",
  "content-system-vision": "jaygriff-com",
  "copilot-sdk-explainer": "jaygriff-com",
  "debug-codeblocks": "jaygriff-com",
  "epic-dev-routes": "jaygriff-com",
  "frankenformats-stop-making-your-markdown-do-things": "jaygriff-com",
  "frontmatter-is-a-dead-end": "jaygriff-com",
  "jaygriff-v2-file-tree": "jaygriff-com",
  "live-feed-spec": "jaygriff-com",
  "llm-component-designer": "jaygriff-com",
  "llm-seo-roadmap": "jaygriff-com",
  "markdown-format-rant": "jaygriff-com",
  "markdown-table-test": "jaygriff-com",
  "md-vs-tsx": "jaygriff-com",
  "mdx-does-not-win": "jaygriff-com",
  "metadata-paradox": "jaygriff-com",
  "migrating-to-sqlite": "jaygriff-com",
  "modeling-projects-in-the-database": "jaygriff-com",
  "programs-not-documents": "jaygriff-com",
  "project-scoped-content": "jaygriff-com",
  "projects-architecture": "jaygriff-com",
  "search-feature-spec": "jaygriff-com",
  "sidebar-logo-squish-investigation": "jaygriff-com",
  "single-file-code-as-data-cms-architecture": "jaygriff-com",
  stack: "jaygriff-com",
  "styling-conventions": "jaygriff-com",
  "styling-migration": "jaygriff-com",
  "tailwind-rant-blog": "jaygriff-com",
  "thumbnail-metadata-spec": "jaygriff-com",
  "todo-docs-homepage": "jaygriff-com",
  "todo-hide-header-metadata": "jaygriff-com",
  "todo-system-organization": "jaygriff-com",
  "todo-update-authorship-metadata": "jaygriff-com",
  "why-no-tailwind": "jaygriff-com",
  "why-react-components-rule": "jaygriff-com",
};

async function main() {
  const projects = await db.execute("SELECT id FROM projects");
  const known = new Set(projects.rows.map((r) => String(r.id)));

  const content = await db.execute(
    "SELECT slug FROM content WHERE status != 'deleted'"
  );
  const slugs = new Set(content.rows.map((r) => String(r.slug)));

  const badProject = Object.entries(LINKS).filter(([, id]) => !known.has(id));
  const badSlug = Object.keys(LINKS).filter((s) => !slugs.has(s));

  if (badProject.length > 0 || badSlug.length > 0) {
    for (const [slug, id] of badProject) {
      console.error(`unknown project id "${id}" (from slug "${slug}")`);
    }
    for (const slug of badSlug) console.error(`unknown content slug "${slug}"`);
    console.error("\nNothing written. Fix the map above and rerun.");
    process.exit(1);
  }

  let updated = 0;
  for (const [slug, projectId] of Object.entries(LINKS)) {
    const res = await db.execute({
      sql: "UPDATE content SET project_id = ?, updated_at = ? WHERE slug = ? AND (project_id IS NULL OR project_id != ?)",
      args: [projectId, new Date().toISOString(), slug, projectId],
    });
    if (res.rowsAffected > 0) updated++;
  }

  const unlinked = await db.execute(
    "SELECT slug, type FROM content WHERE status != 'deleted' AND (project_id IS NULL OR project_id = '') ORDER BY type, slug"
  );

  console.log(`linked: ${updated} changed, ${Object.keys(LINKS).length} mapped`);
  console.log(`\nstill unlinked (${unlinked.rows.length}) — standalone essays:`);
  for (const r of unlinked.rows) console.log(`  ${r.type}  ${r.slug}`);
}

main();
