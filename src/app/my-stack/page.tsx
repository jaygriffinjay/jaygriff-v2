import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { getAllTools } from "@/modules/tools/queries";
import { StackList } from "./stack-list";

export const metadata: Metadata = {
  title: "My Stack",
  description: "Tools and technologies I use",
};

export default async function MyStackPage() {
  const tools = await getAllTools();

  return (
    <Container className="max-w-4xl">
      <StackList tools={tools} />
    </Container>
  );
}

