import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { MyStackClient } from "./my-stack-client";

export const metadata: Metadata = {
  title: "My Stack",
  description: "Tools and technologies I use",
};

export default function MyStackPage() {
  return (
    <Container className="max-w-4xl">
      <MyStackClient />
    </Container>
  );
}

