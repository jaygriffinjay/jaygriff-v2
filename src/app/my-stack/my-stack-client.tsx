"use client";

import { cn } from "@/lib/utils";
import { H2 } from "@/components/typography";
import { ToolCard, TOOL_STATUS_META, type ToolStatus } from "./ToolCard";
import styles from "./my-stack.module.css";

interface Tool {
  logo: string;
  title: string;
  description: string;
  // longer "how I actually use it" line, surfaced on hover
  note?: string;
  invert?: boolean;
  status?: ToolStatus;
}

interface Section {
  id: string;
  label: string;
  tools: Tool[];
}

const STATUS_ORDER: Record<ToolStatus, number> = {
  active: 0,
  occasional: 1,
  benched: 2,
  shelved: 3,
  wishlist: 4,
};

function sortByStatus(tools: Tool[]): Tool[] {
  return [...tools].sort(
    (a, b) => STATUS_ORDER[a.status ?? "active"] - STATUS_ORDER[b.status ?? "active"]
  );
}

const SECTIONS: Section[] = [
  {
    id: "languages",
    label: "Languages",
    tools: [
      { logo: "/tool-logos/typescript.svg", title: "TypeScript", description: "All in, full steam ahead", note: "First-class support across modern web tooling, and my interfaces double as AI food and guardrails." },
      { logo: "/tool-logos/javascript.svg", title: "JavaScript", description: "The foundation" },
      { logo: "/tool-logos/python.svg", title: "Python", description: "Love it", note: "Still read, study, and use it — a genuinely great modern tool. I just prefer a TypeScript codebase for web work, though Python sometimes has the library I want." },
      { logo: "/tool-logos/html.svg", title: "HTML", description: "Tim Berners is a real one", note: "Still write it by hand more than you'd think — elements find their way into React components and Markdown pages constantly." },
      { logo: "/tool-logos/css.svg", title: "CSS", description: "Cascading good times" },
      { logo: "/tool-logos/shell.svg", title: "Shell", description: "Programming vegetables", note: "Daily plumbing: installing packages, file operations, git, CLI tools, and every shell script the agents write and run." },
      { logo: "/tool-logos/lua.svg", title: "Lua", description: "Hammerspoon scripting", status: "occasional" },
    ],
  },
  {
    id: "core-dev-tools",
    label: "Core Dev Tools",
    tools: [
      { logo: "/tool-logos/react.svg", title: "React", description: "Components <3", note: "What I'm writing most of the day." },
      { logo: "/tool-logos/nextjs.svg", title: "Next.js", description: "React cloud wizardry", note: "Where the React lives. Almost everything I build starts as a Next.js app." },
      { logo: "/tool-logos/vite.svg", title: "Vite", description: "Build tool" },
      { logo: "/tool-logos/vercel.svg", title: "Vercel", description: "A very good triangle", note: "Production hosting, automatic deploys from main." },
      { logo: "/tool-logos/cloudflare.svg", title: "Cloudflare", description: "A very good cloud", note: "Registrar, DNS management, object storage, and CDN." },
      { logo: "/tool-logos/git.svg", title: "Git", description: "Version control" },
      { logo: "/tool-logos/github.svg", title: "GitHub", description: "Some cool code on here" },
      { logo: "/tool-logos/githubcopilot.svg", title: "GitHub Copilot", description: "How the sausage is made", note: "My AI coding assistant of choice. The tool and the models behind it keep getting more capable, and I reach for the strongest one available." },
      { logo: "/tool-logos/vscode.svg", title: "VS Code", description: "My IDE", note: "Where I live." },
      { logo: "/tool-logos/chromedevtools.svg", title: "Chrome DevTools", description: "My CSS broke again", note: "Where I fix and optimize my sites — layout bugs, network waterfalls, and everything that only breaks in the browser." },
      { logo: "/tool-logos/logo.svg", title: "jaygriff.com", description: "Pretty good imo", note: "Pretty helpful too. Highly recommend." },
      { logo: "/tool-logos/cline.svg", title: "Cline", description: "Pretty solid!", status: "occasional" },
      { logo: "/tool-logos/openai.svg", title: "ChatGPT", description: "Openai changes it every day", invert: true },
      { logo: "/tool-logos/claude.svg", title: "Claude", description: "Thanks Anthropic very cool" },
      { logo: "/tool-logos/gemini.svg", title: "Gemini", description: "Pretty good all rounder" },
      { logo: "/tool-logos/lovable.svg", title: "Lovable.dev", description: "Rapid prototyping", status: "occasional" },
      { logo: "/tool-logos/bolt.svg", title: "Bolt.new", description: "UI generation", status: "occasional" },
      { logo: "/tool-logos/netlify.svg", title: "Netlify", description: "Replaced by Vercel", status: "shelved" },
      { logo: "/tool-logos/django.svg", title: "Django", description: "Python web framework", status: "shelved" },
      { logo: "/tool-logos/flask.svg", title: "Flask", description: "Earlier projects", status: "benched" },
      { logo: "/tool-logos/express.svg", title: "Express", description: "Hard", invert: true, status: "benched" },
      { logo: "/tool-logos/wordpress.svg", title: "WordPress", description: "My nemesis", status: "shelved" },
      { logo: "/tool-logos/hugo.svg", title: "Hugo", description: "Awesome except for the scripting", status: "shelved" },
      { logo: "/tool-logos/jekyll.svg", title: "Jekyll", description: "Static site generator", status: "shelved" },
    ],
  },
  {
    id: "data",
    label: "Data",
    tools: [
      { logo: "/tool-logos/turso.svg", title: "Turso", description: "SQLite on the edge", note: "My primary database." },
      { logo: "/tool-logos/supabase.svg", title: "Supabase", description: "Postgres + auth + realtime", note: "Exploring it for projects that need Postgres" },
    ],
  },
  {
    id: "styling",
    label: "Styling & UI",
    tools: [
      { logo: "/tool-logos/tailwind.svg", title: "Tailwind", description: "UTILITY FIRST!", note: "My styling foundation, paired with CSS Modules for component-scoped styles." },
      { logo: "/tool-logos/radix.svg", title: "Radix UI", description: "Accessible primitives", invert: true },
      { logo: "/tool-logos/shadcn.svg", title: "shadcn/ui", description: "Composable components", note: "Accessible, composable UI out of the box. Tailwind + Radix + shadcn is exactly the clean setup I was looking for." },
      { logo: "/tool-logos/emotion.png", title: "Emotion", description: "Previous site", status: "shelved", note: "CSS-in-JS on the previous version of this site." },
      { logo: "/tool-logos/mui.svg", title: "Material UI", description: "Solid components and docs", status: "shelved" },
      { logo: "/tool-logos/daisyui.svg", title: "DaisyUI", description: "Tailwind-heavy experiments", status: "shelved" },
    ],
  },

  {
    id: "productivity",
    label: "Productivity",
    tools: [
      { logo: "/tool-logos/notion.svg", title: "Notion", description: "Main hub for writing", note: "Fast for capturing lots of content and syncs across all devices." },
      { logo: "/tool-logos/obsidian.svg", title: "Obsidian", description: "Admire from afar", status: "occasional", note: "The hotkeys, settings, and aesthetic are amazing. I still don't actively use it." },
      { logo: "/tool-logos/excel.svg", title: "Excel", description: "Do not cite the deep magic to me, witch", note: "Former accountant, and yet: surprisingly little use for spreadsheets now that Notion and custom tools cover it." },
      { logo: "/tool-logos/sheets.svg", title: "Google Sheets", description: "Apps Script pretty cool", note: "Current use case: splitting expenses with my roommate." },
      { logo: "/tool-logos/office365.svg", title: "Office Suite", description: "For work if need be", note: "Used for work when required." },
      { logo: "/tool-logos/locus.svg", title: "Locus", description: "My Chrome extension", note: "A custom Chrome extension I built for bookmark launching. I use it daily." },
    ],
  },
  {
    id: "photo",
    label: "Photo & Graphics",
    tools: [
      { logo: "/tool-logos/affinity.svg", title: "Affinity", description: "A dream come true", note: "Go-to for image and vector work — professional-grade tools without the Adobe subscription. Mostly practical stuff: cropping, aligning, background removal, optimisation, fixing aspect ratios." },
      { logo: "/tool-logos/canva.svg", title: "Canva", description: "Use less often now" },
      { logo: "/tool-logos/photoshop.svg", title: "Photoshop", description: "Expensive", status: "shelved" },
      { logo: "/tool-logos/photopea.svg", title: "Photopea", description: "Affinity wins", status: "shelved" },
      { logo: "/tool-logos/inkscape.svg", title: "Inkscape", description: "Replaced by Affinity", status: "shelved" },
      { logo: "/tool-logos/gimp.svg", title: "GIMP", description: "You get what you pay for", status: "shelved" },
    ],
  },
  {
    id: "video",
    label: "Video",
    tools: [
      { logo: "/tool-logos/obs.svg", title: "OBS", description: "Recording demos", note: "Powerful, free, and handles everything I need: demos of what I'm building, timelapses, progress capture." },
      { logo: "/tool-logos/davinci-resolve.svg", title: "DaVinci Resolve", description: "Video editing", note: "For editing when I need more than basic cuts." },
    ],
  },
  {
    id: "design",
    label: "Design & Color",
    tools: [
      { logo: "/tool-logos/figma.svg", title: "Figma", description: "I am not an artist", status: "shelved", note: "Used it for wireframing. As a solo dev who's a programmer first, it helped less than expected — I'd rather vibecode a rough version and iterate in code. Hard to wireframe automated systems and real interactions." },
      { logo: "/tool-logos/coolors.svg", title: "Coolors", description: "Color palettes", note: "Generating and exploring palettes, though I often just ask AI for scheme suggestions." },
    ],
  },
  {
    id: "os-automation",
    label: "OS Automation",
    tools: [
      { logo: "/tool-logos/hammerspoon.svg", title: "Hammerspoon", description: "MacOS automation", note: "Automates macOS with Lua scripts — custom keyboard shortcuts and window management." },
      { logo: "/tool-logos/autohotkey.svg", title: "AutoHotKey", description: "Windows automation", status: "occasional", note: "Text expansion, window control, tool launching. AI now does most of the text work I used it for." },
    ],
  },
  {
    id: "following",
    label: "Following",
    tools: [
      { logo: "/tool-logos/cursor.svg", title: "Cursor", description: "Very cool", invert: true },
      { logo: "/tool-logos/claudecode.svg", title: "Claude Code", description: "Absolutely epic" },
      { logo: "/tool-logos/githubcopilotsdk.svg", title: "GitHub Copilot SDK", description: "Sounds great" },
      { logo: "/tool-logos/claude.svg", title: "Claude Cowork", description: "For normies" },
      { logo: "/tool-logos/codex.svg?v=2", title: "Codex", description: "OpenAI scrambling", status: "wishlist" },
      { logo: "/tool-logos/exo.svg", title: "Exo", description: "Cluster devices for distributed AI", status: "wishlist" },
    ],
  },
  {
    id: "want-to-use",
    label: "Want to Use",
    tools: [
      { logo: "/tool-logos/langchain.svg", title: "LangChain", description: "AI chains", invert: true, status: "wishlist", note: "Looks powerful for building AI applications and agent workflows. Haven't carved out the time." },
      { logo: "/tool-logos/langsmith.svg", title: "LangSmith", description: "Monitoring and debugging chains", invert: true, status: "wishlist" },
      { logo: "/tool-logos/terraform.svg", title: "Terraform", description: "Infrastructure as code", status: "wishlist" },
    ],
  },
  {
    id: "homelab",
    label: "Homelab",
    tools: [
      { logo: "/tool-logos/ollama.svg", title: "Ollama", description: "Run LLMs locally", invert: true, status: "wishlist" },
      { logo: "/tool-logos/openwebui.svg", title: "Open WebUI", description: "Self hosted ChatGPT UI", invert: true, status: "wishlist" },
      { logo: "/tool-logos/proxmox.svg", title: "Proxmox", description: "Homelab virtualization", status: "wishlist" },
      { logo: "/tool-logos/grafana.svg", title: "Grafana", description: "Monitoring dashboards", status: "wishlist" },
      { logo: "/tool-logos/hetzner.svg", title: "Hetzner", description: "Cheap VPS", status: "wishlist" },
      { logo: "/tool-logos/truenas.svg", title: "TrueNAS", description: "ZFS-based NAS solution", status: "wishlist" },
      { logo: "/tool-logos/homeassistant.svg", title: "Home Assistant", description: "Home automation platform", status: "wishlist" },
      { logo: "/tool-logos/prometheus.svg", title: "Prometheus", description: "Time-series metrics and alerting", status: "wishlist" },
      { logo: "/tool-logos/unraid.svg", title: "Unraid", description: "NAS and virtualization OS", status: "wishlist" },
      { logo: "/tool-logos/openmediavault.svg", title: "OpenMediaVault", description: "Free and open-source NAS OS", status: "wishlist" },
    ],
  },

];

export function MyStackClient() {
  return (
    <div className={styles.page}>
      <div className={styles.pillGroup}>
        <span className={styles.groupTitle}>Categories</span>
        <nav className={styles.pillGrid}>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={styles.sectionPill}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        id="usage-legend"
        className={cn(styles.pillGroup, styles.legendGroup)}
      >
        <span className={styles.groupTitle}>Usage</span>
        <ul className={styles.legend}>
          {(Object.keys(TOOL_STATUS_META) as ToolStatus[]).map((status) => {
            const { label, hint, markClass, pillClass } =
              TOOL_STATUS_META[status];
            return (
              <li key={status} className={cn(styles.legendItem, pillClass)}>
                <span className={styles.legendLabel}>
                  {label}
                  {markClass && (
                    <span className={cn(styles.statusMark, markClass)}>*</span>
                  )}
                </span>
                <span className={styles.legendHint}>{hint}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {SECTIONS.map((s) => (
        <div key={s.id} id={s.id} className={styles.sectionBody}>
          <H2 className={styles.sectionHeading}>{s.label}</H2>
          <div className={styles.toolGrid}>
            {sortByStatus(s.tools).map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
