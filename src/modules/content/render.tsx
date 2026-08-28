import type { ComponentType, ReactNode } from "react";

import MarkdownRenderer from "@/components/markdown-renderer/MarkdownRenderer";

import { readMarkdownFile, type ContentRow } from "./queries";

/**
 * Renders a content row's body in whichever format it was authored in.
 *
 * The tsx branch dynamically imports the file so Next can bundle it; the
 * literal "../../../content/tsx/" prefix is what makes that statically
 * analysable, so it must stay inline rather than move to a constant.
 */
export async function ContentBody({
  row,
}: {
  row: ContentRow;
}): Promise<ReactNode> {
  if (!row.file_path) return null;

  if (row.format === "tsx") {
    const rel = row.file_path
      .replace(/^content\/tsx\//, "")
      .replace(/\.tsx$/, "");
    const mod = await import(`../../../content/tsx/${rel}.tsx`);
    const Component = mod.default as ComponentType;
    return <Component />;
  }

  return <MarkdownRenderer content={readMarkdownFile(row.file_path)} />;
}
