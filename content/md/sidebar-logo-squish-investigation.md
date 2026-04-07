# Sidebar Logo Squish Investigation

## The Problem

When the sidebar collapses to icon-only mode, the logo image gets horizontally squished/compressed. All Lucide SVG icons remain perfect at their intended size. Only the logo (an `<Image>` / `<img>` tag) gets squeezed.

## Root Cause: `<svg>` vs `<img>`

The shadcn sidebar button CVA base string includes:

```
[&>svg]:size-4 [&>svg]:shrink-0
```

This targets **direct child `<svg>` elements** — every Lucide icon renders as an inline `<svg>`, so they all get locked to a fixed size that cannot shrink.

The logo goes through Next.js `<Image>`, which renders as `<img>` (not `<svg>`). The `[&>svg]` selector **does not match `<img>`**. So the logo has no fixed size constraint and no `shrink-0` protection — it participates in normal flex layout and gets compressed when the container shrinks.

**This is the entire problem.** Everything else is a consequence of this mismatch.

## Why `siteConfig` Makes This Harder

The `siteConfig.logo` pattern introduces indirection:

```tsx
const logoSrc = siteConfig.logo.png ?? siteConfig.logo.svg;
// Then conditionally:
logoSrc ? <Image src={logoSrc} ... /> : <span>{emoji}</span>
```

This means:
1. **You can't know the element type at design time** — it could be `<Image>` (renders as `<img>`) or `<span>` (emoji fallback), depending on config values.
2. **The CSS must handle both cases** — `[&>img]` for the Image path, something else for the emoji span.
3. **Debugging requires checking site-config.ts first** to know which branch is active, then tracing through to see what HTML element actually renders.
4. **The abstraction hides the real DOM** — you think "logo" but the CSS cares about whether it's `<svg>`, `<img>`, or `<span>`.

If the logo were just hardcoded as `<LogoIcon />` (an SVG component), it would get `[&>svg]:size-4` for free and this entire investigation wouldn't exist.

## The Specificity Chain — Every Layer That Fights You

### Layer 1: Sidebar container width

```
SIDEBAR_WIDTH_ICON = "3.5rem" (56px)
```

The outermost constraint. When collapsed, the entire sidebar (and everything inside it) can only be 56px wide. This is the hard ceiling.

**Relevant elements:**
- `sidebar-gap` div: `group-data-[collapsible=icon]:w-(--sidebar-width-icon)`
- `sidebar-container` div: `group-data-[collapsible=icon]:w-(--sidebar-width-icon)`

### Layer 2: SidebarContent overflow

```
SidebarContent: group-data-[collapsible=icon]:overflow-hidden
```

Clips anything that extends beyond the sidebar width when collapsed. This prevents text labels from visually overflowing, but it also clips any image or highlight that's wider than the available space.

**Note:** The logo is in `SidebarHeader`, not `SidebarContent`, so this layer doesn't directly affect it. But it does affect the nav button icons and their hover highlights.

### Layer 3: SidebarGroup / SidebarMenu min-w-0

```
SidebarGroup:  relative flex w-full min-w-0 flex-col p-2
SidebarMenu:   flex w-full min-w-0 flex-col gap-1
```

`min-w-0` allows flex children to shrink below their content size. This cascades down — even if a child has `shrink-0`, the *parent* can still collapse if its parent allows it via `min-w-0`.

### Layer 4: SidebarHeader / SidebarFooter padding

```
SidebarHeader: flex flex-col gap-2 p-2
SidebarFooter: flex flex-col gap-2 p-2
```

`p-2` = 8px on each side = 16px eaten from available width. With a 56px sidebar, that leaves 40px for content.

### Layer 5: Button CVA base (the main battleground)

