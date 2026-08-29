import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Jay Griffin",
    template: "%s | Jay Griffin",
  },

  description: "Full-stack developer building modern web applications with React, Next.js, and TypeScript.",
  authors: [{ name: "Jay Griffin" }],

  openGraph: {
    type: "website",
    siteName: "Jay Griffin",
    title: "Jay Griffin",
    description: "Full-stack developer building modern web applications with React, Next.js, and TypeScript.",
    url: siteUrl,
    images: [{ url: "/og", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jay Griffin",
    description: "Full-stack developer building modern web applications with React, Next.js, and TypeScript.",
    images: ["/og"],
  },

  icons: {
    icon: "/logo.svg",
    apple: "/logo.png",
  },

  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <MobileHeader />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
