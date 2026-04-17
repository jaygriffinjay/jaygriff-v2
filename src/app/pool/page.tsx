import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1 } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { getPoolTests, getPoolTrackers } from "@/app/pool/actions";
import { PoolDashboard } from "./pool-dashboard";
import styles from "./pool.module.css";

export const metadata: Metadata = {
  title: "Pool",
  description: "Saltwater pool maintenance dashboard",
};

export default async function PoolPage() {
  const [tests, trackers] = await Promise.all([getPoolTests(), getPoolTrackers()]);

  return (
    <Container className="max-w-4xl">
      <div className={styles.header}>
        <H1>Pool</H1>
      </div>
      <Separator className="my-6" />
      <PoolDashboard initialTests={tests} initialTrackers={trackers} />
    </Container>
  );
}
