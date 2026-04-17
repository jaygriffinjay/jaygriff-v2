import { NextRequest } from "next/server";

export const runtime = "edge";

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, per-IP, resets on deploy)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // requests per window

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune expired entries every check to prevent unbounded growth
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_FILE_CONTENT_BYTES = 100 * 1024; // 100 KB

/** Return a safe error message without leaking upstream API account details */
function sanitizeUpstreamError(status: number, provider: string): string {
  if (status === 401) return `Invalid ${provider} API key.`;
  if (status === 403) return `${provider} API key does not have access to this model.`;
  if (status === 429) return `${provider} rate limit exceeded. Wait a moment and try again.`;
  if (status === 500 || status === 502 || status === 503)
    return `${provider} is temporarily unavailable. Try again shortly.`;
  return `${provider} returned an error (${status}).`;
}

export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const ip =
    (req as unknown as { ip?: string }).ip ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (isRateLimited(ip)) {
    return new Response("Rate limit exceeded. Try again shortly.", { status: 429 });
  }

  const body = await req.json();
  const { fileContent, filePath, apiKey, provider, model, repoContext, contextFiles } = body;

  if (!apiKey || !fileContent || !filePath) {
    return new Response("Missing required fields", { status: 400 });
  }

  // --- Payload size limit (primary file) ---
  if (new TextEncoder().encode(fileContent).byteLength > MAX_FILE_CONTENT_BYTES) {
    return new Response("File content exceeds 100 KB limit.", { status: 413 });
  }

  // --- Validate contextFiles (optional array of {path, content}) ---
  const validContextFiles: { path: string; content: string }[] = [];
  if (Array.isArray(contextFiles)) {
    let totalCtxBytes = 0;
    for (const cf of contextFiles.slice(0, 5)) {
      if (typeof cf.path === "string" && typeof cf.content === "string") {
        const bytes = new TextEncoder().encode(cf.content).byteLength;
        if (totalCtxBytes + bytes > MAX_FILE_CONTENT_BYTES * 3) break;
        totalCtxBytes += bytes;
        validContextFiles.push({ path: cf.path, content: cf.content.slice(0, 30_000) });
      }
    }
  }

  const systemPrompt = `You are a senior security researcher performing a thorough source code audit. You are an expert at finding security vulnerabilities, logic bugs, and potential exploits.

Analyze the provided source code file carefully. Look for:
- Memory safety issues (buffer overflows, use-after-free, etc.)
- Injection vulnerabilities (SQL, XSS, command injection, SSRF, etc.)
- Authentication/authorization flaws
- Race conditions and TOCTOU bugs
- Cryptographic misuse
- Logic errors that could be exploited
- Input validation issues
- Information disclosure

Be thorough but concise. Do NOT fabricate issues — only report real concerns.
If a file has no meaningful security issues, briefly explain why the file looks safe.`;

  const contextBlock = validContextFiles.length > 0
    ? `\n\nThe following referenced files are provided for context — use them to verify whether cross-file concerns are real issues or false alarms:\n${validContextFiles.map((cf) => `\n--- ${cf.path} ---\n\`\`\`\n${cf.content}\n\`\`\``).join("\n")}`
    : "";

  const userPrompt = `Repository: ${repoContext}
File: ${filePath}

\`\`\`
${fileContent}
\`\`\`${contextBlock}

Analyze this file for security vulnerabilities.`;

  // --- Validate provider & model ---
  if (provider !== "anthropic" && provider !== "openai") {
    return new Response("Invalid provider.", { status: 400 });
  }

  const ALLOWED_MODELS = new Set([
    "claude-opus-4-6", "claude-sonnet-4-6", "claude-sonnet-4-5-20250514",
    "claude-sonnet-4-20250514", "claude-haiku-4-5",
    "gpt-4o", "gpt-4o-mini", "o3", "o4-mini",
  ]);
  if (model && !ALLOWED_MODELS.has(model)) {
    return new Response("Invalid model.", { status: 400 });
  }

  if (provider === "anthropic") {
    return proxyAnthropic(apiKey, model || "claude-sonnet-4-6", systemPrompt, userPrompt);
  }
  return proxyOpenAI(apiKey, model || "gpt-4o", systemPrompt, userPrompt);
}

// ---------------------------------------------------------------------------
// Shared tool schema for structured output
// ---------------------------------------------------------------------------

const findingsToolSchema = {
  name: "report_findings",
  description: "Report security audit findings for a source code file",
  input_schema: {
    type: "object" as const,
    properties: {
      summary: {
        type: "string",
        description: "Brief 1-2 sentence summary of the file's security posture",
      },
      findings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            severity: {
              type: "string",
              enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"],
            },
            title: { type: "string", description: "Short title" },
            line: { type: "string", description: "Approximate line number or range" },
            description: {
              type: "string",
              description: "Clear explanation of the vulnerability. Markdown OK.",
            },
            recommendation: {
              type: "string",
              description: "How to fix it. Markdown and code blocks OK.",
            },
          },
          required: ["severity", "title", "description", "recommendation"],
        },
      },
    },
    required: ["summary", "findings"],
  },
};

// OpenAI uses a different schema format
const openAIFindingsSchema = {
  type: "json_schema" as const,
  json_schema: {
    name: "security_report",
    strict: true,
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        findings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              severity: {
                type: "string",
                enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"],
              },
              title: { type: "string" },
              line: { type: "string" },
              description: { type: "string" },
              recommendation: { type: "string" },
            },
            required: ["severity", "title", "line", "description", "recommendation"],
            additionalProperties: false,
          },
        },
      },
      required: ["summary", "findings"],
      additionalProperties: false,
    },
  },
};

// ---------------------------------------------------------------------------
// Anthropic proxy (tool_use for structured JSON)
// ---------------------------------------------------------------------------

async function proxyAnthropic(apiKey: string, model: string, system: string, user: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
      tools: [findingsToolSchema],
      tool_choice: { type: "tool", name: "report_findings" },
      stream: true,
    }),
  });

  if (!res.ok) {
    return new Response(sanitizeUpstreamError(res.status, "Anthropic"), { status: res.status });
  }

  return new Response(transformAnthropicToolStream(res.body!), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/** Extract JSON from Anthropic tool_use streaming — input_json_delta events */
function transformAnthropicToolStream(body: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (
                parsed.type === "content_block_delta" &&
                parsed.delta?.type === "input_json_delta" &&
                parsed.delta?.partial_json
              ) {
                controller.enqueue(encoder.encode(parsed.delta.partial_json));
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}

// ---------------------------------------------------------------------------
// OpenAI proxy
// ---------------------------------------------------------------------------

async function proxyOpenAI(apiKey: string, model: string, system: string, user: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: openAIFindingsSchema,
      stream: true,
    }),
  });

  if (!res.ok) {
    return new Response(sanitizeUpstreamError(res.status, "OpenAI"), { status: res.status });
  }

  return new Response(transformOpenAIStream(res.body!), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function transformOpenAIStream(body: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}