**Original shadcn defaults:**
```
group-data-[collapsible=icon]:size-8!   → 32x32 with !important
group-data-[collapsible=icon]:p-2!      → 8px padding with !important
overflow-hidden                          → clips content that overflows
[&>svg]:size-4                           → locks SVG icons to 16px
[&>svg]:shrink-0                         → prevents SVG icons from flexing
```

**What we've modified so far:**
- Removed `!` from `size-8` and `p-2` (so CSS modules can override)
- Removed `overflow-hidden` (so content isn't clipped)
- Removed `group-data-[collapsible=icon]:size-8` and `group-data-[collapsible=icon]:p-2` entirely (so collapsed buttons aren't forced to 32px)

**What remains:**
- `[&>svg]:size-4 [&>svg]:shrink-0` — still only targets SVGs, not images

### Layer 6: CSS Module overrides (sidebar.module.css)

```css
.navButton {
  @apply text-foreground/70 text-base h-10 p-2.5 [&>svg]:size-5 [&>img]:size-8 [&>img]:shrink-0;
}

:global([data-collapsible="icon"]) .navButton {
  @apply w-full;
}
```

- `.navButton` bumps SVG icons to `size-5` (20px) via `[&>svg]:size-5`
- `[&>img]:size-8 [&>img]:shrink-0` attempts to lock images — but this hasn't stopped the squish

### Layer 7: Next.js `<Image>` internals

Next.js `<Image>` doesn't just render a bare `<img>`. It adds:
- Inline `width` and `height` attributes (from props)
- Inline styles for aspect ratio and sizing
- A wrapper in some configurations

These inline styles can override CSS class-based sizing because **inline styles have higher specificity than class selectors** (unless you use `!important`).

## What We've Tried

| # | Approach | Result | Why it failed |
|---|----------|--------|---------------|
| 1 | `gap-3` on `.navMenu` | Created dead space between click targets | Gap is between items, not inside them |
| 2 | CSS module `:global([data-collapsible="icon"]) .navButton { height/width/padding !important }` | No visible effect | Selector may not have matched, or inline styles from Image won |
| 3 | Bump `SIDEBAR_WIDTH_ICON` from `3rem` to `3.5rem` | Sidebar wider but logo still squished | More space doesn't help if the button itself constrains |
| 4 | Remove `!` from `size-8!` and `p-2!` in CVA | Allows CSS module overrides | Necessary step but not sufficient alone |
| 5 | Remove `group-data-[collapsible=icon]:size-8` and `p-2` from CVA entirely | Buttons no longer forced to 32px | Logo still squished by other layers |
| 6 | Remove `overflow-hidden` from CVA | Content not clipped | Logo still squished (flex compression, not clipping) |
| 7 | `shrink-0` on `.logoImg` | No effect | Parent has `min-w-0`, which overrides child `shrink-0` |
| 8 | `[&>img]:size-5 [&>img]:shrink-0` on `.navButton` | No effect | Next.js `<Image>` inline styles may override class-based sizing |
| 9 | Plain `<img>` instead of `<Image>` | Didn't work | Still subject to flex compression from parent chain |
| 10 | Inline SVG component (`LogoIcon`) | Would work (gets `[&>svg]` treatment) | User didn't want inlined SVG path data |
| 11 | `w-full` on collapsed `.navButton` | Button stretches to fill space | Doesn't prevent content inside from compressing |

## The Untried Fix

The cleanest solution that we haven't fully executed:

**Use SVGR to import the SVG file as a React component:**

```bash
npm install @svgr/webpack
```

```ts
// next.config.ts
webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });
  return config;
}
```

```tsx
import LogoIcon from '/public/logo.svg';
// Renders as <svg> — gets [&>svg]:size-5 for free
```

This makes the logo a real `<svg>` element, identical to Lucide icons. Zero specificity battles. The `[&>svg]` selectors apply automatically.

**Alternative: hardcode the SVG as a component file** at `src/components/sidebar/logo-icon.tsx` — same result, no build config changes, just slightly messier to maintain if the logo changes.
