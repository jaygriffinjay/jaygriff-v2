import type { Metadata } from "next";
import NextLink from "next/link";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DropletIcon, ShieldIcon } from "lucide-react";
import styles from "./apps.module.css";

const apps = [
  {
    label: "Pool",
    href: "/pool",
    description: "Saltwater pool maintenance dashboard — test logging, dosing calculator, and reference.",
    icon: DropletIcon,
  },
  {
    label: "Deep Dive",
    href: "/deep-dive",
    description: "AI-powered security audit — point an LLM at any public GitHub repo and get a vulnerability report.",
    icon: ShieldIcon,
  },
];

export const metadata: Metadata = {
  title: "Apps",
  description: "Personal tools and apps built by Jay Griffin.",
};

export default function AppsPage() {
  return (
    <Container className="max-w-4xl">
      <div className={styles.header}>
        <H1>Apps</H1>
        <Paragraph className={styles.description}>
          Stuff I made
        </Paragraph>
      </div>
      <Separator className="my-6" />
      <div className={styles.grid}>
        {apps.map(({ label, href, description, icon: Icon }) => (
          <NextLink key={href} href={href}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="size-5" />
                  {label}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </NextLink>
        ))}
      </div>
    </Container>
  );
}
