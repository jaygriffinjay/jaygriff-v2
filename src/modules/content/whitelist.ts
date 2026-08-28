/**
 * The set of components a content file may render.
 *
 * Names only — no React imports — so the sync script can import this from plain
 * Node without pulling in CSS modules. The name-to-component map lives in
 * component-map.tsx and is keyed off this list, so the two cannot drift.
 */
export const CONTENT_COMPONENT_NAMES = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "Bold",
  "Italic",
  "Underline",
  "Strikethrough",
  "Highlight",
  "InlineCode",
  "Small",
  "Paragraph",
  "Text",
  "Blockquote",
  "List",
  "ListItem",
  "Link",
  "CodeBlock",
] as const;

export type ContentComponentName = (typeof CONTENT_COMPONENT_NAMES)[number];

/** Modules a content file may import from. */
export const CONTENT_ALLOWED_MODULES = [
  "@/components/typography",
  "@/components/code-block",
] as const;
