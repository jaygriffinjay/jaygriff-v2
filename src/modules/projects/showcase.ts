/**
 * The projects page has two sections. This is the top one: things a stranger
 * can open and actually use. Array order is display order.
 *
 * Deliberately a constant, not a column — nothing queries it, and the split is
 * a display decision rather than a fact about the project.
 *
 * Keyed by id, NOT slug: slugs are editable from /admin/projects, and a rename
 * would silently drop the project out of this list.
 */
export const SHOWCASE = [
  "jaygriff-com",
  "deep-dive",
  "food-math",
  "bythehour",
  "strava-analyzer",
  "locus",
  "engineering-ethics",
] as const;

export function isShowcased(id: string) {
  return (SHOWCASE as readonly string[]).includes(id);
}

/** Orders showcase projects by their position in SHOWCASE. */
export function showcaseRank(id: string) {
  const index = (SHOWCASE as readonly string[]).indexOf(id);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
