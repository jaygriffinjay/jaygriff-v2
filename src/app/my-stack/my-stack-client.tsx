"use client";

import { cn } from "@/lib/utils";
import { Paragraph } from "@/components/typography";
import { ToolCard, type ToolStatus } from "./ToolCard";
import styles from "./my-stack.module.css";

interface Tool {
  logo: string;
  title: string;
  description: string;
  invert?: boolean;
  status?: ToolStatus;
}

interface Section {
  id: string;
  label: string;
  description: React.ReactNode;
  tools: Tool[];
}

const STATUS_ORDER: Record<ToolStatus, number> = {
  active: 0,
  occasional: 1,
  benched: 2,
  shelved: 3,
};

function sortByStatus(tools: Tool[]): Tool[] {
  return [...tools].sort(
    (a, b) => STATUS_ORDER[a.status ?? "active"] - STATUS_ORDER[b.status ?? "active"]
  );
}

function usageLabel(status: ToolStatus): string {
  switch (status) {
    case "occasional": return "Occasional";
    case "benched": return "Benched";
    case "shelved": return "Shelved";
    default: return "Active";
  }
}

function toolsForUsage(tools: Tool[], status: ToolStatus): Tool[] {
  if (status === "active") {
    return tools.filter((tool) => (tool.status ?? "active") === "active");
  }
  return tools.filter((tool) => (tool.status ?? "active") === status);
}

