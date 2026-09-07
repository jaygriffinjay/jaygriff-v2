export type Stage = "live" | "benched" | "shelved";

export type LabProject = {
  slug: string;
  title: string;
  tagline: string;
  learned: string;
  stage: Stage;
  tags: string[];
  hue: number;
  // where it actually lives; null means there is nothing to click
  url: string | null;
};

// Dummy set: shaped like the real table, but titles/taglines are throwaway
// so layout decisions aren't biased by the current copy.
export const LAB_PROJECTS: LabProject[] = [
  {
    slug: "deep-dive",
    title: "Deep Dive",
    tagline: "AI-powered security audit for any public repo.",
    learned: "Streaming LLM output without losing the plot.",
    stage: "live",
    tags: ["AI", "Streaming"],
    hue: 210,
    url: "https://jaygriff.com/deep-dive",
  },
  {
    slug: "food-math",
    title: "Food Math",
    tagline: "The fastest food portion logger.",
    learned: "Structured output beats freeform parsing.",
    stage: "live",
    tags: ["AI", "logging"],
    hue: 25,
    url: "https://jaygriff.com/food-math",
  },
  {
    slug: "pool",
    title: "Pool",
    tagline: "Saltwater pool maintenance dashboard. My readings, public to browse.",
    learned: "Domain math is the hard part, not the UI.",
    stage: "live",
    tags: ["Dashboard"],
    hue: 190,
    url: "https://jaygriff.com/pool",
  },
  {
    slug: "locus",
    title: "Locus",
    tagline: "A Chrome extension for launching bookmarks.",
    learned: "Extension permissions are a UX problem.",
    stage: "live",
    tags: ["Chrome extension"],
    hue: 275,
    url: "https://chromewebstore.google.com/detail/locus/mamfkhoggkjbacfkibdbcfmoonjbecmp",
  },
  {
    slug: "cpu-ladder",
    title: "CPU Ladder",
    tagline: "Visual Intel vs AMD desktop CPU comparison.",
    learned: "A good axis beats a big table.",
    stage: "live",
    tags: ["Data viz"],
    hue: 145,
    url: "https://jaygriff.com/cpu-ladder",
  },
  {

    slug: "engineering-ethics",
    title: "Engineering Ethics",
    tagline: "A free teaching resource on engineering ethics.",
    learned: "Client work means someone else owns the copy.",
    stage: "live",
    tags: ["client-work"],
    hue: 45,
    url: "https://www.engineeringethicscasestudies.com/",
  },
  {
    slug: "strava-analyzer",
    title: "Strava Analyzer",
    tagline: "Analysis over Strava activity data.",
    learned: "Third-party rate limits shape the whole design.",
    stage: "live",
    tags: ["Data viz", "logging"],
    hue: 60,
    url: "https://strava-data-analyzer.vercel.app/",
  },
  {
    slug: "bythehour",
    title: "bythehour",
    tagline: "Calendar-driven time blocking.",
    learned: "Letting a model read the calendar is a security problem.",
    stage: "live",
    tags: ["Scheduling", "AI security"],
    hue: 240,
    url: "https://bythehour.lovable.app/",
  },
  {
    slug: "postmaster",
    title: "Postmaster",
    tagline: "A local markdown draft editor.",
    learned: "Local-first removes a whole class of bugs.",
    stage: "benched",
    tags: ["Editor", "personal"],
    hue: 300,
    url: null,
  },
  {
    slug: "garmin-dashboard",
    title: "Garmin Dashboard",
    tagline: "Sleep and fitness data from Garmin, visualized.",
    learned: "Exported data is never the shape you want.",
    stage: "benched",
    tags: ["Health", "personal"],
    hue: 165,
    url: null,
  },
  {
    slug: "statement-manager",
    title: "Statement Manager",
    tagline: "A desktop app for wrangling credit card statements.",
    learned: "A desktop shell is not a browser.",
    stage: "benched",
    tags: ["electron", "personal"],
    hue: 95,
    url: null,
  },
  {
    slug: "golf-ball-garage",
    title: "Golf Ball Garage",
    tagline: "A from-scratch storefront, and a real education in Stripe.",
    learned: "Stripe end to end, including dynamic order construction.",
    stage: "shelved",
    tags: ["Stripe", "Ecommerce"],
    hue: 120,
    // reachable, but not a working product — the awkward middle case
    url: "https://golfballgarage.com",
  },
  {
    slug: "skim-milk-hybrid",
    title: "Skim Milk Hybrid",
    tagline: "Four design directions for a family business.",
    learned: "A design is worthless without a finished brief.",
    stage: "shelved",
    tags: ["Web design", "client-work"],
    hue: 15,
    url: null,
  },
];

export const STAGE_LABEL: Record<Stage, string> = {
  live: "Live",
  benched: "Benched",
  shelved: "Shelved",
};

export function byStage(stage: Stage) {
  return LAB_PROJECTS.filter((p) => p.stage === stage);
}

// Kept as a slug list rather than a per-project field so reassigning is a
// one-line edit while the split is still being argued about.
const APP_SLUGS = new Set([
  "deep-dive",
  "food-math",
  "bythehour",
  "strava-analyzer",
  "locus",
  "engineering-ethics",
]);

export type Group = "app" | "experiment";

export function byGroup(group: Group) {
  return LAB_PROJECTS.filter(
    (p) => (APP_SLUGS.has(p.slug) ? "app" : "experiment") === group
  );
}

export type LinkKind = "internal" | "brand" | "domain";

/**
 * Known hosts get their product name; everything else falls back to the bare
 * domain. Full URLs are useless as labels once a path gets long.
 */
export function describeLink(url: string): { label: string; kind: LinkKind } {
  const { hostname, pathname } = new URL(url);
  const host = hostname.replace(/^www\./, "");

  if (host.endsWith("jaygriff.com")) {
    return { label: pathname, kind: "internal" };
  }

  const BRANDS: Record<string, string> = {
    "chromewebstore.google.com": "Chrome Web Store",
    "github.com": "GitHub",
  };
  if (BRANDS[host]) return { label: BRANDS[host], kind: "brand" };

  return { label: host, kind: "domain" };
}
