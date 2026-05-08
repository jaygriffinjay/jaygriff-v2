# Frankenformats: Stop Making Your Markdown Do Things

## Markdown Is Text. That's It. That's The Whole Thing.

Markdown was invented so humans could write structured text that looks good as plain text AND renders nicely. Headers. Bold. Lists. Code blocks. Links. That's the entire feature set and it's perfect for what it is.

`# This is a heading` looks like a heading even before it's rendered. That's genius. That's the whole point.

Markdown is not a programming language. Markdown is not a component system. Markdown is not a templating engine. Markdown is not a database query layer. Markdown is not a UI framework.

Markdown is text with light structure. Full stop.

---

## TSX Is a Program That Can Contain Text

On the other end of the spectrum you have TSX. A TSX file is a program. It has logic. It has state. It has conditionals. It imports other programs. It can fetch data. It can respond to user input. It renders UI.

TSX can absolutely contain text. It can render prose. It can display documentation. It can be a blog post if you want it to be.

But it's fundamentally a program first. The text is a passenger. The code is driving.

---

## The Gap Is Real and That's Fine

So you have markdown — pure text with structure — and you have TSX — programs that can contain text. And there's a gap between them.

Some content is pure prose. Some content is an interactive program. And some content is... somewhere in the middle. A documentation page that's mostly prose but needs a live code demo. A blog post that's mostly text but needs a data visualization.

That gap is real. The gap is legitimate. The gap requires a solution.

**The correct solution is not to make markdown do things it was never designed to do.**

---

## Enter the Frankenformats

Someone looked at that gap and said: what if we just... extended markdown? What if markdown could have components? What if markdown could have logic? What if markdown could have variables and functions and conditionals?

And thus the frankenformats were born.

**MDX** — markdown but you can put JSX in it. Sounds great. Now your content file is half prose half program and fully neither. Your writers can't write in it without knowing React. Your developers can't treat it like a component without fighting the markdown parser. Everyone loses.

**Markdoc** — Stripe's custom solution. At least it's honest about being its own thing. But look at what it actually is:

```
{% if equals(1, 2) %}
Show the password
{% /if %}
```

That's an if statement. In a content file. Written in a proprietary syntax that only works in Markdoc's renderer. Your content is now coupled to a specific toolchain forever. Good luck migrating. Good luck getting a non-engineer to write it. Good luck explaining to an LLM what `{% titleCase($markdoc.frontmatter.title) %}` means.

**Every custom markdown extension ever** — someone needed tables that don't suck so they invented a new table syntax. Someone needed callout boxes so they invented `:::warning` blocks. Someone needed tabs so they invented `> For ['nextjs', 'react']:` inside a blockquote. Someone needed conditional content so they invented their own template language inside a format that was designed to have no template language.

Every single one of these is a local patch to a global problem. And every single one makes the content less portable, less readable, less durable, and more coupled to a specific renderer.

---

## What You're Actually Doing When You Extend Markdown

You're inventing a new language.

Not a real language with a spec and a community and tooling and editor support. A fake language that exists only inside your pipeline. A language that:

- only renders correctly in your specific setup
- requires documentation to understand
- breaks in every standard markdown renderer
- confuses every LLM that tries to read it
- has to be maintained by you forever
- will be incomprehensible to anyone who joins your project later

And the worst part? You did all of this to avoid writing a TSX component.

---

## The Real Problem With Frankenformats

It's not just that they're ugly. It's that they represent a fundamental confusion about what a content file is supposed to be.

A content file should be **durable**. Your markdown files from 2020 should be readable in 2040 without any special tooling. Pure markdown achieves this. Markdoc files from 2024 are already dependent on a renderer that may not exist in 2034.

A content file should be **portable**. You should be able to open it in any editor, render it with any parser, feed it to any LLM, publish it anywhere. Pure markdown achieves this. MDX files only work where MDX is supported.

A content file should be **readable as plain text**. This is markdown's founding principle. A plain text file with `{% if equals(1, 2) %}` in it is not readable as plain text. It's readable as Markdoc. Those are different things.

A content file should have **no logic**. Logic belongs in code. Logic has bugs. Logic has edge cases. Logic has dependencies. Your prose should not have bugs. Your documentation should not have edge cases. Your blog post should not have dependencies.

---

## The Correct Answer Has Always Been Two Files

If your content needs to do something, you have two things not one.

**The content** — pure markdown, pure prose, pure text. No logic. No components. No variables. Just meaning expressed in the simplest possible format. Readable by humans, readable by LLMs, readable by anything that has ever heard of markdown.

**The program** — a TSX file that renders the content and adds whatever interactive layer is needed. A live demo, a tabbed code switcher, a data visualization, whatever. This is code. It lives in a code file. It can be as complex as it needs to be. It has none of the constraints of a content file because it's not a content file.

```
why-no-tailwind.md       ← the essay, pure prose
ColorPickerDemo.tsx      ← the interactive demo, pure program
DocumentationPage.tsx    ← the page that composes both
```

Three files. Each one is exactly what it is. None of them are confused about their identity.

The markdown file will be readable in 30 years. The TSX file can be rewritten without touching the content. The page component can change its layout without affecting either.

This is not complicated. This is just not being lazy.

---

## On Frontmatter

Frontmatter deserves its own special mention because it's the gateway drug to frankenformats.

It starts so innocently. Just a title. Just a date. Just a slug. Fine.

Then a description. Then tags. Then author. Then related posts as an array of strings pretending to be foreign keys. Then UI hints. Then behavioral flags. Then conditional rendering instructions.

```yaml
---
title: Why No Tailwind
type: how-to
prerequisites: []
related:
  - /docs/frameworks/nextjs
install_vercel_plugin: npx plugins add vercel/vercel-plugin
for_frameworks: ['nextjs', 'sveltekit']
---
```

That last one is `install_vercel_plugin`. An npm command. In your content file's metadata. Driving UI behavior. In YAML. At the top of a markdown file.

This is app logic smuggled into content through the frontmatter door. It starts with a title and ends with a custom DSL that only your renderer understands.

The fix is not better frontmatter. The fix is a database. Metadata is relational data and relational data belongs in a database, not stapled to the top of a text file.

---

## In Summary

Markdown is for text. It is very good at being for text. Let it be for text.

TSX is for programs. It is very good at being for programs. Let it be for programs.

The gap between them is real. Bridge it with a clear architecture — content here, programs there, a pipeline that connects them — not with a proprietary syntax that turns your content files into confused hybrid monsters that are bad at both jobs.

Your markdown files should be so pure and simple that you could open them in Notepad and understand every single character. If you open a content file and see anything that looks like a programming language, you have made a mistake.

**MD is for text. TSX is for programs. This is not a hard concept. Stop making Frankenstein.**
