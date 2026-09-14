/**
 * The resume content, shared by the web page and the generated PDF. Layout
 * differs between screen and paper; the words must not.
 */

export const NAME = "Jay Griffin";

export const SITE_URL = "https://jaygriff.com";

export const CONTACT = [
  { label: "jaygriff.com", href: "https://jaygriff.com" },
  { label: "jay@jaygriff.com", href: "mailto:jay@jaygriff.com" },
  { label: "github.com/jaygriffinjay", href: "https://github.com/jaygriffinjay" },
  {
    label: "linkedin.com/in/jaygriffinjay",
    href: "https://linkedin.com/in/jaygriffinjay",
  },
];

export const PROJECTS = [
  {
    name: "jaygriff.com",
    slug: "jaygriff",
    tagline: "Personal Platform",
    bullets: [
      "Full-stack content and development platform powering posts, docs, and webapps in one repo",
      "Built custom component system, dev tools, admin interface, and content pipeline for rapid iteration",
    ],
  },
  {
    name: "Deep Dive",
    slug: "deep-dive",
    tagline: "AI Security Auditor",
    bullets: [
      "Streams an LLM-generated vulnerability report as it reads a public GitHub repo file by file",
      "Lets users choose exactly which files to scan, rather than auditing an entire repo indiscriminately",
    ],
  },
  {
    name: "Food Math",
    slug: "food-math",
    tagline: "AI Nutrition Logger",
    bullets: [
      "Parses plain-language food descriptions into structured nutrition data using LLM structured outputs",
      "Human-in-the-loop approval flow keeps logging fast without sacrificing accuracy",
    ],
  },
  {
    name: "Strava Analyzer",
    slug: "strava-analyzer",
    tagline: "Fitness Data Analytics",
    bullets: [
      "Connects to the Strava API, analyzes user activity and stream data, and presents visualizations",
      "Runs entirely client-side to protect privacy, and uses caching to reduce API calls",
    ],
  },
  {
    name: "Locus",
    slug: "locus",
    tagline: "Chrome Extension",
    bullets: [
      "Fast bookmark launcher with fuzzy search and keyboard navigation for large bookmark libraries",
      "Uses hotkeys to launch apps in the browser like Spotlight Search",
    ],
  },
];

export const SKILLS = [
  {
    label: "Languages",
    items: "TypeScript, JavaScript, Python, SQL, Shell, HTML, CSS",
  },
  { label: "Frameworks", items: "Next.js, React" },
  { label: "APIs", items: "OpenAI, Claude, Stripe, Strava" },
  { label: "Styling", items: "Tailwind CSS, CSS Modules, Radix UI, shadcn/ui" },
  { label: "Visualization", items: "Recharts, Vanilla JS, SVG, CSS animations" },
  { label: "Data", items: "Turso (SQLite), Supabase (Postgres), Zod (validation)" },
  { label: "Deployment", items: "Vercel, Cloudflare" },
  { label: "Tooling", items: "Vite, Git, VS Code, Chrome DevTools" },
];

export const EXPERIENCE = [
  {
    role: "Crew Leader & Driver",
    org: "Little Guys Movers",
    dates: "Jun 2025 – Present",
    bullets: [
      "Leading moves with up to three 26ft box trucks and six crew members",
      "Mentioned by name in multiple five-star customer reviews on Google Reviews",
    ],
  },
  {
    role: "Tax Staff Accountant",
    org: "Holthouse Carlin & Van Trigt, LLP",
    dates: "Jul 2023 – Jan 2024",
    bullets: [
      "Supported all stages of a multi-deadline engagement for a new HNW client with 12+ returns",
      "Staffed three teams preparing workpapers and returns for HNW and SMB clients",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "Master of Professional Accounting",
    school: "The University of Texas at Arlington",
    dates: "Sep 2019 – May 2021",
  },
  {
    degree: "Bachelor of Science in Agricultural Economics",
    school: "Texas A&M University",
    dates: "Sep 2016 – May 2019",
    honor: "Cum Laude",
  },
];
