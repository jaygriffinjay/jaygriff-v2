import { H2, Paragraph } from "@/components/typography";

export default function Placeholder() {
  return (
    <>
      <H2>TSX content placeholder</H2>
      <Paragraph>
        This file exists so the build system can resolve dynamic imports from{" "}
        <code>content/tsx/</code>. Drop real TSX content files here and run the
        sync script.
      </Paragraph>
    </>
  );
}
