"use client";

import * as React from "react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  HomeIcon,
  NewspaperIcon,
  BookOpenIcon,
  LayoutGridIcon,
  ShieldIcon,
  SunIcon,
  MoonIcon,
  PanelLeftIcon,
} from "lucide-react";
import { siteConfig } from "@/site-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import styles from "./sidebar.module.css";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Posts", href: "/posts", icon: NewspaperIcon },
  { label: "Docs", href: "/docs", icon: BookOpenIcon },
  { label: "Examples", href: "/examples", icon: LayoutGridIcon },
  ...(process.env.NODE_ENV === "development"
    ? [{ label: "Admin", href: "/admin", icon: ShieldIcon }]
    : []),
];

export function AppSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";
  const logoSrc = siteConfig.logo.png ?? siteConfig.logo.svg;

  return (
    <Sidebar collapsible="icon">
      {/* Header: logo + site name */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={siteConfig.name} className={styles.navButton}>
              <NextLink href="/">
                {logoSrc ? (
                  <img src={logoSrc} alt={siteConfig.name} className={styles.logoImg} />
                ) : (
                  <span className={styles.logoEmoji}>{siteConfig.logo.emoji}</span>
                )}
                <span className={styles.siteTitle}>{siteConfig.name}</span>
              </NextLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={styles.navMenu}>
              {navItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={pathname === href} tooltip={label} className={styles.navButton}>
                    <NextLink href={href}>
                      <Icon />
                      <span>{label}</span>
                    </NextLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: theme toggle + collapse */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isDark ? "Light mode" : "Dark mode"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={styles.navButton}
            >
              {mounted && (isDark ? <SunIcon /> : <MoonIcon />)}
              <span>Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Toggle sidebar" onClick={toggleSidebar} className={styles.navButton}>
              <PanelLeftIcon />
              <span>Sidebar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Drag-to-resize rail */}
      <SidebarRail />
    </Sidebar>
  );
}
