import {
  ActivityIcon,
  BookmarkIcon,
  BoxIcon,
  CalendarIcon,
  CpuIcon,
  CreditCardIcon,
  DropletIcon,
  FileTextIcon,
  GithubIcon,
  GlobeIcon,
  MailIcon,
  PaletteIcon,
  ScaleIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TrendingUpIcon,
  UtensilsCrossedIcon,
  type LucideIcon,
} from "lucide-react";

// projects.icon stores a key, never a component — only keys listed here can render
const PROJECT_ICONS = {
  activity: ActivityIcon,
  bookmark: BookmarkIcon,
  calendar: CalendarIcon,
  cpu: CpuIcon,
  creditCard: CreditCardIcon,
  droplet: DropletIcon,
  fileText: FileTextIcon,
  github: GithubIcon,
  globe: GlobeIcon,
  mail: MailIcon,
  palette: PaletteIcon,
  scale: ScaleIcon,
  shield: ShieldIcon,
  shoppingCart: ShoppingCartIcon,
  sparkles: SparklesIcon,
  trendingUp: TrendingUpIcon,
  utensils: UtensilsCrossedIcon,
} satisfies Record<string, LucideIcon>;

export type ProjectIconKey = keyof typeof PROJECT_ICONS;

export function getProjectIcon(key: string | null): LucideIcon {
  return PROJECT_ICONS[key as ProjectIconKey] ?? BoxIcon;
}
