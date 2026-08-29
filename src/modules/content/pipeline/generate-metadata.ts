import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic();

const MetadataSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid slug"),
  description: z.string(),
  tags: z.array(z.string()),
  type: z.enum(["post", "doc"]),
});

export type GeneratedMetadata = z.infer<typeof MetadataSchema>;

const TOOL: Anthropic.Tool = {
  name: "generate_metadata",
  description: "Generate metadata for a piece of content",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "A clear, concise title" },
      slug: { type: "string", description: "URL-friendly slug (lowercase, hyphens only)" },
      description: { type: "string", description: "One punchy sentence summarizing the content" },
      tags: { type: "array", items: { type: "string" }, description: "3-8 lowercase tags" },
      type: { type: "string", enum: ["post", "doc"], description: "post = narrative/opinion, doc = reference/technical" },
    },
    required: ["title", "slug", "description", "tags", "type"],
  },
};

export async function generateMetadata(
  content: string,
  format: "md" | "tsx" = "md"
): Promise<GeneratedMetadata> {
  const preview = content.slice(0, 2000);
  const formatLabel = format === "tsx" ? "TSX (React component)" : "markdown";

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "generate_metadata" },
    messages: [
      {
        role: "user",
        content: `You are a metadata generator for a personal website. Analyze this ${formatLabel} content and call generate_metadata with the appropriate values. For TSX content, focus on the prose inside JSX text nodes (e.g. inside <Paragraph>, <H1>, etc.) — ignore imports and structural boilerplate.\n\nContent:\n${preview}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "tool_use") as
    | Anthropic.ToolUseBlock
    | undefined;

  if (!block) throw new Error("No tool_use block in response");

  return MetadataSchema.parse(block.input);
}
