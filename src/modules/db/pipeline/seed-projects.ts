import { db } from "../turso";

// id doubles as the human-readable key you put in content.project_id
const PROJECTS = [
  {
    id: "jaygriff-com",
    slug: "jaygriff-com",
    title: "jaygriff.com",
    tagline: "This website — and the content engine behind it.",
    description:
      "The site you're on. A Next.js App Router build with its own content pipeline: markdown and TSX files sync into a Turso database that models posts, docs, and the projects they belong to. Everything here is written, versioned, and deployed by hand.",
    icon: "globe",
    app_href: null,
    repo_url: "https://github.com/jaygriffinjay/jaygriff-v2",
    tags: ["Next.js", "Turso", "Content pipeline", "Design system"],
    sort_order: 0,
  },
  {
    id: "deep-dive",
    slug: "deep-dive",
    title: "Deep Dive",
    tagline: "AI-powered security audit for any public repo.",
    description:
      "Point an LLM at any public GitHub repo and get a vulnerability report. It walks the source file by file and streams findings as the model reads.",
    icon: "shield",
    app_href: "/deep-dive",
    tags: ["AI", "Streaming", "Bring your own key"],
    sort_order: 1,
  },
  {
    id: "food-math",
    slug: "food-math",
    title: "Food Math",
    tagline: "The fastest food portion logger.",
    description:
      "The fastest food portion logger. Type what you ate in plain language, the model parses it into structured nutrition data, you approve or correct it.",
    icon: "utensils",
    app_href: "/food-math",
    tags: ["AI", "Structured output", "Conversational editing"],
    sort_order: 2,
  },
  {
    id: "pool",
    slug: "pool",
    title: "Pool",
    tagline: "Saltwater pool maintenance dashboard.",
    description:
      "A saltwater pool maintenance dashboard with test logging, a dosing calculator, and a reference section — built because test strips and guesswork weren't cutting it.",
    icon: "droplet",
    app_href: "/pool",
    tags: ["Dashboard", "Calculator", "Reference"],
    sort_order: 3,
  },
  {
    id: "cpu-ladder",
    slug: "cpu-ladder",
    title: "CPU Ladder",
    tagline: "Visual Intel vs AMD desktop CPU comparison.",
    description:
      "A visual Intel vs AMD desktop CPU comparison. See equivalents at a glance without digging through benchmark tables.",
    icon: "cpu",
    app_href: "/cpu-ladder",
    tags: ["Data viz", "Comparison"],
    sort_order: 4,
  },
  {
    id: "blocks",
    slug: "blocks",
    title: "Blocks",
    tagline: "The component patterns this site is assembled from.",
    description:
      "Reusable UI blocks and design docs — the component patterns this site is assembled from.",
    icon: "blocks",
    app_href: "/blocks",
    tags: ["Design system", "Components"],
    sort_order: 5,
  },
];

async function main() {
  const now = new Date().toISOString();

  for (const p of PROJECTS) {
    await db.execute({
      sql: `INSERT INTO projects
              (id, slug, title, tagline, description, status, icon, app_href, repo_url, tags, sort_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              slug = excluded.slug,
              title = excluded.title,
              tagline = excluded.tagline,
              description = excluded.description,
              icon = excluded.icon,
              app_href = excluded.app_href,
              repo_url = excluded.repo_url,
              tags = excluded.tags,
              sort_order = excluded.sort_order,
              updated_at = excluded.updated_at`,
      args: [
        p.id,
        p.slug,
        p.title,
        p.tagline,
        p.description,
        p.icon,
        p.app_href,
        p.repo_url ?? null,
        JSON.stringify(p.tags),
        p.sort_order,
        now,
        now,
      ],
    });
    console.log(`seeded: ${p.id}`);
  }

  console.log(`\n${PROJECTS.length} projects seeded.`);
}

main();
