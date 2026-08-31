"use client";

import * as React from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import {
  HomeIcon,
  NewspaperIcon,
  BookOpenIcon,
  LayoutGridIcon,
  ShieldIcon,
  MailIcon,
  HelpCircleIcon,
  SunIcon,
  MoonIcon,
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

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Projects", href: "/projects", icon: LayoutGridIcon },
  { label: "Posts", href: "/posts", icon: NewspaperIcon },
  { label: "Docs", href: "/docs", icon: BookOpenIcon },
  { label: "About", href: "/about", icon: HelpCircleIcon },
  { label: "Contact", href: "/contact", icon: MailIcon },
  ...(process.env.NODE_ENV === "development"
    ? [{ label: "Admin", href: "/admin", icon: ShieldIcon }]
    : []),
];

export function AppSidebar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { isMobile, setOpenMobile } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  // the drawer overlays the page on mobile, so it has to get out of the way after navigating
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className={styles.header}>
        <NextLink href="/" className={styles.siteTitle} onClick={closeOnMobile}>
          Jay Griffin
        </NextLink>
      </SidebarHeader>

      {/* Main nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={styles.navMenu}>
              {navItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild className={styles.navButton}>
                    <NextLink href={href} onClick={closeOnMobile}>
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={styles.navButton}
            >
              {mounted && (isDark ? <SunIcon /> : <MoonIcon />)}
              <span>Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
