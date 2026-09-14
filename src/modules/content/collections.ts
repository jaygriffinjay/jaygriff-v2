import type { ContentRow } from "@/modules/content/queries";

/**
 * Curated groupings for /thoughts and /posts. Tag sets rather than single tags
 * because the pipeline generates tags per-file, so the vocabulary drifts
 * (agents/ai-agents). New collections should still favor one concise tag
 * where possible.
 */
export type Collection = {
  slug: string;
  title: string;
  description?: string;
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

export const POST_COLLECTIONS: Collection[] = [
  {
    slug: "ai",
    title: "AI",
    tags: ["ai"],
  },
  {
    slug: "finance",
    title: "Finance",
    tags: ["finance"],
  },
];

function matches(row: ContentRow, collection: Collection) {
  return (row.tags ?? []).some((t) => collection.tags.includes(t));
}

/** Tag sets can overlap, so a row belongs to the first collection it matches. */
function ownerOf(row: ContentRow, collections: Collection[]) {
  return collections.find((c) => matches(row, c))?.slug ?? null;
}

/** Newest first within a collection. */
export function collectionMembers(
  rows: ContentRow[],
  collection: Collection,
  collections: Collection[]
) {
  return rows
    .filter((row) => ownerOf(row, collections) === collection.slug)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function uncollected(rows: ContentRow[], collections: Collection[]) {
  return rows.filter((row) => ownerOf(row, collections) === null);
}
