import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { getDesktopCpus } from "./data";
import { CpuLadder } from "./cpu-ladder";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "CPU Ladder",
  description:
    "Visual Intel vs AMD desktop CPU comparison. See which CPUs are equivalent at a glance.",
};

export default function CpuLadderPage() {
  const cpus = getDesktopCpus();

  return (
    <Container className="max-w-4xl">
      <div className={styles.header}>
        <H1>CPU Ladder</H1>
        <Paragraph className="text-lg text-muted-foreground">
          Intel vs AMD desktop CPUs ranked side by side. Click any CPU to see
          its equivalent on the other side.
        </Paragraph>
      </div>
      <Separator className="my-6" />
      <CpuLadder cpus={cpus} />
    </Container>
  );
}
