# Blueprint: The Dynamic AI-Driven Content Engine

This document outlines the architecture, data models, and workflow paradigms discussed for building a modern, local-first web publishing engine. By treating interactive React code as a structured data asset, this architecture bridges the gap between collaborative web apps and traditional developer environments.

---

## 1. The Paradigm Evolution: Document Models Compared

To understand why this architecture treats code as data, we must look at how modern web platforms represent structural files compared to legacy formats.

| System / Format | Core Data Model | Layout Strategy | Collaborative / Real-time Sync | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Microsoft Word (DOCX)** | Zipped archive of cross-referenced, deeply nested XML files (`w:document`, `w:styles`). | **Layout-dependent.** Embeds hard-coded page geometry and local printer properties. | Brittle. Overlapping edits easily corrupt XML tags. | Legacy desktop document processing. |
| **Google Docs** | **Linear text stream** mapped to index byte offsets + global formatting trees. | **Layout-agnostic.** Tracks semantic data; re-pagination occurs purely on the client canvas. | High-performance via Operational Transformation (OT) tracking index shifts. | Continuous narrative-heavy editing (essays, legal briefs). |
| **Notion** | A nested tree or graph of independent **JSON Block objects** tracked by Unique IDs. | **Modular.** Allows drag-and-drop structural updates and grid column layouts. | Eventual consistency syncing independent block mutations. | Dashboards, modular wikis, layout-heavy page builders. |
| **Your Engine** | **Raw executable code strings (`.tsx`)** paired with inline `metadata` export objects. | **Dynamic Runtime Compiling.** Renders components straight into the DOM with custom scope. | Single-Author/AI publishing. Zero build-step deployment latency. | **AI-driven, database-backed web apps and custom pages.** |

---

## 2. System Architecture & The Environment Matrix

The core feature of this platform is the environment split (`NODE_ENV`). It treats your local workspace as the development workspace while relying on an edge-cached cloud layer for production delivery.

```
[Local Development Mode (NODE_ENV = 'development')]
Local VS Code ──► Saved .tsx File ──► Next.js Local File Watcher ──► Localhost Browser (Instant Hot-Reload)

[Production Deployment Mode (NODE_ENV = 'production')]
Turso Edge DB (libSQL) ──► JSON Payload with Code String ──► Client Browser ──► In-Browser Compilation Canvas
```

### The Catch-All Router Logic
Your catchment route (`src/app/[...slug]/page.tsx`) shifts its data sourcing engine automatically:

1. **Development (`development`):** The engine reads directly from your hard drive (`/dynamic-content/[slug].tsx`) using Node’s file system (`fs`). It executes a dynamic `import()` to cleanly pull your metadata constants out without manual parsing.
2. **Production (`production`):** The engine executes a single-digit millisecond query to your **Turso DB** instance to fetch the pre-saved string payload.

---

## 3. Client Compiling & The Component Scope Map

To prevent users from having to download large `npm install` packages at runtime, the engine utilizes a **pre-bundled scope configuration**.

### How Bundle Sizes Stay Compressed (~150 KB total)
The core design system assets are downloaded and cached by the client browser **only once**:
* **React Core Engine:** ~30-35 KB (Gzipped)
* **Pre-bundled shadcn UI Primitives:** ~40-60 KB (Gzipped, compiled down from clean Radix primitives)
* **Scoped Lucide Icons & Tailwind CSS Utility Sets:** ~30 KB (Gzipped)

### The Component Scope Matrix (`src/components/DynamicScope.tsx`)
```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading1, Paragraph } from '@/components/typography';
import * as LucideIcons from 'lucide-react';

export const COMPONENT_SCOPE = {
  React,
  useState,
  useEffect,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Heading1,
  Paragraph,
  ...LucideIcons
};
```

---

## 4. The Single Source of Truth: Colocated Metadata

To eliminate data fragmentation, your metadata configuration and your interactive component code remain housed inside **one single file**. This allows your AI assistant to read and write changes within a unified file context.

### Avoided Antipatterns
* ❌ **CSS Modules:** Avoided because sidecar `.module.css` modules require pre-compilation hashing steps that crash client-side runtimes. (Tailwind is used inline instead).
* ❌ **Separate JSON Configuration Files:** Avoided because separating the parameters requires double the database queries and fractures the AI prompt workspace.

### Final Approved File Schema
```tsx
// dynamic-content/tools/calculator.tsx

export const metadata = {
  title: "Crypto Yield Multiplier",
  description: "Calculate compound interest instantly from the edge.",
};

export default function Calculator() {
  const [val, setVal] = React.useState(10);
  return (
    <Card className="p-6">
      <Button onClick={() => setVal(val * 2)}>Multiply Yield: {val}</Button>
    </Card>
  );
}
```

---

## 5. Automated Sync Operations (`scripts/publish.mjs`)

When a component is finalized locally via VS Code, an automated sync script reads the TypeScript file, evaluates the live `metadata` object using Node's native module engine, and pushes the text string cleanly up into your database.

```javascript
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const [, , slugPath] = process.argv;
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function publish() {
  const absolutePath = path.join(process.cwd(), 'dynamic-content', `${slugPath}.tsx`);
  const rawCodeText = fs.readFileSync(absolutePath, 'utf8');

  // Cache-busting dynamic import to evaluate the metadata parameters natively
  const fileModule = await import(`${absolutePath}?update=${Date.now()}`);
  const { title, description } = fileModule.metadata || {};

  await turso.execute({
    sql: `INSERT INTO pages (slug, title, description, code, status) 
          VALUES (?, ?, ?, ?, 'published')
          ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, code=excluded.code;`,
    args: [slugPath, title, description || "", rawCodeText],
  });

  console.log(`🚀 "${title}" successfully pushed to Turso at /${slugPath}!`);
}

publish().catch(console.error);
```

---
*This configuration creates an optimal operational loop: You write type-checked code inside an IDE, the native Next.js server handles instant local re-rendering, and the Turso pipeline manages global publishing dynamically.*