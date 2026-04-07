---
description: "Use when writing or editing CSS module files. Covers Tailwind @apply conventions, @reference setup, and commenting standards."
applyTo: "**/*.module.css"
---

# CSS Module Convention

## Rules

1. **Start with `@reference`** to resolve Tailwind utilities:
   ```css
   @reference "../../app/globals.css";
   ```
   Adjust the relative path to point to `src/app/globals.css` from the module's location.

2. **Use `@apply` for all Tailwind classes** inside semantic class names.

3. **Every class gets a comment** explaining what element or role it styles.

4. **Group classes by component** with a section comment when multiple components share one module file:
   ```css
   /* ─── NavMenu ─── */
   ```

5. **One CSS module per component folder.** Name it after the folder: `navbar/navbar.module.css`, `layout/layout.module.css`, etc.

## Example

```css
@reference "../../app/globals.css";

/* sticky bar across the top of the page */
.header {
  @apply border-border/40 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md;
}

/* nav link with active state highlight */
.navButton {
  @apply text-base;
}
```
