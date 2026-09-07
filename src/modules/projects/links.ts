import type { ProjectRow } from "./queries";

export type LinkKind = "internal" | "brand" | "domain";

/** First destination a visitor would actually want, in order of preference. */
export function projectUrl(project: ProjectRow): string | null {
  return project.app_href ?? project.demo_url ?? project.repo_url ?? null;
}

// Only genuine distribution channels get a name. A host that just means
// "it's deployed somewhere" is less informative than its own subdomain.
const BRANDS: Record<string, string> = {
  "chromewebstore.google.com": "Chrome Web Store",
  "github.com": "GitHub",
};

/**
 * Turns a URL into a short label. Full URLs make poor labels once a path gets
 * long, so external links show the bare domain instead.
 */
export function describeLink(url: string): { label: string; kind: LinkKind } {
  // internal routes are stored as paths, which URL() cannot parse alone
  if (url.startsWith("/")) return { label: url, kind: "internal" };

  const { hostname, pathname } = new URL(url);
  const host = hostname.replace(/^www\./, "");

  if (host.endsWith("jaygriff.com")) return { label: pathname, kind: "internal" };
  if (BRANDS[host]) return { label: BRANDS[host], kind: "brand" };

  return { label: host, kind: "domain" };
}
