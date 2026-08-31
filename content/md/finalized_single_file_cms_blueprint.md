# Finalized Architecture Blueprint: Single-File "Code-as-Data" CMS
## Tech Stack: Next.js App Router, Turso DB (libSQL), React-Runner

This document outlines the lightweight, high-performance architecture for treating interactive React components as database rows. By enforcing a **single-file colocated convention**, we eliminate complex compilation tooling (like Esbuild/Rollup) and allow the database to act as the ultimate source of truth, while your local editor functions as a temporary workspace console.

---

## 1. Architectural Philosophy
* **Database as Source of Truth:** Pages, components, and logic exist globally as rows in Turso.
* **Transient Local Editing:** Local `.tsx` files are temporary containers generated on-the-fly for editing with your AI assistant, then pushed back to the cloud.
* **Zero Compilation Overhead:** By using native React `<style>` blocks with standard CSS rules, we bypass CSS Module hashing complexities entirely.

---

## 2. The Unified Single-File Pattern
Every dynamic webpage lives in a single `.tsx` file. It houses the structural **metadata object**, the **interactive React component state logic**, and **commented layout styles**.

```tsx
// dynamic-content/tools/crypto-multiplier.tsx

export const metadata = {
  title: "Crypto Yield Multiplier",
  description: "Calculate compound interest instantly from the edge.",
};

export default function Calculator() {
  const [val, setVal] = React.useState(10);
  
  return (
    <div className="calculator-card">
      <h3 className="calculator-title">Dynamic Yield Console</h3>
      <p className="calculator-text">Adjust your parameters below to see changes.</p>
      
      <button className="multiplier-btn" onClick={() => setVal(val * 2)}>
        Multiply Yield: {val}
      </button>

      {/* Structured, well-commented CSS colocated in the file */}
      <style>{`
        /* Core wrapper styling */
        .calculator-card {
          background: #0f172a;
          border: 1px solid #334155;
          padding: 1.5rem;
          border-radius: 0.75rem;
          color: #f8fafc;
        }
        
        .calculator-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        /* Interactive trigger element formatting */
        .multiplier-btn {
          background-color: #3b82f6;
          color: white;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          margin-top: 1rem;
          transition: background-color 0.2s;
        }
        .multiplier-btn:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
```

---

## 3. The Two-Way Database Bridge (Scripts)

Place these automation scripts in your `scripts/` directory. They require zero external bundling dependencies and rely entirely on native Node.js and your Turso client.

### Script A: Pushing Local Files to Turso (`scripts/publish.mjs`)
Run this command from your terminal when you finish editing a local file to make it live globally:
`node scripts/publish.mjs dynamic-content/tools/crypto-multiplier.tsx`

```javascript
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const [, , relativeFilePath] = process.argv;
if (!relativeFilePath) {
  console.error("❌ Please provide a file path (e.g., dynamic-content/tools/calc.tsx)");
  process.exit(1);
}

const absolutePath = path.resolve(relativeFilePath);
// Transforms 'dynamic-content/tools/calc.tsx' -> 'tools/calc'
const slug = relativeFilePath.replace('dynamic-content/', '').replace('.tsx', '');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function publish() {
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found at: ${absolutePath}`);
    process.exit(1);
  }

  // Read code string directly for the database
  const rawCode = fs.readFileSync(absolutePath, 'utf8');

  // Dynamically import the module to extract metadata properties
  const fileModule = await import(`${absolutePath}?update=${Date.now()}`);
  const { title, description } = fileModule.metadata || {};

  if (!title) {
    console.error("❌ Sync aborted: Missing an exported \`metadata.title\` object.");
    process.exit(1);
  }

  await turso.execute({
    sql: \`
      INSERT INTO pages (slug, title, description, code, status) 
      VALUES (?, ?, ?, ?, 'published')
      ON CONFLICT(slug) DO UPDATE SET 
        title = excluded.title, 
        description = excluded.description, 
        code = excluded.code;
    \`,
    args: [slug, title, description || "", rawCode],
  });

  console.log(\`🚀 /\${slug} successfully pushed to Turso Cloud!\`);
}

publish().catch(console.error);
```

### Script B: Pulling Database Rows Locally (`scripts/pull.mjs`)
Run this command to download an existing page code string from Turso into your local workspace for immediate editing:
`node scripts/pull.mjs tools/crypto-multiplier`

```javascript
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const [, , slug] = process.argv;
if (!slug) {
  console.error("❌ Please provide a slug path to pull (e.g., tools/calc)");
  process.exit(1);
}

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function pull() {
  const result = await turso.execute({
    sql: 'SELECT code FROM pages WHERE slug = ? LIMIT 1',
    args: [slug],
  });

  if (result.rows.length === 0) {
    console.error(\`❌ No page row found matching slug: /\${slug}\`);
    process.exit(1);
  }

  const codeString = result.rows.code;
  const targetPath = path.join(process.cwd(), 'dynamic-content', \`\${slug}.tsx\`);

  // Ensure directories exist recursively
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  
  // Write the code string out as a working local TSX file
  fs.writeFileSync(targetPath, codeString, 'utf8');
  console.log(\`📥 Downloaded /\${slug} cleanly into your local workspace directory!\`);
}

pull().catch(console.error);
```

---

## 4. Next.js Routing & Dynamic Execution Setup

### The Component Scope Map (`src/components/DynamicScope.tsx`)
Maps what pre-bundled system elements the browser runtime is allowed to tap into when executing the incoming code strings.

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  ...LucideIcons
};
```

### The Catch-All Route Pipeline (`src/app/[...slug]/page.tsx`)
Runs server-side at the edge, checks your current environment context, pulls from the file system (\`fs\`) if in dev mode, or handles an optimal edge-fetch from Turso in production.

```typescript
import { createClient } from '@libsql/client';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { ReactRunner } from 'react-runner';
import { COMPONENT_SCOPE } from '@/components/DynamicScope';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DynamicCatchAllPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');

  let title = "";
  let description = "";
  let codeString = "";

  // 1. DEV MODE: READ LIVE FROM FILE SYSTEM
  if (process.env.NODE_ENV === 'development') {
    const localFilePath = path.join(process.cwd(), 'dynamic-content', \`\${slugPath}.tsx\`);
    
    if (fs.existsSync(localFilePath)) {
      codeString = fs.readFileSync(localFilePath, 'utf8');
      const fileModule = await import(\`@/../dynamic-content/\${slugPath}.tsx\`);
      title = fileModule.metadata?.title || "Local Dev Mode";
      description = fileModule.metadata?.description || "";
    }
  }

  // 2. PRODUCTION MODE: STREAM OVER THE WIRE FROM TURSO
  if (!codeString) {
    const result = await turso.execute({
      sql: 'SELECT title, description, code FROM pages WHERE slug = ? AND status = "published" LIMIT 1',
      args: [slugPath],
    });

    if (result.rows.length === 0) notFound();

    const page = result.rows;
    title = page.title as string;
    description = page.description as string;
    codeString = page.code as string;
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <header className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">\${title}</h1>
        <p className="text-slate-500 mt-2">\${description}</p>
      </header>

      {/* Dynamic runtime compiler processing the string container */}
      <div className="runtime-canvas mt-4">
        <ReactRunner code={codeString} scope={COMPONENT_SCOPE} />
      </div>
    </main>
  );
}
```