"use client";

import * as React from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import {
  HomeIcon,
  NewspaperIcon,
  BookOpenIcon,
  LayoutGridIcon,
  BlocksIcon,
  ShieldIcon,
  SunIcon,
  MoonIcon,
  PanelLeftIcon,
} from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import styles from "./sidebar.module.css";
import { Logo } from "./logo";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Apps", href: "/apps", icon: LayoutGridIcon },
  { label: "Posts", href: "/posts", icon: NewspaperIcon },
  { label: "Docs", href: "/docs", icon: BookOpenIcon },
  { label: "Blocks", href: "/blocks", icon: BlocksIcon },
  ...(process.env.NODE_ENV === "development"
    ? [{ label: "Admin", href: "/admin", icon: ShieldIcon }]
    : []),
];

export function AppSidebar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();
  const collapsed = state === "collapsed";
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";
  return (
    <Sidebar collapsible="icon">
      {/* Header: logo + site name */}
      <SidebarHeader className={styles.header}>
        {collapsed ? (
          <NextLink href="/" className={styles.logoLink}>
            <Logo className={styles.logoImg} />
          </NextLink>
        ) : (
          <NextLink href="/" className={styles.siteTitle}>
            Jay Griffin
          </NextLink>
        )}
      </SidebarHeader>

      {/* Main nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={styles.navMenu}>
              {navItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild tooltip={label} className={styles.navButton}>
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
    </Sidebar>
  );
}
