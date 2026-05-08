---json
{
  "title": "GSC: Generated Semantic Companion",
  "slug": "gsc-generated-semantic-companion",
  "date": "2026-05-07T00:00:00Z",
  "author": ["Jay Griffin"],
  "authorshipNote": "A synthesis of thinking about prose-as-interface, Markdown purity, MCP as agent architecture, and what content systems actually need to serve both humans and LLMs well.",
  "description": "The architecture for content systems that serve humans, agents, and LLMs equally well: pure Markdown, deterministic tools, clear boundaries.",
  "tags": ["ai", "prose", "markdown", "mcp", "agents", "documentation", "content-systems", "llm"],
  "type": "doc"
}
---

## The Thesis

Billions of dollars are being poured into LLM reasoning, understanding, and agentic action. The consensus is converging on a single truth: **natural language is the interface through which we instruct these systems.**

Not APIs. Not control languages. Not JSON schemas, though those are tactical tools.

**Prose.**

But not just any prose. **Prose constrained by Markdown's structural hierarchy.**

Markdown has exactly six information hierarchy elements: headers (six levels), bold, italic, lists, code, blockquotes, links. That's it. That constraint is the entire genius of Markdown.

Those constraints *force* semantic clarity. You can't vaguely describe something with just bold and prose — the hierarchy level you choose says something. Putting text in a blockquote instead of regular prose says something. Marking something as a list vs. prose says something.

An LLM reading:

```
#### Critical Invariant

This must always be true or the system breaks.
```

understands it's different from:

```
By the way, there's also this.
```

Not because of special syntax. Because prose + structural constraint encodes semantic meaning directly.

**Markdown's constraints ARE the semantic encoding.**

This is why Markdown is winning for AI instructions. It's not a markup language pretending to be text. It's text that's constrained just enough to force meaning, not so much that it requires parsing.

---

## The Three Philosophical Pillars

### 1. Pure Prose Is Durable, Programs Are Separate (from Frankenformats)

Markdown is text. That's the entire feature set and it's perfect for what it is. A markdown file should be readable in plain text, understandable without any special toolchain, portable anywhere.

The mistake is extending markdown with logic, components, variables, or conditionals. That creates a "frankenformat" — a hybrid that's bad at being text and bad at being a program.

**The correct architecture is two files:**

- **The prose file:** Pure markdown. No logic. No templates. No variables. Just meaning expressed clearly and durably. Readable by humans, LLMs, and any parser ever written.
  
- **The program file:** TSX that processes the prose and adds whatever interactive layer is needed. All logic, all state, all conditionals live here. Not coupled to content.

**For semantic program documentation:**

Don't invent new syntax or extend markdown. Write pure prose that explains the system semantically. The testing harnesses, the forcing functions, the validation — that all lives in the TSX that processes this prose, not in the content file.

**Prose stays pure. Programs stay separate. This is the architecture.**

### 2. Semantic Compression: Markdown's Constraints Are the Encoding (from Semantic Controls Part 1 + Frankenformats)

We often try to add semantic information through new systems: custom tags, special syntax, DSLs, markup languages.

The mistake is thinking you need to invent new syntax. Markdown already solved this through constraint.

Markdown has six information hierarchy elements:
- Headers (6 levels)
- Lists
- Blockquotes
- Bold/Italic
- Code
- Links

These six elements constrain all structured writing. The constraint forces clarity.

When you choose `#### Critical Invariant` instead of just writing prose, you're encoding information:
- The hierarchy level signals "this is a subordinate concept"
- The phrase "Critical Invariant" signals "this must be true or things break"
- The prose below confirms what and why

An LLM understands this encoding because it's seen billions of examples of Markdown. Not because you invented special syntax.

**Semantic compression isn't about inventing symbols. It's about using Markdown's structural constraints semantically, then letting prose fill in the meaning.**

When an LLM sees this structure, it knows this is different from:

```
> This is a side note that's nice but skippable
```

Both are supported by Markdown. The choice of structure + prose = semantic signal.

### 3. Testing Harnesses, Not Model Training (from Semantic Controls Part 2)

The old paradigm: Make AI smarter through reinforcement learning and custom training.

The new paradigm: Force AI to make correct decisions through enforcement mechanisms. Build better testing harnesses.

Schemas with semantic forcing functions aren't just data shapes. They're questions the AI must answer to proceed:
- "What is the user's problem here?"
- "What could go wrong if this fails?"
- "Why does this matter?"

The AI can't output anything until it answers these questions in valid form.

**This scales across all frontier models.** No training needed. No custom fine-tuning. Just better schemas that force better thinking.

**For program documentation: the test is whether an LLM can understand and act on the prose without asking clarifying questions or making assumptions.**

---

## The GSC Thesis: Programs to Prose Through Constraint

