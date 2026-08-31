# Architectural Blueprint: Single-File "Code-as-Data" CMS
## Scaling Relational Context Beyond Isolated Sandbox Environments

---

## 1. Executive Summary & Paradigm Shift
This architecture introduces a web-first content layer that treats fully interactive React components—complete with internal state logic, hooks, parameters, and structured layout styles—as flat text strings inside a database. By adopting a **Single-File Colocated Pattern**, we bypass heavy build-time bundlers or complex runtime CSS compilers while enabling rapid AI-assisted development inside your local code editor.

### The System Heritage (Google Docs vs. Notion vs. Your CMS)
*   **DOCX (Legacy Desktop Era):** Tech debt wrapped in a zip archive of fragmented XML files. It carries decades of legacy printing bloat, making it layout-dependent and completely hostile to concurrent real-time syncing.
*   **Google Docs (Cloud Collaborative Era):** An engineering masterpiece optimized for real-time collaboration. It abandons traditional document structures for a flat, linear index stream of characters, using Operational Transformation (OT) to resolve multi-user changes via absolute integer offsets.
*   **Notion (Modular Web Era):** Treats structured documents as an array of discrete, independent, database-backed JSON "block" nodes that can be nested or mapped dynamically across data relations.
*   **Your CMS Architecture:** Takes the best parts of each era. It treats full, logic-heavy interactive application modules as single, flat text rows inside an edge database. It keeps your files structured like high-fidelity code, but lets you distribute them as lightweight data elements over a network.

---

## 2. Compounding Technical Power: The Lovable.dev Tradeoff
Modern AI platforms like Lovable automate app generation by spinning up full, isolated repository containers for every single prompt. While powerful for rapid prototyping from scratch, this containerized silo architecture hits a definitive evolutionary ceiling:
1.  **The Relationship Deficit (Isolated Islands):** Code created in an isolated repo container cannot naturally interact with other pages. You cannot perform cross-cutting relational database queries, join structures, or easily link elements together into an overarching content model.
2.  **The Deployment Tax:** Modifying simple logic requires waiting minutes for a full repository to rebuild, a container to spin up, and global edge routing to update.
3.  **The Blueprint Value (Compound Interest):** In your system, your local repository acts as the evolving framework, and the database acts as a frictionless delivery pipeline. When you refine your custom design system or add new layout elements to your core codebase, your AI assistant instantly gains the ability to leverage those skills globally. Your dynamic pages get more complicated, sophisticated, and integrated over time, rather than starting from scratch every single build.

---

## 3. Resolving the "Tailwind Soup" & Data-Drift Traps
*   **Why No CSS Modules?** CSS Modules require a build-time step to hash class names (e.g., transforming `.card` to `.card_a8f9x`) and output a companion configuration mapping object. Attempting to parse sidecar `.module.css` files at runtime inside a browser creates massive engine complexity.
*   **The Single-File Style Solution:** By writing standard CSS rules inside a native React `<style>` tag directly inside your `.tsx` file, you preserve your highly organized, well-commented styling convention without cluttering your tags with inline Tailwind utility classes.
*   **Database as the Source of Truth:** Managing files across Git while using the database as a file vault introduces synchronization errors and ghost files when directories or names change. By treating your **Turso Edge Database** as the absolute source of truth and your local file system as a transient, temporary editor console, you achieve an elegant, error-free workflow.

---

## 4. The Single-File Structural Code Pattern

Every page exists as an individual text file. It colocates your structural parameters, state mechanics, and fully commented layout styles.

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
      <p className="calculator-text">Adjust your parameters below to see changes live.</p>
      
      <button className="multiplier-btn" onClick={() => setVal(val * 2)}>
        Multiply Yield: {val}
      </button>

      {/* Clean, structured, well-commented CSS colocated in the file */}
      <style>{`
        /* Core wrapper layout element */
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

## 5. The Two-Way Database Bridge Scripts

Save these scripts inside your `scripts/` directory as `.mjs` files to enable native ES module loading and dynamic file evaluation.

### Script A: Pushing to the Edge (`scripts/publish.mjs`)
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

  const rawCode = fs.readFileSync(absolutePath, 'utf8');

  // Dynamic import with cache busting string allows real-time re-evaluation
  const fileModule = await import(`${absolutePath}?update=${Date.now()}`);
  const { title, description } = fileModule.metadata || {};

  if (!title) {
    console.error("❌ Sync aborted: The component lacks an exported metadata.title object.");
    process.exit(1);
  }

  await turso.execute({
    sql: `
      INSERT INTO pages (slug, title, description, code, status) 
      VALUES (?, ?, ?, ?, 'published')
      ON CONFLICT(slug) DO UPDATE SET 
        title = excluded.title, 
        description = excluded.description, 
        code = excluded.code;
    `,
    args: [slug, title, description || "", rawCode],
  });

  console.log(`🚀 /${slug} successfully pushed to Turso Cloud!`);
}

publish().catch(console.error);
```

### Script B: Pulling to the Console (`scripts/pull.mjs`)
`node scripts/pull.mjs tools/crypto-multiplier`

```javascript
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const [, , slug] = process.argv;
if (!slug) {
  console.error("❌ Please provide a valid slug to pull down (e.g., tools/calc)");
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
    console.error(`❌ No database row found matching slug: /${slug}`);
    process.exit(1);
  }

  const codeString = result.rows[0].code;
  const targetPath = path.join(process.cwd(), 'dynamic-content', `${slug}.tsx`);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, codeString, 'utf8');
  console.log(`📥 Downloaded /${slug} cleanly into your local workspace directory!`);
}

pull().catch(console.error);
```

---

## 6. Runtime Next.js & Turso Routing Layout

### The Catch-All Route Execution Matrix (`src/app/[...slug]/page.tsx`)
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

export default async function CatchAllDynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');

  let title = "";
  let description = "";
  let codeString = "";

  // 1. LOCAL DEVELOPMENT SPEED RUN (Read from local file system)
  if (process.env.NODE_ENV === 'development') {
    const localFilePath = path.join(process.cwd(), 'dynamic-content', `${slugPath}.tsx`);
    
    if (fs.existsSync(localFilePath)) {
      codeString = fs.readFileSync(localFilePath, 'utf8');
      const fileModule = await import(`@/../dynamic-content/${slugPath}.tsx`);
      title = fileModule.metadata?.title || "Local Dev Workspace";
      description = fileModule.metadata?.description || "";
    }
  }

  // 2. PRODUCTION LIVE DELIVERY (Fetch payload from Turso Edge)
  if (!codeString) {
    const result = await turso.execute({
      sql: 'SELECT title, description, code FROM pages WHERE slug = ? AND status = "published" LIMIT 1',
      args: [slugPath],
    });

    if (result.rows.length === 0) notFound();

    const page = result.rows[0];
    title = page.title as string;
    description = page.description as string;
    codeString = page.code as string;
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <header className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-2">{description}</p>
      </header>

      {/* Browser runtime evaluation and instantiation */}
      <div className="runtime-canvas-frame mt-4">
        <ReactRunner code={codeString} scope={COMPONENT_SCOPE} />
      </div>
    </main>
  );
}
```