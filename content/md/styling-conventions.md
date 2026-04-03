# Styling Conventions

How styling works in this project — CSS modules, `cn()`, theme variables, and the rules that keep it consistent.

---

## The Core Rule: All Styles Live in CSS Modules

Every component folder has a matching `.module.css` file. No Tailwind classes in JSX — all classes go in the CSS module and are referenced via `styles.className`.

```
navbar/
  index.tsx
  nav-menu.tsx
  navbar.module.css   ← all styles for both files live here
```

### Why

- Styles are co-located and easy to find
- JSX stays readable — no long `className="flex items-center gap-2..."` strings
- One place to look when you want to change how something looks

### The Module File Format

Every CSS module follows the same structure:

```css
/* Always first — lets @apply resolve Tailwind utilities */
@reference "../../app/globals.css";

/* Section divider when the file covers multiple components */
/* ─── Navbar (index.tsx) ─────────────────────────────────────── */

/* what this element is / does */
.className {
  @apply tailwind-utilities-here;
}
```

Rules:
1. Start with `@reference "../../app/globals.css"` (path relative to the module file)
2. Every class gets a comment explaining what it styles
3. Use section dividers `/* ─── ComponentName ─── */` when multiple components share one module file
4. Use `@apply` for all Tailwind utilities — no raw CSS unless Tailwind can't express it (e.g. `font-family: var(--font-name)`)

### Real Example

```css
/* navbar/navbar.module.css */
@reference "../../app/globals.css";

/* ─── Navbar (index.tsx) ─────────────────────────────────────── */

/* the full-width sticky bar that spans the top of the page */
.header {
  @apply border-border/40 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md;
}

/* width-constrained flex row inside the header */
.inner {
  @apply mx-auto flex h-14 max-w-[640px] items-center justify-between px-4;
}

/* site name text next to the logo */
.siteTitle {
  @apply text-foreground text-lg font-semibold tracking-tight;
  font-family: var(--font-geist-sans);  /* fonts are CSS vars, not Tailwind classes */
}
```

```tsx
// navbar/index.tsx
import styles from "./navbar.module.css";

export function Navbar({ className }: { className?: string }) {
  return <header className={cn(styles.header, className)}>...</header>;
}
```

---

## `cn()` — When and How

`cn()` is `clsx` + `tailwind-merge` combined. Import from `@/lib/utils`.

**`clsx`** joins class strings together and drops falsy values (`false`, `null`, `undefined`).
**`tailwind-merge`** removes duplicate/conflicting Tailwind utilities, keeping the last one.

### When to use it

**Accepting a `className` prop** — always use `cn()` so callers can override defaults:

```tsx
// ✅ correct — external className can override styles.foo
<div className={cn(styles.foo, className)}>

// ❌ wrong — external className might conflict with styles.foo unpredictably
<div className={`${styles.foo} ${className}`}>
```

**Conditional classes** — use `cn()` to handle the logic cleanly:

```tsx
<div className={cn(styles.base, isActive && styles.active, isDisabled && styles.disabled)}>
```

**Static classes with no props** — skip `cn()`, just use a plain string or `styles.foo` directly:

```tsx
// ✅ fine — nothing dynamic, no className prop
<span className={styles.label}>
```

### The "last one wins" rule

`tailwind-merge` resolves conflicts by keeping the last utility in the argument list. This is what makes the `className` prop override pattern work:

```tsx
cn("bg-red-500", "bg-blue-500")  // → "bg-blue-500"
cn(styles.dropdownContent, className)  // → className's bg wins over styles.dropdownContent's bg
```

This is different from CSS specificity (selector weight) — it's string-level deduplication before the class even hits the browser.

### Overriding shadcn components

shadcn components all accept `className` and pass it into their own `cn()` call with defaults first. So passing `className={styles.myOverride}` always wins:

```tsx
// bg-background overrides the component's built-in bg-popover
<DropdownMenuContent className={styles.dropdownContent}>
// where .dropdownContent { @apply bg-background; }
```

---

## Theme Variables

All colors use CSS variables via Tailwind's theme system. Never hardcode a color — use semantic tokens so dark mode works automatically.

| Token | Use for |
|---|---|
| `bg-background` | page background |
| `bg-card` | elevated surfaces (cards) |
| `bg-muted` | recessed surfaces (code blocks, subtle areas) |
| `bg-popover` | floating surfaces (dropdowns, tooltips) |
| `text-foreground` | primary text |
| `text-muted-foreground` | secondary/subdued text |
| `text-primary` | accent/brand color |
| `border-border` | default borders |

Dark mode is automatic — `.dark` class on `<html>` swaps all the variable values. You never write `dark:` prefixes for color tokens, only for one-off manual overrides.

### Light mode surface hierarchy (lightness order)

```
bg-muted       0.91  ← recessed (code blocks)
bg-background  0.96  ← page
bg-card        0.985 ← elevated (cards)
bg-popover     0.985 ← floating (dropdowns)
```

Each step is visually distinct so surfaces have clear depth. Defined in `src/app/globals.css` under `:root`.

### Fonts are CSS variables, not Tailwind classes

```tsx
// ✅ correct
<span style={{ fontFamily: "var(--font-geist-sans)" }}>

// or in CSS module
.siteTitle {
  font-family: var(--font-geist-sans);
}

// ❌ wrong — no font utility classes
<span className="font-geist-sans">
```

Available font variables: `--font-geist-sans`, `--font-geist-mono`, `--font-jetbrains-mono`, `--font-sekuya`.
