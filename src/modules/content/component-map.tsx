import type { ElementType } from "react";

import { CodeBlock } from "@/components/code-block";
import {
  Blockquote,
  Bold,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Highlight,
  InlineCode,
  Italic,
  Link,
  List,
  ListItem,
  Paragraph,
  Small,
  Strikethrough,
  Text,
  Underline,
} from "@/components/typography";

import type { ContentComponentName } from "./whitelist";

/**
 * Resolves a whitelisted component name to the real component.
 *
 * The Record key type makes this exhaustive: adding a name to
 * CONTENT_COMPONENT_NAMES without adding it here is a compile error.
 */
export const CONTENT_COMPONENTS: Record<ContentComponentName, ElementType> = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlight,
  InlineCode,
  Small,
  Paragraph,
  Text,
  Blockquote,
  List,
  ListItem,
  Link,
  CodeBlock,
};
