import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ProjectsLab } from "./projects-lab";

// scratch route for trying layouts; never meant to ship
export const metadata: Metadata = {
  title: "Projects Lab",
  robots: { index: false, follow: false },
};

export default function ProjectsLabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Container className="max-w-4xl">
      <ProjectsLab />
    </Container>
  );
}
