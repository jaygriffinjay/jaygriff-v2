/**
 * Section ids and labels for /my-stack. Order here is display order.
 *
 * A display concern, so it stays in code — tools reference a section by id.
 */
export const TOOL_SECTIONS = [
  { id: "languages", label: "Languages" },
  { id: "core-dev-tools", label: "Core Dev Tools" },
  { id: "data", label: "Data" },
  { id: "styling", label: "Styling & UI" },
  { id: "productivity", label: "Productivity" },
  { id: "photo", label: "Photo & Graphics" },
  { id: "video", label: "Video" },
  { id: "design", label: "Design & Color" },
  { id: "os-automation", label: "OS Automation" },
  { id: "following", label: "Following" },
  { id: "want-to-use", label: "Want to Use" },
  { id: "homelab", label: "Homelab" },
] as const;

export type ToolSectionId = (typeof TOOL_SECTIONS)[number]["id"];
