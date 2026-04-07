# jaygriff-v2 — File Tree

```
jaygriff-v2/
│
├── .cline/
│   └── skills/
│       └── build-ui/
│           └── SKILL.md                          # Cline AI skill — UI assembly instructions
│
├── .clinerules                                   # Cline AI assistant rules (mirrors copilot-instructions)
│
├── .github/
│   └── copilot-instructions.md                   # GitHub Copilot project rules — stack, golden rules, conventions
│
├── .vscode/
│   ├── settings.json                             # VS Code workspace settings
│   └── tailwind.css-data.json                    # Tailwind CSS IntelliSense custom data
│
├── content/
│   └── md/
│       ├── admin-auth-plan.md                    # Doc: passkey auth design (passwordless.dev + jose)
│       ├── admin-ui-plan.md                      # Doc: admin UI plan (simple password → passkeys roadmap)
│       ├── block-model-architecture.md           # Doc: block model schema, WYSIWYG, vector search plan
│       ├── content-pipeline-deep-dive.md         # Doc: how the file → Turso sync pipeline works
│       ├── market-statistic.md                   # Post: market statistics content
│       ├── notes.md                              # Doc: early architecture notes
│       ├── projects-architecture.md              # Doc: projects-as-first-class-entities design
│       └── styling-conventions.md                # Doc: CSS module patterns and cn() usage
│
├── public/
│   ├── favicon.ico                               # Site favicon
│   └── Sekuya-Regular.ttf                        # Custom display font
│
├── raw/
│   └── notes.md                                  # Scratch notes — filesystem → Turso pipeline planning
│
├── scripts/
│   ├── generate-metadata.ts                      # Uses Claude API + Zod to generate title/slug/tags from markdown
│   ├── inspect-dates.ts                          # Debug script — dumps slug + updated_dates from Turso
│   ├── migrate.ts                                # Creates/migrates the content table schema in Turso
│   └── sync-content.ts                           # Walks content/md/, diffs against Turso, inserts/updates rows
│
├── src/
│   ├── site-config.ts                            # Single source of truth — site name, URL, logo, SEO metadata
│   ├── middleware.ts                             # JWT auth check on /admin/* routes, redirects to login
│   │
│   ├── actions/
│   │   ├── auth.ts                               # Server Action: verify password → sign JWT → set cookie
│   │   └── content.ts                            # Server Action: toggle content status (draft/published/archived)
│   │
│   ├── app/
│   │   ├── fonts.ts                              # Font definitions (Geist, Geist Mono, JetBrains Mono, Sekuya)
│   │   ├── globals.css                           # Tailwind v4 config, oklch theme variables, base styles
│   │   ├── layout.tsx                            # Root layout — ThemeProvider, SidebarProvider, fonts
│   │   ├── page.tsx                              # Homepage (minimal)
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.module.css                  # Admin layout styles
│   │   │   ├── layout.tsx                        # Admin shell — header bar with sign out button
│   │   │   ├── page.tsx                          # Redirects /admin → /admin/content
│   │   │   ├── content/
│   │   │   │   ├── content.module.css            # Content list page styles
│   │   │   │   ├── page.tsx                      # All content table — title, type, status, date
│   │   │   │   └── status-badge.tsx              # Clickable status badge — toggles draft/published/archived
│   │   │   └── login/
│   │   │       ├── login.module.css              # Login page styles
│   │   │       └── page.tsx                      # Password form — authenticates admin
│   │   │
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── signout/
│   │   │           └── route.ts                  # POST handler — clears session cookie
│   │   │
│   │   ├── docs/
│   │   │   ├── page.tsx                          # Docs listing — all published docs from Turso
│   │   │   └── [slug]/
│   │   │       ├── doc.module.css                # Doc detail page styles
│   │   │       └── page.tsx                      # Single doc page — fetches by slug, renders markdown
│   │   │
│   │   ├── posts/
│   │   │   ├── page.tsx                          # Posts listing — all published posts from Turso
│   │   │   └── [slug]/
│   │   │       ├── post.module.css               # Post detail page styles
│   │   │       └── page.tsx                      # Single post page — fetches by slug, renders markdown
│   │   │
│   │   ├── examples/
│   │   │   ├── page.tsx                          # Examples index — links to all demo pages
│   │   │   ├── article/
│   │   │   │   └── page.tsx                      # Example: article layout demo
│   │   │   ├── blocks/
│   │   │   │   └── page.tsx                      # Example: UI component showcase (cards, badges, alerts)
│   │   │   ├── design/
│   │   │   │   └── page.tsx                      # Example: design system demo
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx                      # Example: image gallery layout
│   │   │   ├── gallery2/
│   │   │   │   └── page.tsx                      # Example: alternate gallery layout
│   │   │   ├── landing/
│   │   │   │   └── page.tsx                      # Example: landing page layout
│   │   │   ├── math-revolution/
│   │   │   │   ├── decks.ts                      # Flashcard deck data for math demo
│   │   │   │   └── page.tsx                      # Example: interactive math flashcard game
│   │   │   ├── shadcn/
│   │   │   │   └── page.tsx                      # Example: shadcn/ui component catalog
│   │   │   ├── skill-test/
│   │   │   │   ├── interactive-playground.tsx     # Client component: interactive skill test widget
│   │   │   │   └── page.tsx                      # Example: AI skill test page
│   │   │   └── typography/
│   │   │       └── page.tsx                      # Example: typography system showcase
│   │   │
│   │   └── og/
│   │       └── route.tsx                         # Dynamic OG image generation (social previews)
│   │
│   ├── components/
│   │   ├── mode-toggle.tsx                       # Light/dark/system dropdown toggle (next-themes)
│   │   ├── theme-provider.tsx                    # next-themes ThemeProvider wrapper
│   │   │
│   │   ├── layout/
│   │   │   ├── Container.module.css              # Container styles — max-width, padding, margins
│   │   │   └── Container.tsx                     # Content width wrapper used by all pages
│   │   │
│   │   ├── markdown-renderer/
│   │   │   ├── markdown-renderer.module.css      # Markdown renderer styles
│   │   │   └── MarkdownRenderer.tsx              # Maps react-markdown to custom typography components
│   │   │
│   │   ├── navbar/
│   │   │   ├── index.tsx                         # Navbar component (replaced by sidebar, still exists)
│   │   │   ├── nav-menu.tsx                      # Hamburger dropdown menu with nav routes + theme toggle
│   │   │   ├── navbar.module.css                 # Navbar styles
│   │   │   └── routes.ts                         # Nav link definitions (Home, Posts, Docs, Examples)
│   │   │
│   │   ├── sidebar/
│   │   │   ├── index.tsx                         # App sidebar — collapsible icon/expanded modes, nav items
│   │   │   └── sidebar.module.css                # Sidebar styles
│   │   │
│   │   ├── typography/
│   │   │   ├── index.ts                          # Barrel export for all typography components
│   │   │   ├── Blockquote.tsx                    # <blockquote> with left border, italic
│   │   │   ├── Bold.tsx                          # <strong> font-bold
│   │   │   ├── H1.tsx                            # <h1> heading
│   │   │   ├── H2.tsx                            # <h2> heading
│   │   │   ├── H3.tsx                            # <h3> heading
│   │   │   ├── H4.tsx                            # <h4> heading
│   │   │   ├── H5.tsx                            # <h5> heading
│   │   │   ├── H6.tsx                            # <h6> heading
│   │   │   ├── Highlight.tsx                     # <mark> with primary background tint
│   │   │   ├── InlineCode.tsx                    # <code> JetBrains Mono, bg-muted, border
│   │   │   ├── Italic.tsx                        # <em> italic
│   │   │   ├── Link.tsx                          # Next.js Link wrapper — text-primary, underline
│   │   │   ├── List.tsx                          # <ul>/<ol> — pass ordered for numbered
│   │   │   ├── ListItem.tsx                      # <li> list item
│   │   │   ├── Paragraph.tsx                     # <p> text-base leading-relaxed
│   │   │   ├── Small.tsx                         # <small> text-sm text-muted-foreground
│   │   │   ├── Strikethrough.tsx                 # <s> line-through
│   │   │   ├── Text.tsx                          # <span> no default styles, inline fragment
│   │   │   └── Underline.tsx                     # <span> underline with offset
│   │   │
│   │   └── ui/                                   # shadcn/ui components (Radix-based, new-york style)
│   │       ├── accordion.tsx                     # Collapsible accordion
│   │       ├── alert-dialog.tsx                  # Modal confirmation dialog
│   │       ├── alert.tsx                         # Inline alert banner
│   │       ├── aspect-ratio.tsx                  # Fixed aspect ratio container
│   │       ├── avatar.tsx                        # User avatar with fallback
│   │       ├── badge.tsx                         # Small label/tag
│   │       ├── breadcrumb.tsx                    # Breadcrumb navigation
│   │       ├── button-group.tsx                  # Grouped button row
│   │       ├── button.tsx                        # Button with variants (default, outline, ghost, etc.)
│   │       ├── calendar.tsx                      # Date picker calendar
│   │       ├── card.tsx                          # Card container with header/content/footer
│   │       ├── carousel.tsx                      # Scrollable carousel
│   │       ├── chart.tsx                         # Chart wrapper (recharts)
│   │       ├── checkbox.tsx                      # Checkbox input
│   │       ├── collapsible.tsx                   # Collapsible section
│   │       ├── combobox.tsx                      # Searchable select dropdown
│   │       ├── command.tsx                       # Command palette (⌘K style)
│   │       ├── context-menu.tsx                  # Right-click context menu
│   │       ├── dialog.tsx                        # Modal dialog
│   │       ├── direction.tsx                     # RTL/LTR direction provider
│   │       ├── drawer.tsx                        # Slide-out drawer panel
│   │       ├── dropdown-menu.tsx                 # Dropdown menu
│   │       ├── empty.tsx                         # Empty state placeholder
│   │       ├── field.tsx                         # Form field wrapper
│   │       ├── form.tsx                          # Form with react-hook-form + zod
│   │       ├── hover-card.tsx                    # Hover-triggered popover card
│   │       ├── input-group.tsx                   # Input with prefix/suffix addons
│   │       ├── input-otp.tsx                     # One-time password input
│   │       ├── input.tsx                         # Text input
│   │       ├── item.tsx                          # Generic list item
│   │       ├── kbd.tsx                           # Keyboard shortcut badge
│   │       ├── label.tsx                         # Form label
│   │       ├── menubar.tsx                       # Horizontal menu bar
│   │       ├── native-select.tsx                 # Native <select> dropdown
│   │       ├── navigation-menu.tsx               # Multi-level navigation menu
│   │       ├── pagination.tsx                    # Page navigation controls
│   │       ├── popover.tsx                       # Click-triggered popover
│   │       ├── progress.tsx                      # Progress bar
│   │       ├── radio-group.tsx                   # Radio button group
│   │       ├── resizable.tsx                     # Resizable panel layout
│   │       ├── scroll-area.tsx                   # Custom scrollbar container
│   │       ├── select.tsx                        # Styled select dropdown
│   │       ├── separator.tsx                     # Horizontal/vertical divider
│   │       ├── sheet.tsx                         # Slide-out sheet (mobile-friendly drawer)
│   │       ├── sidebar.tsx                       # Sidebar container with collapsible + cookie persistence
│   │       ├── skeleton.tsx                      # Loading skeleton placeholder
│   │       ├── slider.tsx                        # Range slider
│   │       ├── sonner.tsx                        # Toast notifications (sonner)
│   │       ├── spinner.tsx                       # Loading spinner
│   │       ├── switch.tsx                        # Toggle switch
│   │       ├── table.tsx                         # Data table
│   │       ├── tabs.tsx                          # Tab panels
│   │       ├── textarea.tsx                      # Multi-line text input
│   │       ├── toggle-group.tsx                  # Grouped toggle buttons
│   │       ├── toggle.tsx                        # Single toggle button
│   │       └── tooltip.tsx                       # Hover tooltip
│   │
│   ├── hooks/
│   │   └── use-mobile.ts                         # Hook: detects mobile viewport (< 768px)
│   │
│   └── lib/
│       ├── content.ts                            # DB queries — getContentBySlug, getAllPublished, getAllContent
│       ├── registry.ts                           # Component registry — source of truth for AI agents
│       ├── turso.ts                              # Turso (libsql) client initialization
│       └── utils.ts                              # cn() utility — clsx + tailwind-merge
│
├── .env.local                                    # Environment variables (gitignored)
├── .gitignore                                    # Git ignore rules
├── components.json                               # shadcn/ui configuration
├── eslint.config.mjs                             # ESLint flat config
├── next-env.d.ts                                 # Next.js TypeScript declarations (auto-generated)
├── next.config.ts                                # Next.js configuration
├── package.json                                  # Dependencies and scripts
├── package-lock.json                             # Lockfile
├── postcss.config.mjs                            # PostCSS config (Tailwind plugin)
├── README.md                                     # Project readme
└── tsconfig.json                                 # TypeScript configuration
```
