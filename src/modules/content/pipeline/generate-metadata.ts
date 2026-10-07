import OpenAI from "openai";
import { z } from "zod";

// OpenRouter speaks the OpenAI chat-completions dialect, so the OpenAI SDK
// works against it by pointing baseURL at OpenRouter.
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Model is configuration, not code. Set OPENROUTER_MODEL in .env.local.
// Read through a function so the guard actually narrows the type.
function requireModel(): string {
  const model = process.env.OPENROUTER_MODEL;
  if (!model) {
    throw new Error(
      "OPENROUTER_MODEL is not set — add e.g. OPENROUTER_MODEL=google/gemini-2.0-flash-001 to .env.local"
    );
  }
  return model;
}

const MODEL = requireModel();

const MetadataSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid slug"),
  description: z.string(),
  tags: z.array(z.string()),
  type: z.enum(["post", "doc", "design", "thought"]),
});

export type GeneratedMetadata = z.infer<typeof MetadataSchema>;

// OpenAI-style function schema. Note this differs from Anthropic's `input_schema`:
// the JSON Schema lives under `parameters`, and the wrapper is `function`.
const TOOL: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "generate_metadata",
    description: "Generate metadata for a piece of content",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "A clear, concise title" },
        slug: { type: "string", description: "URL-friendly slug (lowercase, hyphens only)" },
        description: { type: "string", description: "One punchy sentence summarizing the content" },
        tags: { type: "array", items: { type: "string" }, description: "3-8 lowercase tags" },
        type: { type: "string", enum: ["post", "doc", "design", "thought"], description: "post = narrative/opinion, doc = reference/technical, design = standalone TSX page/UI experiment, thought = programming work artifacts" },
      },
      required: ["title", "slug", "description", "tags", "type"],
    },
  },
};

export async function generateMetadata(
  content: string,
  format: "md" | "tsx" = "md"
): Promise<GeneratedMetadata> {
  const preview = content.slice(0, 2000);
  const formatLabel = format === "tsx" ? "TSX (React component)" : "markdown";

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [TOOL],
    tool_choice: { type: "function", function: { name: "generate_metadata" } },
    messages: [
      {
        role: "user",
        content: `You are a metadata generator for a personal website. Analyze this ${formatLabel} content and call generate_metadata with the appropriate values. For TSX content, focus on the prose inside JSX text nodes (e.g. inside <Paragraph>, <H1>, etc.) — ignore imports and structural boilerplate.\n\nContent:\n${preview}`,
      },
    ],
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.type !== "function") {
    throw new Error("No function call in response");
  }

  // Function arguments arrive as a JSON string, not a parsed object.
  const parsed = JSON.parse(toolCall.function.arguments);

  return MetadataSchema.parse(parsed);
}
