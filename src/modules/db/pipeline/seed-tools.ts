import { db } from "../turso";

/**
 * Bootstrap only. The database is the source of truth now that tools are edited
 * from /admin/tools, so this inserts missing rows and never updates existing
 * ones. Lifted verbatim from the old SECTIONS array in my-stack-client.tsx.
 */

type SeedTool = {
  section: string;
  title: string;
  logo: string;
  description: string;
  note?: string;
  status?: string;
  invert?: boolean;
};

const TOOLS: SeedTool[] = [
  // ── Languages ──
  { section: "languages", title: "TypeScript", logo: "/tool-logos/typescript.svg", description: "All in, full steam ahead", note: "First-class support across modern web tooling, and my interfaces double as AI food and guardrails." },
  { section: "languages", title: "JavaScript", logo: "/tool-logos/javascript.svg", description: "The foundation" },
  { section: "languages", title: "Python", logo: "/tool-logos/python.svg", description: "Love it", note: "Still read, study, and use it — a genuinely great modern tool. I just prefer a TypeScript codebase for web work, though Python sometimes has the library I want." },
  { section: "languages", title: "HTML", logo: "/tool-logos/html.svg", description: "Tim Berners is a real one", note: "Still write it by hand more than you'd think — elements find their way into React components and Markdown pages constantly." },
  { section: "languages", title: "CSS", logo: "/tool-logos/css.svg", description: "Cascading good times" },
  { section: "languages", title: "Shell", logo: "/tool-logos/shell.svg", description: "Programming vegetables", note: "Daily plumbing: installing packages, file operations, git, CLI tools, and every shell script the agents write and run." },
  { section: "languages", title: "Lua", logo: "/tool-logos/lua.svg", description: "Hammerspoon scripting", status: "occasional" },

  // ── Core Dev Tools ──
  { section: "core-dev-tools", title: "React", logo: "/tool-logos/react.svg", description: "Components <3", note: "What I'm writing most of the day." },
  { section: "core-dev-tools", title: "Next.js", logo: "/tool-logos/nextjs.svg", description: "React cloud wizardry", note: "Where the React lives. Almost everything I build starts as a Next.js app." },
  { section: "core-dev-tools", title: "Vite", logo: "/tool-logos/vite.svg", description: "Build tool" },
  { section: "core-dev-tools", title: "Vercel", logo: "/tool-logos/vercel.svg", description: "A very good triangle", note: "Production hosting, automatic deploys from main." },
  { section: "core-dev-tools", title: "Cloudflare", logo: "/tool-logos/cloudflare.svg", description: "A very good cloud", note: "Registrar, DNS management, object storage, and CDN." },
  { section: "core-dev-tools", title: "Git", logo: "/tool-logos/git.svg", description: "Version control" },
  { section: "core-dev-tools", title: "GitHub", logo: "/tool-logos/github.svg", description: "Some cool code on here" },
  { section: "core-dev-tools", title: "GitHub Copilot", logo: "/tool-logos/githubcopilot.svg", description: "How the sausage is made", note: "My AI coding assistant of choice. The tool and the models behind it keep getting more capable, and I reach for the strongest one available." },
  { section: "core-dev-tools", title: "VS Code", logo: "/tool-logos/vscode.svg", description: "My IDE", note: "Where I live." },
  { section: "core-dev-tools", title: "Chrome DevTools", logo: "/tool-logos/chromedevtools.svg", description: "My CSS broke again", note: "Where I fix and optimize my sites — layout bugs, network waterfalls, and everything that only breaks in the browser." },
  { section: "core-dev-tools", title: "jaygriff.com", logo: "/tool-logos/logo.svg", description: "Pretty good imo", note: "Pretty helpful too. Highly recommend." },
  { section: "core-dev-tools", title: "Cline", logo: "/tool-logos/cline.svg", description: "Pretty solid!", status: "occasional" },
  { section: "core-dev-tools", title: "ChatGPT", logo: "/tool-logos/openai.svg", description: "Openai changes it every day", invert: true },
  { section: "core-dev-tools", title: "Claude", logo: "/tool-logos/claude.svg", description: "Thanks Anthropic very cool" },
  { section: "core-dev-tools", title: "Gemini", logo: "/tool-logos/gemini.svg", description: "Pretty good all rounder" },
  { section: "core-dev-tools", title: "Lovable.dev", logo: "/tool-logos/lovable.svg", description: "Rapid prototyping", status: "occasional" },
  { section: "core-dev-tools", title: "Bolt.new", logo: "/tool-logos/bolt.svg", description: "UI generation", status: "occasional" },
  { section: "core-dev-tools", title: "Netlify", logo: "/tool-logos/netlify.svg", description: "Replaced by Vercel", status: "shelved" },
  { section: "core-dev-tools", title: "Django", logo: "/tool-logos/django.svg", description: "Python web framework", status: "shelved" },
  { section: "core-dev-tools", title: "Flask", logo: "/tool-logos/flask.svg", description: "Earlier projects", status: "benched" },
  { section: "core-dev-tools", title: "Express", logo: "/tool-logos/express.svg", description: "Hard", invert: true, status: "benched" },
  { section: "core-dev-tools", title: "WordPress", logo: "/tool-logos/wordpress.svg", description: "My nemesis", status: "shelved" },
  { section: "core-dev-tools", title: "Hugo", logo: "/tool-logos/hugo.svg", description: "Awesome except for the scripting", status: "shelved" },
  { section: "core-dev-tools", title: "Jekyll", logo: "/tool-logos/jekyll.svg", description: "Static site generator", status: "shelved" },

  // ── Data ──
  { section: "data", title: "Turso", logo: "/tool-logos/turso.svg", description: "SQLite on the edge", note: "My primary database." },
  { section: "data", title: "Supabase", logo: "/tool-logos/supabase.svg", description: "Postgres + auth + realtime", note: "Exploring it for projects that need Postgres" },

  // ── Styling & UI ──
  { section: "styling", title: "Tailwind", logo: "/tool-logos/tailwind.svg", description: "UTILITY FIRST!", note: "My styling foundation, paired with CSS Modules for component-scoped styles." },
  { section: "styling", title: "Radix UI", logo: "/tool-logos/radix.svg", description: "Accessible primitives", invert: true },
  { section: "styling", title: "shadcn/ui", logo: "/tool-logos/shadcn.svg", description: "Composable components", note: "Accessible, composable UI out of the box. Tailwind + Radix + shadcn is exactly the clean setup I was looking for." },
  { section: "styling", title: "Emotion", logo: "/tool-logos/emotion.png", description: "Previous site", status: "shelved", note: "CSS-in-JS on the previous version of this site." },
  { section: "styling", title: "Material UI", logo: "/tool-logos/mui.svg", description: "Solid components and docs", status: "shelved" },
  { section: "styling", title: "DaisyUI", logo: "/tool-logos/daisyui.svg", description: "Tailwind-heavy experiments", status: "shelved" },

  // ── Productivity ──
  { section: "productivity", title: "Notion", logo: "/tool-logos/notion.svg", description: "Main hub for writing", note: "Fast for capturing lots of content and syncs across all devices." },
  { section: "productivity", title: "Obsidian", logo: "/tool-logos/obsidian.svg", description: "Admire from afar", status: "occasional", note: "The hotkeys, settings, and aesthetic are amazing. I still don't actively use it." },
  { section: "productivity", title: "Excel", logo: "/tool-logos/excel.svg", description: "Do not cite the deep magic to me, witch", note: "Former accountant, and yet: surprisingly little use for spreadsheets now that Notion and custom tools cover it." },
  { section: "productivity", title: "Google Sheets", logo: "/tool-logos/sheets.svg", description: "Apps Script pretty cool", note: "Current use case: splitting expenses with my roommate." },
  { section: "productivity", title: "Office Suite", logo: "/tool-logos/office365.svg", description: "For work if need be", note: "Used for work when required." },
  { section: "productivity", title: "Locus", logo: "/tool-logos/locus.svg", description: "My Chrome extension", note: "A custom Chrome extension I built for bookmark launching. I use it daily." },

  // ── Photo & Graphics ──
  { section: "photo", title: "Affinity", logo: "/tool-logos/affinity.svg", description: "A dream come true", note: "Go-to for image and vector work — professional-grade tools without the Adobe subscription. Mostly practical stuff: cropping, aligning, background removal, optimisation, fixing aspect ratios." },
  { section: "photo", title: "Canva", logo: "/tool-logos/canva.svg", description: "Use less often now" },
  { section: "photo", title: "Photoshop", logo: "/tool-logos/photoshop.svg", description: "Expensive", status: "shelved" },
  { section: "photo", title: "Photopea", logo: "/tool-logos/photopea.svg", description: "Affinity wins", status: "shelved" },
  { section: "photo", title: "Inkscape", logo: "/tool-logos/inkscape.svg", description: "Replaced by Affinity", status: "shelved" },
  { section: "photo", title: "GIMP", logo: "/tool-logos/gimp.svg", description: "You get what you pay for", status: "shelved" },

  // ── Video ──
  { section: "video", title: "OBS", logo: "/tool-logos/obs.svg", description: "Recording demos", note: "Powerful, free, and handles everything I need: demos of what I'm building, timelapses, progress capture." },
  { section: "video", title: "DaVinci Resolve", logo: "/tool-logos/davinci-resolve.svg", description: "Video editing", note: "For editing when I need more than basic cuts." },

  // ── Design & Color ──
  { section: "design", title: "Figma", logo: "/tool-logos/figma.svg", description: "I am not an artist", status: "shelved", note: "Used it for wireframing. As a solo dev who's a programmer first, it helped less than expected — I'd rather vibecode a rough version and iterate in code. Hard to wireframe automated systems and real interactions." },
  { section: "design", title: "Coolors", logo: "/tool-logos/coolors.svg", description: "Color palettes", note: "Generating and exploring palettes, though I often just ask AI for scheme suggestions." },

  // ── OS Automation ──
  { section: "os-automation", title: "Hammerspoon", logo: "/tool-logos/hammerspoon.svg", description: "MacOS automation", note: "Automates macOS with Lua scripts — custom keyboard shortcuts and window management." },
  { section: "os-automation", title: "AutoHotKey", logo: "/tool-logos/autohotkey.svg", description: "Windows automation", status: "occasional", note: "Text expansion, window control, tool launching. AI now does most of the text work I used it for." },

  // ── Following ──
  { section: "following", title: "Cursor", logo: "/tool-logos/cursor.svg", description: "Very cool", invert: true },
  { section: "following", title: "Claude Code", logo: "/tool-logos/claudecode.svg", description: "Absolutely epic" },
  { section: "following", title: "GitHub Copilot SDK", logo: "/tool-logos/githubcopilotsdk.svg", description: "Sounds great" },
  { section: "following", title: "Claude Cowork", logo: "/tool-logos/claude.svg", description: "For normies" },
  { section: "following", title: "Codex", logo: "/tool-logos/codex.svg?v=2", description: "OpenAI scrambling", status: "wishlist" },
  { section: "following", title: "Exo", logo: "/tool-logos/exo.svg", description: "Cluster devices for distributed AI", status: "wishlist" },

  // ── Want to Use ──
  { section: "want-to-use", title: "LangChain", logo: "/tool-logos/langchain.svg", description: "AI chains", invert: true, status: "wishlist", note: "Looks powerful for building AI applications and agent workflows. Haven't carved out the time." },
  { section: "want-to-use", title: "LangSmith", logo: "/tool-logos/langsmith.svg", description: "Monitoring and debugging chains", invert: true, status: "wishlist" },
  { section: "want-to-use", title: "Terraform", logo: "/tool-logos/terraform.svg", description: "Infrastructure as code", status: "wishlist" },

  // ── Homelab ──
  { section: "homelab", title: "Ollama", logo: "/tool-logos/ollama.svg", description: "Run LLMs locally", invert: true, status: "wishlist" },
  { section: "homelab", title: "Open WebUI", logo: "/tool-logos/openwebui.svg", description: "Self hosted ChatGPT UI", invert: true, status: "wishlist" },
  { section: "homelab", title: "Proxmox", logo: "/tool-logos/proxmox.svg", description: "Homelab virtualization", status: "wishlist" },
  { section: "homelab", title: "Grafana", logo: "/tool-logos/grafana.svg", description: "Monitoring dashboards", status: "wishlist" },
  { section: "homelab", title: "Hetzner", logo: "/tool-logos/hetzner.svg", description: "Cheap VPS", status: "wishlist" },
  { section: "homelab", title: "TrueNAS", logo: "/tool-logos/truenas.svg", description: "ZFS-based NAS solution", status: "wishlist" },
  { section: "homelab", title: "Home Assistant", logo: "/tool-logos/homeassistant.svg", description: "Home automation platform", status: "wishlist" },
  { section: "homelab", title: "Prometheus", logo: "/tool-logos/prometheus.svg", description: "Time-series metrics and alerting", status: "wishlist" },
  { section: "homelab", title: "Unraid", logo: "/tool-logos/unraid.svg", description: "NAS and virtualization OS", status: "wishlist" },
  { section: "homelab", title: "OpenMediaVault", logo: "/tool-logos/openmediavault.svg", description: "Free and open-source NAS OS", status: "wishlist" },
];

/** Stable, readable key so a re-run can't duplicate a tool. */
function toolId(tool: SeedTool) {
  return `${tool.section}--${tool.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

async function main() {
  const now = new Date().toISOString();
  let inserted = 0;

  for (const [index, tool] of TOOLS.entries()) {
    const result = await db.execute({
      sql: `INSERT INTO tools
              (id, section, title, logo, description, note, status, invert, sort_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING`,
      args: [
        toolId(tool),
        tool.section,
        tool.title,
        tool.logo,
        tool.description,
        tool.note ?? null,
        tool.status ?? "active",
        tool.invert ? 1 : 0,
        index,
        now,
        now,
      ],
    });
    if (result.rowsAffected > 0) inserted++;
  }

  console.log(`${inserted} inserted, ${TOOLS.length - inserted} already present`);
}

main();
