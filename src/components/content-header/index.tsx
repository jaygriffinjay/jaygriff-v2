import "server-only";

import { getProjectById } from "@/modules/projects/queries";
import type { ContentRow } from "@/modules/content/queries";
import { ContentHeaderClient } from "./content-header-client";

/**
 * Server wrapper: resolves the optional project link so the client piece
 * stays presentational. Passing through the page's `row` also means the four
 * detail pages don't change at all.
 */
export async function ContentHeader({ row }: { row: ContentRow }) {
  const project = row.project_id
    ? await getProjectById(row.project_id)
    : null;

  // Only link published projects so we never render a link that 404s.
  const ref =
    project && project.status === "published"
      ? { title: project.title, slug: project.slug }
      : null;

  return <ContentHeaderClient row={row} project={ref} />;
}