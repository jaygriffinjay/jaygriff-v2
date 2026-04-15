import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { PoolDashboard } from "./pool-dashboard";
import styles from "./pool.module.css";

export const metadata = {
  title: "Pool — Jay Griffin",
  description: "Saltwater pool maintenance dashboard",
};

export default function PoolPage() {
  return (
    <Container className="max-w-4xl">
      <div className={styles.header}>
        <H1>Pool</H1>
        <Paragraph className={styles.description}>
          Intex Prism Frame 14&apos; &times; 42&quot; &mdash; 3,357 gal saltwater
        </Paragraph>
      </div>
      <Separator className="my-6" />
      <PoolDashboard />
    </Container>
  );
}
