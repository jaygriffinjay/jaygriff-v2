---
description: "Use when writing or editing TSX components, pages, or layouts under src/. Covers styling conventions for JSX files."
applyTo: "src/**/*.tsx"
---

# TSX Styling Convention

Applies to **components, pages, and layouts under `src/`** — anything that defines UI. Content files in `content/tsx/` are prose, not components, and follow `content-tsx.instructions.md` instead.

**No inline Tailwind class strings in JSX.** All Tailwind classes live in a co-located `.module.css` file and are referenced via `styles.className`.

## Rules

1. **Import the CSS module** at the top: `import styles from "./component-name.module.css";`
2. **Use `className={styles.foo}`** on elements — never `className="bg-red-500 p-4"`.
3. **Use `cn()` to merge external `className` props:** `cn(styles.foo, className)` so callers can override.
4. **Create the CSS module if it doesn't exist.** One per component folder, named after the folder.

## Example

```tsx
import styles from "./navbar.module.css";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  return <header className={cn(styles.header, className)}>...</header>;
}
```
