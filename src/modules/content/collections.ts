import type { ContentRow } from "@/modules/content/queries";

/**
 * Curated groupings for /thoughts. Tag sets rather than single tags because the
 * pipeline generates tags per-file, so the vocabulary drifts (agents/ai-agents).
 */
export type Collection = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const THOUGHT_COLLECTIONS: Collection[] = [
  {
    slug: "modeling-content",
    title: "Modeling content data",
    description:
      "The long argument with myself about how to model content for the web — markdown, frontmatter, MDX, TSX, and what a CMS should actually be. Oldest first; I changed my mind more than once.",
    tags: [
      "data-modeling",
      "architecture",
      "database",
      "sqlite",
      "markdown",
      "content-system",
      "mdx",
      "content",
      "frontmatter",
      "cms",
      "content-pipeline",
    ],
  },
  {
    slug: "ai-and-agents",
    title: "AI & agents",
    description:
      "Working with models and agents daily — skills, instructions, MCP, and where the leverage actually is.",
    tags: [
      "ai",
      "ai-agents",
      "agents",
      "llm",
      "mcp",
      "skills",
      "claude",
      "cline",
      "prompt-engineering",
    ],
  },
  {
    slug: "styling",
    title: "Styling & frontend",
    description:
      "CSS, Tailwind, and the styling conventions this site keeps rewriting itself around.",
    tags: ["css", "tailwind", "emotion", "css-in-js", "styling", "design-system"],
  },
];

function matches(row: ContentRow, collection: Collection) {
  return (row.tags ?? []).some((t) => collection.tags.includes(t));
}

/** Oldest first — a collection is a trajectory, and recency-first spoils it. */
export function collectionMembers(rows: ContentRow[], collection: Collection) {
  return rows
    .filter((row) => matches(row, collection))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function uncollected(rows: ContentRow[]) {
  return rows.filter(
    (row) => !THOUGHT_COLLECTIONS.some((c) => matches(row, c))
  );
}
