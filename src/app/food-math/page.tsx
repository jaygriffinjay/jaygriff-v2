import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { FoodMathApp } from "./food-math-app";
import styles from "./food-math.module.css";

export const metadata: Metadata = {
  title: "Food Math",
  description:
    "The fastest way to log accurate food portions — type what you ate, AI parses it, you approve.",
};

export default function FoodMathPage() {
  return (
    <Container className="max-w-5xl">
      <div className={styles.header}>
        <H1>Food Math</H1>
        <Paragraph className={styles.subtitle}>
          Type what you ate to log your food effortlessly.
        </Paragraph>
      </div>
      <Separator className="my-6" />
      <FoodMathApp />
    </Container>
  );
}
