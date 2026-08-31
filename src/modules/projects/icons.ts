import {
  BlocksIcon,
  BoxIcon,
  CpuIcon,
  DropletIcon,
  GlobeIcon,
  ShieldIcon,
  UtensilsCrossedIcon,
  type LucideIcon,
} from "lucide-react";

// projects.icon stores a key, never a component — only keys listed here can render
const PROJECT_ICONS = {
  blocks: BlocksIcon,
  cpu: CpuIcon,
  droplet: DropletIcon,
  globe: GlobeIcon,
  shield: ShieldIcon,
  utensils: UtensilsCrossedIcon,
} satisfies Record<string, LucideIcon>;

export type ProjectIconKey = keyof typeof PROJECT_ICONS;

export function getProjectIcon(key: string | null): LucideIcon {
  return PROJECT_ICONS[key as ProjectIconKey] ?? BoxIcon;
}
