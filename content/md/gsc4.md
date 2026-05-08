---json
{
  "title": "GSC v4: Practical Plan",
  "slug": "gsc-v4-practical-plan",
  "date": "2026-05-07T00:00:00Z",
  "author": ["Jay Griffin"],
  "authorshipNote": "A practical operating plan for building GSC after clarifying the Markdown, TSX, MDX, and MCP boundaries.",
  "description": "What to actually build next: canonical formats, page architecture, compiler direction, and research phases for GSC.",
  "tags": ["gsc", "markdown", "tsx", "mcp", "planning", "documentation", "architecture"],
  "type": "doc"
}
---

## Purpose

Enough theory. This document is the practical plan for what to do next.

The goal is not to invent a new language. The goal is to build a system that:

- keeps content portable
- keeps programs powerful
- makes apps more understandable to LLMs and agents
- gives me a real architecture I can use on my own sites right now

---

## Final Position So Far

After working through Markdown, MDX, TSX, Markdoc, llms.txt, and MCP, the current position is:

- **Markdown** is the public, portable semantic layer.
- **TSX** is the full-power implementation layer.
- **Markup TSX** is a disciplined subset of TSX that is semantically structured enough to be compiled into other representations.
- **MDX** is not the default. It gives up portability without adding enough unique value.
- **MCP** is the action layer for search, routing, retrieval, and workflow execution.

That means GSC is not a new format. GSC is a compiler and companion system built around clear boundaries.

---

## The Main Architecture

### 1. Public Markdown Surface

Every important page or system should be able to produce a pure Markdown version.

This version is for:
- portability
- llms.txt and `.md` routes
- copy-paste into models
- generic parsers and renderers
- broad compatibility with agent tooling

This Markdown must remain standard and renderer-safe.

No custom syntax. No component props. No logic in content.

### 2. Page TSX as Markup TSX When Possible

Page-level TSX should be written as cleanly and semantically as possible.

That means:
- clear hierarchy
- semantic component names
- prose doing the meaning work
- minimal orchestration in the page body
- interactive or complex logic pushed into subcomponents

Page TSX does not need to be pure. It can still do auth, redirects, and top-level data loading. But the rendered body should be as close to semantic markup as possible.

### 3. MCP as Action Layer

If an agent needs to:
- search
- route
- filter
- retrieve related resources
- take actions
- inspect app state

that is an MCP/tool problem, not a content problem.

Docs should explain. MCP should act.

### 4. GSC as Compiler

GSC becomes the system that reads page-level semantic source and produces:
- Markdown companions
- extracted structure/data
- summaries of interactive regions
- agent-ready context packages

This is the actual product direction.

---

## Operating Rules

### Rule 1

Do not put logic in Markdown.

### Rule 2

Do not use MDX by default.

If something can be done with Markdown + TSX separation, do that first.

### Rule 3

Treat page TSX as semantic scaffolding whenever practical.

A page is allowed to orchestrate, but the body should read like structured information, not application soup.

### Rule 4

Push heavy interaction into subcomponents.

If a region is genuinely interactive, stateful, or app-like, isolate it and let GSC summarize it instead of trying to force a one-to-one Markdown translation.

### Rule 5

Keep a portable Markdown route for important pages.

That route is the stable public contract.

### Rule 6

Use markup TSX internally where richer semantic extraction is useful.

Markup TSX is not a public standard. It is a private high-fidelity source format.

---

## What Markup TSX Means

Markup TSX is not a new language. It is a house style.

A file qualifies as markup TSX when:
- most of the structure is semantic rather than behavioral
- component names carry meaning
- the page body is extractable into information hierarchy
- complex regions can be summarized or specially handled
- the source can be parsed into a useful AST for transformation

Some TSX is markup TSX.
Some TSX is just program logic.
The system should distinguish between them.

---

## Why This Matters

The reason to care about markup TSX is not just that LLMs can read it.

The reason is that markup TSX can become data.

Once the page body is parseable and semantically constrained, GSC can:
- extract headings and sections
- identify semantic component roles
- map typography components into Markdown
- summarize interactive islands
- generate `.md` routes automatically
- index app structure for MCP retrieval

That is where the leverage comes from.

---

## The First Real Build Targets

### Target 1: Define the Markup TSX Profile

Write down what counts as markup TSX in this codebase.

This should answer:
- which components are semantic
- which components compile directly to Markdown
- which components need special handling
- which components are interactive-only and should be summarized
- what page-level logic is allowed before the semantic body begins

This is the private contract.

### Target 2: Build One Manual TSX → Markdown Example

Take a real page like the blocks design doc and define what its Markdown companion should look like.

Not as theory. As a concrete mapping.

This gives a reference example for the compiler.

### Target 3: Extract Semantic AST

Parse a page TSX file and emit a structured representation:
- page title
- sections
- paragraphs
- lists
- code blocks
- tables
- cards
- badges
- interactive regions

This is the first technical milestone that proves the idea.

### Target 4: Compile to Pure Markdown

Using the AST, generate standard Markdown.

Where exact translation is not possible, generate summary text for the complex region.

### Target 5: Build a Dual-Source Retrieval Strategy

For MCP, index both:
- Markdown output for portable semantic retrieval
- markup TSX source for richer implementation understanding

Use intent-based routing to choose one or both.

---

## Research Tracks

### Track A: Real-World Doc System Analysis

Continue looking at:
- llms.txt files
- public `.md` routes
- MDX-based doc systems
- shortcode/templating systems like Hugo
- Markdoc and similar DSLs

Goal:
Understand where frankencreep happens and where the content/program boundary breaks down.

### Track B: Local Compiler Feasibility

Use this codebase as the testbed.

Goal:
Prove that your own page TSX can be formalized into data and compiled into Markdown with acceptable loss.

### Track C: Agent Usefulness

Test whether generated Markdown companions actually help models and MCP tools reason better about your app.

Goal:
Make this useful, not just elegant.

---

## What Not to Do

Do not:
- invent a custom content DSL right now
- over-design a universal standard for everyone else
- try to make all TSX Markdown-compilable
- put interactive logic into content files
- chase MDX parity as a product goal

That is drift.

The practical goal is much smaller and much stronger:
- disciplined page TSX
- pure Markdown companion output
- tool-based action layer
- AST/compiler pipeline where it pays off

---

## Immediate Next Steps

1. Pick one real page as the reference implementation.
   The blocks design doc is a good candidate.

2. Write the target Markdown output for that page.
   Do it manually once.

3. Define the semantic component mapping.
   Example: `H1 -> #`, `Paragraph -> paragraph`, `List -> list`, `InlineCode -> inline code`, `Card -> semantic block with title/body`.

4. Decide how to represent non-Markdown-native structures.
   Tables may map directly. Cards may map to subsections or list items. Badges may become inline labels. Interactive regions may become summaries.

5. Build the first parser/transform prototype.

6. Only after that, decide whether extra semantic hints are needed as props or data attributes.

---

## Practical Summary

The next move is not more philosophy.

The next move is to treat GSC as a practical compiler project with a very clear operating model:

- pure Markdown as public portable output
- markup TSX as private semantic scaffolding
- TSX as the real implementation layer
- MCP as the action layer

That is enough to start building.