const SECTIONS: Section[] = [
  {
    id: "languages",
    label: "Languages",
    description: (
      <Paragraph>
        I&apos;m all-in on TypeScript now. TypeScript gets first-class support
        for most modern web development tools and my interfaces are great AI food
        and guardrails. I love Python but don&apos;t use it  much since I do
        100% TypeScript webdev right now. But Python can be very good for backend processing tasks. I don&apos;t really write HTML directly
        anymore but I do throw the occassional HTML element into my React and
        Markdown pages. Shell I use daily for basic plumbing: installing
        packages, file operations, git operations, CLI tools, and all the shell scripts agents make and use.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/typescript.svg", title: "TypeScript", description: "All in, full steam ahead" },
      { logo: "/tool-logos/javascript.svg", title: "JavaScript", description: "The foundation" },
      { logo: "/tool-logos/python.svg", title: "Python", description: "Love it", },
      { logo: "/tool-logos/html.svg", title: "HTML", description: "Tim Berners is a real one" },
      { logo: "/tool-logos/css.svg", title: "CSS", description: "Cascading good times" },
      { logo: "/tool-logos/shell.svg", title: "Shell", description: "Programming vegetables" },
      { logo: "/tool-logos/lua.svg", title: "Lua", description: "Hammerspoon scripting", status: "occasional" },
    ],
  },
  {
    id: "core-dev-tools",
    label: "Core Dev Tools",
    description: (
      <Paragraph>
        This is my daily toolkit. React and TypeScript are what I&apos;m writing
        most of the day, and I&apos;m usually writing those inside of a Next.js
        app deployed to Vercel. Cloudflare is my registrar, DNS management,
        object storage, and CDN. GitHub Copilot is currently my AI coding
        assistant of choice (Claude Sonnet 4.5 for general work, Claude Opus 4.6
        for tough problems, GPT-4o for natural language editing). VS Code is
        where I live. Chrome DevTools helps me with many aspects of my webapps.
        Jaygriff.com is pretty helpful too, highly recommend.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/react.svg", title: "React", description: "Components <3" },
      { logo: "/tool-logos/nextjs.svg", title: "Next.js", description: "React cloud wizardry" },
      { logo: "/tool-logos/vite.svg", title: "Vite", description: "Build tool" },
      { logo: "/tool-logos/vercel.svg", title: "Vercel", description: "A very good triangle" },
      { logo: "/tool-logos/cloudflare.svg", title: "Cloudflare", description: "A very good cloud" },
      { logo: "/tool-logos/git.svg", title: "Git", description: "Version control" },
      { logo: "/tool-logos/github.svg", title: "GitHub", description: "Some cool code on here" },
      { logo: "/tool-logos/githubcopilot.svg", title: "GitHub Copilot", description: "How the sausage is made" },
      { logo: "/tool-logos/vscode.svg", title: "VS Code", description: "My IDE" },
      { logo: "/tool-logos/chromedevtools.svg", title: "Chrome DevTools", description: "My CSS broke again" },
      { logo: "/tool-logos/logo.svg", title: "jaygriff.com", description: "Pretty good imo" },
      { logo: "/tool-logos/cline.svg", title: "Cline", description: "Pretty solid!", status: "benched" },
      { logo: "/tool-logos/openai.svg", title: "ChatGPT", description: "Openai changes it every day", invert: true },
      { logo: "/tool-logos/claude.svg", title: "Claude", description: "Thanks Anthropic very cool" },
      { logo: "/tool-logos/gemini.svg", title: "Gemini", description: "Pretty good all rounder" },
      { logo: "/tool-logos/lovable.svg", title: "Lovable.dev", description: "Rapid prototyping" },
      { logo: "/tool-logos/bolt.svg", title: "Bolt.new", description: "UI generation" },
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
    description: (
      <Paragraph>
        Turso is my primary database — SQLite on the edge with libSQL.
        Lightweight, fast, and perfect for my apps. Supabase I&apos;m exploring
        for projects that need Postgres, auth, and realtime out of the box.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/turso.svg", title: "Turso", description: "SQLite on the edge" },
      { logo: "/tool-logos/supabase.svg", title: "Supabase", description: "Postgres + auth + realtime" },
    ],
  },
  {
    id: "styling",
    label: "Styling & UI",
    description: (
      <>
        <Paragraph>
          Tailwind CSS v4 is my styling foundation now, paired with CSS Modules
          for component-scoped styles. shadcn/ui (built on Radix primitives) is
          my component library — it gives me accessible, composable UI out of
          the box. The combo of Tailwind + Radix + shadcn is exactly the clean
          setup I was looking for.
        </Paragraph>
        <Paragraph>
          I&apos;ve also experimented with DaisyUI and Material UI in the past,
          and I used Emotion CSS-in-JS on the previous version of this site.
        </Paragraph>
      </>
    ),
    tools: [
      { logo: "/tool-logos/tailwind.svg", title: "Tailwind", description: "UTILITY FIRST!" },
      { logo: "/tool-logos/radix.svg", title: "Radix UI", description: "Accessible primitives", invert: true },
      { logo: "/tool-logos/shadcn.svg", title: "shadcn/ui", description: "Composable components" },
      { logo: "/tool-logos/emotion.png", title: "Emotion", description: "Previous site", status: "shelved" },
      { logo: "/tool-logos/mui.svg", title: "Material UI", description: "Solid components and docs", status: "shelved" },
      { logo: "/tool-logos/daisyui.svg", title: "DaisyUI", description: "Tailwind-heavy experiments", status: "shelved" },
    ],
  },

  {
    id: "productivity",
    label: "Productivity",
    description: (
      <Paragraph>
        Notion is my main hub for writing and notes because it&apos;s fast for
        capturing lots of content and syncs across all devices. I admire Obsidian
        from afar (the hotkeys, settings, and aesthetic are amazing) but I
        don&apos;t actively use it. Surprisingly little use for spreadsheets
        these days given I&apos;m a former accountant—most of my needs are met
        with Notion and custom coded tools. Current use case? Splitting expenses
        with my roommate using Google Sheets. The Microsoft Office Suite I have
        used for work when required. Locus is a custom Chrome extension I built
        for bookmark launching—I use it daily.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/notion.svg", title: "Notion", description: "Main hub for writing" },
      { logo: "/tool-logos/obsidian.svg", title: "Obsidian", description: "Admire from afar" },
      { logo: "/tool-logos/excel.svg", title: "Excel", description: "Do not cite the deep magic to me, witch" },
      { logo: "/tool-logos/sheets.svg", title: "Google Sheets", description: "Apps Script pretty cool" },
      { logo: "/tool-logos/office365.svg", title: "Office Suite", description: "For work if need be" },
      { logo: "/tool-logos/locus.svg", title: "Locus", description: "My Chrome extension" },
    ],
  },
  {
    id: "photo",
    label: "Photo & Graphics",
    description: (
      <Paragraph>
        Affinity is my go-to for image and vector graphic work—professional-grade
        design tools without the Adobe subscription. I also use online SVG tools
        when I need quick edits. I do very little photo editing these days—when I
        do, it&apos;s practical stuff: cropping, aligning, background removal,
        optimization, and fixing aspect ratios and pixel sizes.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/affinity.svg", title: "Affinity", description: "A dream come true" },
      { logo: "/tool-logos/canva.svg", title: "Canva", description: "Use less often now", status: "occasional" },
      { logo: "/tool-logos/photoshop.svg", title: "Photoshop", description: "Expensive", status: "shelved" },
      { logo: "/tool-logos/photopea.svg", title: "Photopea", description: "Affinity wins", status: "shelved" },
      { logo: "/tool-logos/inkscape.svg", title: "Inkscape", description: "Replaced by Affinity", status: "shelved" },
      { logo: "/tool-logos/gimp.svg", title: "GIMP", description: "You get what you pay for", status: "shelved" },
    ],
  },
  {
    id: "video",
    label: "Video",
    description: (
      <Paragraph>
        Recording demos of what I&apos;m programming to display functionality,
        timelapse changes, and progress. OBS is powerful, free, and handles
        everything I need for capturing. DaVinci Resolve for editing when I need
        more than basic cuts.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/obs.svg", title: "OBS", description: "Recording demos" },
      { logo: "/tool-logos/davinci-resolve.svg", title: "DaVinci Resolve", description: "Video editing" },
    ],
  },
  {
    id: "design",
    label: "Design & Color",
    description: (
      <Paragraph>
        I&apos;ve used Figma for visualizing and wireframing sites. As a solo
        dev who&apos;s a programmer first, I found it less helpful than
        expected. I prefer vibecoding a rough version of the feature or page,
        then iterating on the design in code. It&apos;s hard to wireframe
        automated pages and systems and true interactions! Coolors helps me
        generate and explore color palettes, though I often just ask AI for
        color scheme suggestions.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/figma.svg", title: "Figma", description: "I am not an artist" },
      { logo: "/tool-logos/coolors.svg", title: "Coolors", description: "Color palettes" },
    ],
  },
  {
    id: "os-automation",
    label: "OS Automation",
    description: (
      <Paragraph>
        Hammerspoon lets me automate macOS with Lua scripts—creating custom
        keyboard shortcuts and window management. AutoHotKey was for automating
        computer use on Windows: text expansion, window control, tool launching,
        and text manipulation. AI now does all the text expansion and
        manipulation I need.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/hammerspoon.svg", title: "Hammerspoon", description: "MacOS automation" },
      { logo: "/tool-logos/autohotkey.svg", title: "AutoHotKey", description: "Windows automation" },
    ],
  },
  {
    id: "following",
    label: "Following",
    description: (
      <Paragraph>
        These are the tools I&apos;m actively watching in the AI coding space.
        The ones that made me realize AI isn&apos;t just a better search
        engine—it&apos;s an action engine that can do fine-grained work in the
        real world.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/cursor.svg", title: "Cursor", description: "Very cool", invert: true },
      { logo: "/tool-logos/claudecode.svg", title: "Claude Code", description: "Absolutely epic" },
      { logo: "/tool-logos/githubcopilotsdk.svg", title: "GitHub Copilot SDK", description: "Sounds great" },
      { logo: "/tool-logos/claude.svg", title: "Claude Cowork", description: "For normies" },
      { logo: "/tool-logos/codex.svg?v=2", title: "Codex", description: "OpenAI scrambling" },
      { logo: "/tool-logos/exo.svg", title: "Exo", description: "Cluster devices for distributed AI" },
    ],
  },
  {
    id: "want-to-use",
    label: "Want to Use",
    description: (
      <Paragraph>
        I&apos;m excited about these tools but haven&apos;t carved out time to
        properly explore them. LangChain and LangSmith look powerful for
        building AI applications and agent workflows.
      </Paragraph>
    ),
    tools: [
      { logo: "/tool-logos/langchain.svg", title: "LangChain", description: "AI chains", invert: true },
      { logo: "/tool-logos/langsmith.svg", title: "LangSmith", description: "Monitoring and debugging chains", invert: true },
      { logo: "/tool-logos/terraform.svg", title: "Terraform", description: "Infrastructure as code" },
    ],
  },
  {
    id: "homelab",
    label: "Homelab",
    description: (
      <>
        <Paragraph>
          I don&apos;t run much personal infrastructure, but I study it
          extensively. I&apos;ve realized that infra-aware software matters more
          to me than running infrastructure for its own sake. My own apps
          aren&apos;t at the level where they require or benefit from tons of
          personal infra—there are a LOT of ways to achieve things with hosted
          services these days. The main use-cases where homelab makes sense for
          me: GPU compute, performant mass storage, privacy, security, and
          learning.
        </Paragraph>
        <Paragraph>
          My current plan for this site is to start implementing image and gif
          composition support throughout all my articles—I&apos;ll save the files
          locally, then host optimized versions in object storage. So a NAS is
          in my future. Another project I may need personal infra for (if a
          service doesn&apos;t meet the need) is sandboxed YOLO mode for AI
          coding assistants.
        </Paragraph>
      </>
    ),
    tools: [
      { logo: "/tool-logos/ollama.svg", title: "Ollama", description: "Run LLMs locally", invert: true },
      { logo: "/tool-logos/openwebui.svg", title: "Open WebUI", description: "Self hosted ChatGPT UI", invert: true },
      { logo: "/tool-logos/proxmox.svg", title: "Proxmox", description: "Homelab virtualization" },
      { logo: "/tool-logos/grafana.svg", title: "Grafana", description: "Monitoring dashboards" },
      { logo: "/tool-logos/hetzner.svg", title: "Hetzner", description: "Cheap VPS" },
      { logo: "/tool-logos/truenas.svg", title: "TrueNAS", description: "ZFS-based NAS solution" },
      { logo: "/tool-logos/homeassistant.svg", title: "Home Assistant", description: "Home automation platform" },
      { logo: "/tool-logos/prometheus.svg", title: "Prometheus", description: "Time-series metrics and alerting" },
      { logo: "/tool-logos/unraid.svg", title: "Unraid", description: "NAS and virtualization OS" },
      { logo: "/tool-logos/openmediavault.svg", title: "OpenMediaVault", description: "Free and open-source NAS OS" },
    ],
  },

];

export function MyStackClient() {
  return (
    <div className={styles.page}>
      <nav className={styles.pillGrid}>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={styles.sectionPill}
          >
            {s.label}
          </a>
        ))}
      </nav>

      {SECTIONS.map((s) => {
        const sorted = sortByStatus(s.tools);
        const activeTools = toolsForUsage(sorted, "active");
        const otherGroups = (["occasional", "benched", "shelved"] as ToolStatus[])
          .map((status) => ({ status, tools: toolsForUsage(sorted, status) }))
          .filter((group) => group.tools.length > 0);

        return (
          <div key={s.id} id={s.id} className={styles.sectionBody}>
            <h2 className={styles.sectionHeading}>{s.label}</h2>
            <div className={styles.sectionText}>{s.description}</div>
            {activeTools.length > 0 && (
              <div className={styles.toolGrid}>
                {activeTools.map((tool) => (
                  <ToolCard key={`active-${tool.title}`} {...tool} />
                ))}
              </div>
            )}
            {otherGroups.map((group) => (
              <div key={group.status} className={styles.usageGroup}>
                <h3 className={styles.usageHeading}>{usageLabel(group.status)}</h3>
                <div className={styles.usageToolGrid}>
                  {group.tools.map((tool) => (
                    <ToolCard key={`${group.status}-${tool.title}`} {...tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