Here's the core insight that ties everything together:

**Programs are logic. Prose is how humans understand logic. LLMs understand prose — especially prose constrained by Markdown's information hierarchy — as well as or better than they understand code.**

Therefore: the optimal format for describing a program to an LLM is **Markdown prose that uses structural constraints semantically to encode information hierarchy.**

GSC's job: **Analyze a program and generate Markdown prose that expresses its semantic intent in ways an LLM can reason about accurately.**

Not by inventing new syntax. By using Markdown's six information hierarchy elements (headers, lists, blockquotes, bold, code, links) with discipline.

When GSC writes:

```markdown
#### Critical Invariant

Tokens are invalidated immediately when the user changes their password.

If this invariant is violated, stolen tokens remain valid. This is a security hole.
```

The LLM understands this is different from:

```markdown
Tokens might be invalidated when the user changes their password.
```

The hierarchy level (####), the phrase choice ("Critical Invariant"), and the prose together encode semantic meaning. Three signals, all from Markdown's standard constraints, all understood by LLMs because they've seen billions of examples of this exact pattern.

---

## Why Prose Over Specs (And Over Custom Semantic Markup)

### Specs Are Flat

API specifications enumerate endpoints, parameters, response types. They're complete but semantically flat. Information hierarchy is absent, so all information is equally important.

```
GET /users/{id}
Returns: User object with id, name, email
```

This doesn't say: "Why call this? What breaks? What's critical vs. nice-to-know?"

### Custom Markup Requires External Knowledge

We've invented dozens of systems to add semantic information to text: HTML tags, ARIA labels, MDX components, XML, custom markdown extensions (`:::warning`, `{{variables}}`, etc.).

All of them require knowing the *system* to parse the *meaning*.

```html
<aside>
  <strong>Critical Invariant:</strong>
  This must always be true or the system breaks.
</aside>
```

vs.

```markdown
#### Critical Invariant

This must always be true or the system breaks.
```

Both encode that something is important and supplementary. But the second requires knowing nothing except Markdown. The first requires knowing HTML semantics. The LLM has to parse a different system; it's an extra cognitive load.

### Markdown Constraints Force Semantic Clarity

Markdown has six information hierarchy elements. Period. That constraint is intentional. It forces you to express meaning through:
1. **Hierarchy level chosen** (header 1-6 signals importance/scope)
2. **Structure used** (list vs. prose vs. blockquote signals relationship)
3. **Prose written** (the actual words you use)

Together, these three dimensions encode semantic meaning that both humans and LLMs understand immediately.

```
#### Side Note

This is tangential information that enriches understanding.
```

An LLM knows this is supplementary because:
- It's a 4th-level header (subordinate)
- The phrase "Side Note" signals it's an aside
- The prose confirms what kind of aside

No system to learn. No special parsing. Just prose + structure = meaning.

### Why This Wins

LLMs are trained on billions of tokens of human writing. They understand Markdown because it's the most common structured format on the internet. They understand it better than any custom system because they've seen it billions of times.

When Markdown's structural constraints are respected and prose is clear, LLMs parse the semantic content perfectly. When you invent a new system, you're asking the LLM to learn something it's never seen at scale.

**The constraint is the feature.**

---

## The Research Direction: How Companies Get This Right

The hypothesis: Companies that have succeeded in getting LLMs to reliably understand and extend their systems have discovered patterns in how to structure information in prose.

**The investigation:**
- Analyze llms.txt files from the top 100 companies
- Analyze their markdown documentation on GitHub (especially /docs routes)
- Identify anomalies and patterns:
  - How much detail do successful implementations include?
  - What structure do they use?
  - How do they prioritize information?
  - Where do they fail (ambiguity, missing context)?
  - What prose patterns appear in systems that work well vs. poorly with LLMs?

**The goal:** Extract design principles for writing program prose that LLMs can reason about accurately and deeply.

This is not about finding "the one right format." It's about discovering which semantic patterns consistently produce better AI understanding.

---

## GSC Architecture: From Program to Prose

### Phase 1: Parse Intent

**Input:** A program (codebase, API, system architecture)

**Questions to answer:**
- What does this program DO? (Primary purpose)
- What PROBLEMS does it solve? (User problems, not just technical function)
- What INVARIANTS must hold? (Things that must always be true)
- What BREAKS it? (Failure modes, edge cases, anti-patterns)
- What DEPENDS on it? (Systems that rely on this)
- What EVOLVES it? (How does it change over time?)

This is the semantic analysis phase. Not parsing code — understanding intent.

### Phase 2: Generate Pure Semantic Prose

**Output:** Plain markdown with semantic clarity and information hierarchy. No logic. No templates. No variables. Just text.

Example (pure markdown, readable as plain text):

```markdown
# Authentication System

## Purpose

Controls access to user resources based on verified identity.
This system supports both interactive sessions (logins) and programmatic API access (tokens).

## How It Works

Users authenticate once with credentials. The system returns a token that represents a verified identity for a limited time.

Tokens are like passports. They say "this person logged in on this date." They expire after 15 minutes. If the user logs out or changes their password, all their tokens stop working immediately.

## Critical Invariants

These must always be true or the system breaks:

- Tokens are invalidated instantly when the user changes their password
- Tokens expire after 15 minutes, even if never used
- Refresh tokens are tied to one user only, never reused across accounts
- Tokens are invalid on a different domain than the one that issued them

## What Breaks It (Common Mistakes)

- Caching authentication decisions. If you cache "user X is admin" for an hour, and X loses admin status, bad things happen. Cache nothing or cache for seconds only.
- Forgetting to invalidate tokens when the user changes their password. This is a security hole. A stolen token is still good until the password changes.
- Storing tokens in unencrypted browser localStorage. Use httpOnly cookies instead.
- Reusing tokens across different services. Generate new tokens per service.

## How It Integrates

Login endpoint: user sends credentials, gets back a token and refresh token.

API middleware: validates token on every request. Returns 401 if expired or invalid.

Logout endpoint: marks token as revoked.

Password change: invalidates all user tokens, forces them to log in again.

Refresh endpoint: takes the refresh token, issues a new access token. Prevents repeated password entry.

## When This Is Wrong

Don't use this for service-to-service auth. Use API keys with static secrets instead.

Don't use this if you have external identity providers (Google, GitHub, etc.). Use OAuth instead.

Don't use this in enterprise with central auth. Use single-sign-on instead.
```

This is pure prose. No variables, no conditionals, no logic constructs. An LLM can read it, understand it, and reason about it accurately. A human can read it the same way. It renders as plain text without any special tooling.

### Phase 3: Validate With Testing Harnesses

The prose is pure — it has no logic. But the **program that processes it** can have all the logic needed.

**Test:** The TSX that renders this documentation can validate semantic understanding:
- "Describe the authentication system" → LLM reads the markdown and responds
- Parse the response. Did it get the invariants right? Did it understand what breaks?
- If LLM reasoning is accurate, the prose is semantically complete
- If LLM reasoning is wrong, the prose is missing information

This is the testing harness paradigm applied correctly: **the code validates that the prose enables accurate reasoning, without the prose itself having any logic.**

The prose is testable without being complicated. It's validated without being constrained by a DSL or forcing functions embedded in the content.

### Phase 4: Generate Variations

Different contexts need different prose:

**For integration:** "Here's how to call this system"
**For extension:** "Here's how to add new behavior"
**For debugging:** "Here's what breaks and how to fix it"
**For architectural decisions:** "Here are the trade-offs we made"

Same semantic intent, different purposes, different prose organization.

---

## GSC: Use Markdown's Constraints, Not Extensions

GSC generates pure markdown. Importantly, it uses only Markdown's existing six information hierarchy elements: headers, lists, blockquotes, bold, code, links. Nothing more.

**GSC will never produce:**
- Custom markdown extensions (`:::warning blocks`, `> [tabs]`, etc.)
- Template syntax (`{%if%}`, `{{variable}}`, etc.)
- Special characters that extend markdown (new symbols, custom notation)
- Metadata that drives behavior

**GSC produces:**
- Pure markdown using only standard elements
- Semantic meaning encoded through hierarchy + prose combination
- Content portable to any markdown renderer without modification
- Documentation an LLM understands because it knows Markdown

The semantic encoding comes from **disciplined use of Markdown's existing constraints**, not from inventing new syntax.

When GSC chooses to write:

```
#### Critical Invariant

This must always be true.
```

instead of:

```
This must always be true.
```

That structural choice + prose = semantic information. An LLM reads the hierarchy level + the phrase + the explanation and understands this is a core invariant. No special system. Just constraint-driven clarity.

---

Traditional documentation answers: "How do I USE this?"

GSC answers: "How does an LLM UNDERSTAND this?"

The difference:
- **Docs** optimize for human question-answering ("How do I authenticate?")
- **GSC** optimizes for LLM reasoning ("What must be true for authentication to work safely?")

They can coexist. In fact, good GSC prose often becomes better human docs because the semantic clarity helps everyone.

---

## Why This Is Different from AI Training

You don't need to train a model to understand prose. Frontier models already do.

GSC isn't about making models smarter. It's about feeding them better information.

It's analogous to learning: feeding a smart person a well-structured explanation is more effective than feeding them raw data and hoping they figure it out.

---

## Potential Impact

### For Individual Developers
Generate context-aware prose descriptions of your systems, then use those with Claude/ChatGPT to:
- Generate implementations faster (AI understands the system)
- Debug safely (AI knows what breaks)
- Extend correctly (AI knows constraints)
- Integrate accurately (AI knows dependencies)

### For Teams
Replace dense code reviews with semantic prose reviews. 
"Does this change violate any invariants?"
"Does this implement the mental model correctly?"

### For Open Source
Ship prose descriptions alongside code. LLMs can now understand your system without reading source. Faster contributions, better extensions.

### For Enterprise
API description prose becomes the contract between systems. LLM-readable, human-readable, machine-checkable.

### For AI Tool Builders
Better context = better AI outputs. Companies that master semantic prose will build the most capable AI tools.

---

## The Research Agenda

1. **Analyze llms.txt and markdown patterns** from companies with strong AI integration. What do they do right?

2. **Extract design principles.** What information hierarchy patterns consistently produce better LLM understanding?

3. **Design the DSL for program prose.** What symbols, structure, and semantic forcing functions are needed?

4. **Build the parser.** How do we extract semantic intent from code?

5. **Build the generator.** How do we output semantically precise prose?

6. **Validate the approach.** Does prose generated by GSC actually enable better LLM reasoning?

7. **Expand to documentation.** Can GSC help teams write better human documentation too?

8. **Build the interface.** How do developers use this? CLI? IDE extension? Web tool?

---

## Connection to Broader Trends

### LLMs as the Instruction Interface

Every frontier AI company is realizing: natural language is not a stepping stone to something more formal. It's the endpoint.

OpenAI's approach: structured outputs + natural language system prompts.
Anthropic's approach: prompt engineering + expanded context windows.
Anthropic's approach: agents that reason in prose before taking action.

**The pattern:** Prose with semantic structure is the interface. Tools amplify it, but don't replace it.

### Information Architecture as Power

The future competitive advantage in software won't be "smarter code." It will be "clearer understanding."

Teams that can describe their systems semantically (in prose or prose-like structures) will:
- Attract better AI-assisted development
- Build more reliable systems (fewer misunderstandings)
- Integrate with other systems more safely
- Scale to larger, more complex architectures

Information architecture is becoming strategic infrastructure.

### The Shift from Control to Guidance

Old model: Try to force AI to do what you want (training, fine-tuning, rigid schemas).

New model: Give AI clear understanding, then it does what you want.

This is a fundamental shift. It's not "jailbreaking" or "hacking." It's just: good information + reasoning = good decisions.

---

## The Honest Limitations

1. **Prose can be ambiguous.** You have to be disciplined about semantic clarity. It's a constraint, not a feature.

2. **You still need to validate.** The testing harness paradigm applies: the prose passes only if AI output is correct. Validation is non-negotiable.

3. **It's still context-limited.** A frontier model can't reason about a billion lines of code. GSC needs to compress intelligently.

4. **Human review is necessary.** This isn't full automation. It's 10x leverage. Humans still decide what's right.

5. **The research is open-ended.** We don't yet have proven design principles for semantic program prose. This is exploratory.

---

## Next Steps

### Immediate (Proof of Concept)
1. Pick one system I've built (e.g., the birthday cards app, the food math app)
2. Write semantic prose describing its intent, invariants, and error modes
3. Give that prose to Claude and ask it to:
   - Explain what the system does
   - Identify potential bugs
   - Suggest extensions
   - Write a missing feature
4. Evaluate: How accurate and useful were the outputs?

### Short Term (Research)
1. Analyze 20+ llms.txt files. Extract patterns.
2. Identify what works, what doesn't.
3. Write initial design principles for semantic program prose.

### Medium Term (Build)
1. Design the semantic prose format (symbols, structure, fields).
2. Build a parser that extracts intent from code.
3. Build a generator that outputs semantic prose.
4. Validate on real systems.

### Long Term (Impact)
1. Make GSC a tool others can use (CLI, web, IDE integration).
2. Build a database of semantic prose for popular libraries.
3. Integrate with AI dev tools so the prose amplifies their outputs.
4. Publish research on what information patterns produce best LLM understanding.

---

## The Core Realization

For years, we've been trying to make systems and prose work together through documentation. Separate concerns. Documentation explains the system. System does the work. They drift apart.

**What if prose IS the system?**

Not instead of code — alongside it. The prose describes the semantic intent. The code implements it. They're in sync because they're describing the same thing from different angles.

When an LLM reads the prose, it understands the intent.
When a human reads the code, they understand the mechanism.
When an AI reads the code, it's confused and needs the prose.

**GSC generates the prose.**

That prose becomes the Rosetta Stone between human understanding, machine understanding, and code implementation.

This is probably the final form of how we instruct AI systems: not through new control languages or exotic prompting techniques, but through **the clearest possible explanation of what we're trying to do and why.**

Prose. Information hierarchy. Semantic precision.

That's the interface.
