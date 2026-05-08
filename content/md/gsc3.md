---json
{
  "title": "GSC v3: Markdown, TSX, MDX, and the Real Boundary",
  "slug": "gsc-v3-markdown-tsx-mdx-boundary",
  "date": "2026-05-07T00:00:00Z",
  "author": ["Jay Griffin"],
  "authorshipNote": "A synthesis of the layered agent architecture view with a stricter stance on portability: MDX is often a weak middle layer between pure Markdown and disciplined TSX.",
  "description": "The practical architecture: Markdown for durable meaning, TSX for behavior, MCP/tools for action. MDX is optional and often unnecessary.",
  "tags": ["ai", "markdown", "tsx", "mdx", "mcp", "agents", "documentation", "architecture"],
  "type": "doc"
}
---

## Thesis

The strongest AI systems are layered systems, not single-language systems.

1. English for reasoning and intent
2. Deterministic tools for exact action
3. English for synthesis
4. Structured output for clean handoff

This is how Perplexity, Google AI mode, and modern agents actually work.

But inside that architecture, there is still a hard design question for docs and content systems:

Should we use Markdown, MDX, or TSX?

My current answer: **Markdown + TSX is the stable default. MDX is optional and often not worth it.**

---

## Why Markdown Wins for Meaning

Markdown remains the best default for semantic content because it is:

- Portable
- Durable
- Plain text
- Human-editable
- LLM-familiar at massive scale

It is already entrenched as the instruction medium for:

- README files
- Agent skills
- Prompt instructions
- llms.txt surfaces
- Internal engineering docs

Markdown wins because it constrains structure while keeping prose expressive.

You can encode hierarchy and meaning with simple primitives like headings, lists, blockquotes, and links. LLMs already understand these patterns extremely well due to training distribution.

---

## Why TSX Wins for Behavior

TSX is code. It is where behavior belongs.

- State
- Conditionals
- Data fetching
- Composition
- Interactivity
- Routing logic

If the page needs to do things, TSX is the right layer. No hacks needed.

TSX can also render prose just fine. So if the argument for MDX is "we need components," TSX already solves that cleanly.

---

## The MDX Problem

MDX tries to bridge Markdown and TSX, but often lands in an awkward middle:

- Not fully portable like Markdown
- Not fully explicit as code like TSX
- Depends on special renderers
- Breaks in standard Markdown tooling
- Encourages logic leakage into content files over time

If a file ends with .md but requires an MDX runtime to render correctly, it is not functionally pure Markdown.

That matters for long-term durability, interoperability, and copy-paste-to-LLM workflows.

---

## Disciplined MDX Is Real, But It Is a Policy Constraint

There is a legitimate strong case for disciplined MDX.

Anthropic's docs are a good example of relatively clean usage:

- Mostly prose in Markdown style
- Light semantic components for layout and callouts
- Limited logic inside content files

That can be good authoring ergonomics.

But this quality comes from discipline, not from MDX itself.

The same team could often produce equivalent or better architecture with:

- Pure Markdown for content
- TSX wrappers/components for presentation
- Program logic outside content

So disciplined MDX is possible. It is just not uniquely powerful.

---

## The Core Comparison: Disciplined TSX vs Disciplined MDX

A key challenge is that disciplined TSX and disciplined MDX can look functionally similar.

In many cases, the practical difference is small:

- MDX heading syntax uses #, ##, ###
- TSX heading syntax uses component tags or h1/h2 wrappers

Both can be semantic.
Both can be clear.
Both can be transformed.

If so, why choose the one that is less portable?

That is the main anti-MDX argument.

---

## Portable Architecture That Scales

A durable architecture for human + LLM + agent use:

1. **Pure Markdown as canonical content**
   It should render in any standard Markdown renderer.

2. **TSX as presentation and interactivity layer**
   TSX composes docs, embeds demos, adds UI behaviors.

3. **MCP/tool layer for action**
   Search, routing, retrieval, and workflows live here.

4. **Optional semantic extraction pipeline (GSC compiler)**
   If needed, annotate complex TSX components with semantic hints (for example, data attributes) so a compiler can produce high-quality English summaries for LLM-facing routes.

This gives portability, maintainability, and agent usefulness without mixing concerns.

---

## Where MDX Might Still Be Worth It

MDX can still be a pragmatic choice when all of these are true:

- Team is already heavily MDX-native
- Components used in content are presentation-only
- No business logic is embedded in content
- A plain-text/portable export path is guaranteed
- Tooling lock-in risk is accepted

If any of these fail, prefer Markdown + TSX separation.

---

## llms.txt and .md Routes in This Model

Not everyone wants MCP.
Not everyone wants custom tooling.
Sometimes users just want to copy and paste docs into a model.

That is exactly why pure Markdown routes and llms.txt still matter.

They are the low-friction access layer.

MCP is the high-capability action layer.

Both are useful. They solve different problems.

---

## GSC v3 Definition

GSC should not be a new language.
GSC should not require custom markdown syntax.
GSC should not force MDX.

GSC should:

- Generate semantically complete English companions in standard Markdown
- Describe behavior, invariants, edge cases, and integration points
- Link to tool endpoints or MCP capabilities where actions are needed
- Keep content and behavior concerns separate

If semantics are buried in complex UI components, GSC can use optional TSX hints to recover meaning for LLM-facing documentation.

---

## Practical Heuristics

Use these defaults:

- If the goal is understanding: use Markdown.
- If the goal is interaction/behavior: use TSX.
- If the goal is action/automation: use tools (MCP).
- If you think you need MDX: prove why Markdown + TSX cannot do it first.

Short version:

**Markdown for meaning. TSX for behavior. MCP for action.**

MDX may fit in narrow cases, but it is not the center of gravity.

---

## Final Position

The frontier is not finding one magic control language.

The frontier is improving all three layers together:

- Better foundational reasoning in English
- Better deterministic tools and orchestration
- Better content architecture that keeps meaning portable

Given that reality, MDX does not automatically win.

It can be used well.
It can be used badly.
It is often unnecessary.

If portability and longevity matter, prefer pure Markdown + disciplined TSX and treat MDX as an exception, not the default.
