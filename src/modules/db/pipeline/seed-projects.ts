import { db } from "../turso";

// projects that were seeded before but are now just content
const RETIRED = ["blocks"];

type SeedProject = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  app_href: string | null;
  tags: string[];
  sort_order: number;
  status?: string;
  repo_url?: string | null;
};

// id doubles as the human-readable key you put in content.project_id
const PROJECTS: SeedProject[] = [
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
    status: "published",
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
    status: "published",
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
    tags: ["AI", "Structured output", "logging"],
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
    status: "published",
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
    tags: ["Data viz", "Comparison", "small-tool"],
    sort_order: 10,
  },
  {
    id: "postmaster",
    slug: "postmaster",
    title: "Postmaster",
    tagline: "A local markdown draft editor.",
    description:
      "A desktop app for drafting markdown posts before they enter the content pipeline — write, preview, and hand off without touching the live database. Built for my own use; not distributed.",
    icon: "mail",
    app_href: null,
    tags: ["Markdown", "Editor", "Local-first", "personal"],
    sort_order: 5,
  },
  {
    id: "locus",
    slug: "locus",
    title: "Locus",
    tagline: "A Chrome extension for launching bookmarks.",
    description:
      "A custom Chrome extension for bookmark launching, with multi-tab groups and local file support. Used daily.",
    icon: "bookmark",
    app_href: null,
    tags: ["Chrome extension", "Productivity", "personal"],
    sort_order: 6,
  },
  {
    id: "garmin-dashboard",
    slug: "garmin-dashboard",
    title: "Garmin Health Dashboard",
    tagline: "Sleep and fitness data from Garmin, visualized.",
    description:
      "A health data dashboard built on exported Garmin data — sleep, activity, and trends over time.",
    icon: "activity",
    app_href: null,
    tags: ["Data viz", "Health", "logging", "personal", "wip"],
    sort_order: 8,
  },
  {
    id: "plasma-cosmos",
    slug: "plasma-cosmos",
    title: "Plasma Cosmos",
    tagline: "A one-prompt generative toy that grew into a real app.",
    description:
      "Generative visual art that started as a single prompt and evolved into a full application through iterative vibecoding.",
    icon: "sparkles",
    app_href: null,
    tags: ["Generative art", "Canvas", "Vibecoding"],
    sort_order: 4,
  },
  {
    id: "bythehour",
    slug: "bythehour",
    title: "bythehour",
    tagline: "Calendar-driven time blocking.",
    description:
      "A time-blocking scheduler — a usable demo rather than a production paid product. The prompt-injection security work came out of letting a model read the calendar.",
    icon: "calendar",
    app_href: null,
    tags: ["Scheduling", "AI security"],
    sort_order: 7,
  },
  {
    id: "strava-analyzer",
    slug: "strava-analyzer",
    title: "Strava Analyzer",
    tagline: "Analysis over Strava activity data.",
    description:
      "A published tool for analyzing Strava activity data.",
    icon: "trendingUp",
    app_href: null,
    tags: ["Data viz", "logging"],
    sort_order: 9,
  },
  {
    id: "resume",
    slug: "resume",
    title: "Resume",
    tagline: "My resume, built as a React component.",
    description:
      "A resume authored in React and CSS rather than a document editor — the page renders as a sheet of paper, versioned alongside the rest of the site.",
    icon: "fileText",
    app_href: "/resume",
    tags: ["React", "CSS", "small-tool"],
    sort_order: 11,
  },
  {
    id: "golf-ball-garage",
    slug: "golf-ball-garage",
    title: "Golf Ball Garage",
    tagline: "A from-scratch storefront, and a real education in Stripe.",
    description:
      "An ecommerce site built from scratch to learn the Stripe API end to end, including dynamic order construction. The domain golfballgarage.com is live; the site itself is still incomplete.",
    icon: "shoppingCart",
    // deliberately unlinked: the domain resolves to a non-working site
    app_href: null,
    tags: ["Stripe", "Ecommerce", "wip"],
    sort_order: 12,
  },
  {
    id: "skim-milk-hybrid",
    slug: "skim-milk-hybrid",
    title: "Skim Milk Hybrid",
    tagline: "Four design directions for a family business.",
    description:
      "Four complete website designs built for a family member's business. The work was finished but never launched.",
    icon: "palette",
    app_href: null,
    tags: ["Web design", "client-work"],
    sort_order: 13,
  },
  {
    id: "engineering-ethics",
    slug: "engineering-ethics",
    title: "Engineering Ethics Case Studies",
    tagline: "A free teaching resource on engineering ethics.",
    description:
      "An educational collection of real-world engineering ethics case studies for students, teachers, engineers, and curious readers. Each case introduces an event or ethical problem in accessible language, with reliable sources for further reading, framed around how engineering decisions affect public safety, professional responsibility, the environment, privacy, and fairness. Many cases draw on Martin Peterson's textbook Ethics for Engineers, supported by the Texas A&M Bovay Fund. Site content by Renée Holman; web development by me.",
    icon: "scale",
    app_href: "https://www.engineeringethicscasestudies.com/",
    tags: ["Education", "client-work"],
    sort_order: 14,
  },
  {
    id: "github-readme",
    slug: "github-readme",
    title: "GitHub README",
    tagline: "How far a GitHub profile README can actually be pushed.",
    description:
      "GitHub sanitizes HTML and strips JavaScript from READMEs, which leaves animated SVG and SMIL as one of the only moving parts you can still get away with. This started as a question about what survives that sandbox and turned into a pile of hand-built SVG and motion work.",
    icon: "github",
    app_href: "https://github.com/jaygriffinjay",
    tags: ["SVG", "SMIL", "experiment"],
    sort_order: 15,
  },
  {
    id: "statement-manager",
    slug: "statement-manager",
    title: "Statement Manager",
    tagline: "A desktop app for wrangling credit card statements.",
    description:
      "A personal Electron app for collecting and sorting credit card statements. My first time building on Electron, so a good part of the work was learning how a desktop shell differs from the web apps I'd been writing.",
    icon: "creditCard",
    app_href: null,
    tags: ["personal", "electron", "desktop"],
    sort_order: 16,
  },
];

async function main() {
  const now = new Date().toISOString();

  for (const p of PROJECTS) {
    await db.execute({
      sql: `INSERT INTO projects
              (id, slug, title, tagline, description, status, icon, app_href, repo_url, tags, sort_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              slug = excluded.slug,
              title = excluded.title,
              tagline = excluded.tagline,
              description = excluded.description,
              status = excluded.status,
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
        "status" in p ? (p.status ?? "published") : "published",
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

  // Demoted to plain content — the row would otherwise linger, since upserts never delete
  for (const id of RETIRED) {
    await db.execute({
      sql: "UPDATE content SET project_id = NULL WHERE project_id = ?",
      args: [id],
    });
    const res = await db.execute({
      sql: "DELETE FROM projects WHERE id = ?",
      args: [id],
    });
    if (res.rowsAffected > 0) console.log(`retired: ${id}`);
  }

  console.log(`\n${PROJECTS.length} projects seeded.`);
}

main();
