---json
{
  "title": "GSC v2: Markdown Purity + Tool Architecture",
  "slug": "gsc-v2-markdown-purity-tool-architecture",
  "date": "2026-05-07T00:00:00Z",
  "author": ["Jay Griffin"],
  "authorshipNote": "Second-pass thesis: useful agent systems are layered. Markdown carries semantic intent, deterministic tools execute action, and MCP standardizes the tool layer.",
  "description": "A practical architecture for human docs and agentic systems: pure Markdown for meaning, MCP/tools for action.",
  "tags": ["ai", "markdown", "mcp", "agents", "documentation", "content-architecture"],
  "type": "doc"
}
---

## Core Claim

The strongest AI systems are not "English only" or "code only." They are layered systems:

1. English for reasoning and intent
2. Deterministic tools for exact action
3. English for synthesis
4. Structured output for handoff/rendering

That is why systems like Perplexity, Google AI mode, and modern tool-using agents feel powerful.

---

## Why Markdown Keeps Winning

Markdown is already the default interface language for instructions:

- README files
- agent instructions
- skill definitions
- llms.txt surfaces
- internal runbooks and docs

This is not random. Markdown hits the best tradeoff:

- Dense enough to carry rich information
- Human-readable in plain text
- Easy to edit
- Universally portable
- Familiar to LLMs at training scale

The key feature is constraint. Markdown gives you a small set of structure primitives and forces you to encode meaning through hierarchy and prose.

Example:

```markdown
#### Aside

Side comment about a thing.
```

This often beats custom tags for instruction quality because the model has massive prior exposure to this exact pattern.

---

## The Boundary That Matters

Most teams get stuck at one boundary:

- They want content files to also behave like programs.

That is where frankenformats appear (custom tags, inline logic, behavior-driving metadata).

Better boundary:

- Markdown files stay pure content.
- Programs handle behavior.
- Tool layers (MCP) handle search, routing, retrieval, and action.

If you need conditionals, routing, permissions, retrieval, or workflow execution, that is a tool/program concern, not a Markdown concern.

---

## English vs Control Language

Is a super-designed control language the frontier?

Maybe for specific subproblems. But in practice today, frontier systems improve by combining:

- Better foundational reasoning in natural language
- Better deterministic tool use
- Better orchestration between them

So the practical frontier is not replacing English. It is steering English better and grounding it with stronger tools.

English remains the highest-level reasoning medium. Code and schemas remain the best execution and verification medium.

Both are required.

---

## MCP's Role

MCP is best seen as standard plumbing for the action layer of agents.

- User asks in English
- Agent reasons in English
- Agent selects deterministic tools
- Tool outputs return as data
- Agent synthesizes in English
- UI receives structured output when needed

This does not compete with Markdown docs. It complements them.

Markdown explains systems. MCP lets agents do things with systems.

---

## llms.txt and .md URLs Still Matter

Not everyone wants to run an MCP server.

Sometimes the right UX is simple: open a page, copy markdown, paste into a model.

So lightweight AI-facing surfaces still matter:

- llms.txt indices
- clean .md routes
- predictable linking
- semantically organized docs

These are the low-friction access layer. MCP is the high-capability action layer.

---

## GSC v2 Definition

GSC should help create semantically complete Markdown companions for programs.

A GSC document should answer, in pure Markdown:

- What this system is for
- How it works at a high level
- What invariants must hold
- What common failures look like
- How to navigate related docs
- What requires tools instead of prose

No custom syntax required.

---

## Research Direction

The research question is now concrete:

How are real teams drawing the boundary between content and program in AI-facing documentation systems?

Study targets:

- llms.txt files
- public markdown docs and MD routes
- frontmatter usage patterns
- places where logic leaks into content

Output:

- Patterns that correlate with better LLM understanding
- Patterns that create frankenformat debt
- Heuristics for when to keep writing docs vs when to build MCP tools

---

## Practical Heuristic

Use this rule:

- If the goal is understanding, use Markdown.
- If the goal is action, use tools.
- If it needs both, keep both layers separate and linked.

In short:

- Markdown for semantic intent
- MCP/tools for deterministic execution
- English for reasoning across both

That is the architecture already winning in practice.
