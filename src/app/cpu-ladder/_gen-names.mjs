/**
 * One-time script: parse CPU names from data.ts and generate cpu-names.ts.
 * Run: node src/app/cpu-ladder/_gen-names.mjs
 * Then delete this file.
 */

import { readFileSync } from "fs";

// Extract names from data.ts
const src = readFileSync(new URL("./data.ts", import.meta.url), "utf8");
const names = [...src.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);

function parseSuffix(raw) {
  const s = raw.trim();
  if (!s) return { suffix: "", variant: "" };
  // "K Plus" → suffix K, variant Plus
  const pm = s.match(/^([A-Z]+)\s+(.+)$/);
  if (pm) return { suffix: pm[1], variant: pm[2] };
  return { suffix: s, variant: "" };
}

function parse(name) {
  let m;

  // Intel Core Ultra X NNNN...
  m = name.match(/^Intel Core Ultra (\d+) (\d+)(.*)$/);
  if (m) {
    const { suffix, variant } = parseSuffix(m[3]);
    return { corporateBrand: "Intel", productBrand: "Core", modifier: "Ultra", tier: m[1], qualifier: "", prefix: "", model: m[2], suffix, variant };
  }

  // Intel Core iX NNNN...
  m = name.match(/^Intel Core (i\d+) (\d+)(.*)$/);
  if (m) {
    const { suffix, variant } = parseSuffix(m[3]);
    return { corporateBrand: "Intel", productBrand: "Core", modifier: "", tier: m[1], qualifier: "", prefix: "", model: m[2], suffix, variant };
  }

  // Intel Processor NXXX
  m = name.match(/^Intel Processor ([A-Z])(\d+)$/);
  if (m) {
    return { corporateBrand: "Intel", productBrand: "Processor", modifier: "", tier: "", qualifier: "", prefix: m[1], model: m[2], suffix: "", variant: "" };
  }

  // AMD Ryzen Threadripper NNNNX
  m = name.match(/^AMD Ryzen Threadripper (\d+)(.*)$/);
  if (m) {
    const { suffix, variant } = parseSuffix(m[2]);
    return { corporateBrand: "AMD", productBrand: "Ryzen", modifier: "Threadripper", tier: "", qualifier: "", prefix: "", model: m[1], suffix, variant };
  }

  // AMD Ryzen X Pro NNNN...
  m = name.match(/^AMD Ryzen (\d+) Pro (\d+)(.*)$/);
  if (m) {
    const { suffix, variant } = parseSuffix(m[3]);
    return { corporateBrand: "AMD", productBrand: "Ryzen", modifier: "", tier: m[1], qualifier: "Pro", prefix: "", model: m[2], suffix, variant };
  }

  // AMD Ryzen X NNNN...
  m = name.match(/^AMD Ryzen (\d+) (\d+)(.*)$/);
  if (m) {
    const { suffix, variant } = parseSuffix(m[3]);
    return { corporateBrand: "AMD", productBrand: "Ryzen", modifier: "", tier: m[1], qualifier: "", prefix: "", model: m[2], suffix, variant };
  }

  // Apple MX Ultra/Pro/Max
  m = name.match(/^Apple (M\d+)\s*(.*)$/);
  if (m) {
    return { corporateBrand: "Apple", productBrand: m[1], modifier: m[2] || "", tier: "", qualifier: "", prefix: "", model: "", suffix: "", variant: "" };
  }

  console.error("UNMATCHED:", name);
  return null;
}

// Build output
const entries = [];
for (const name of names) {
  const p = parse(name);
  if (!p) continue;
  entries.push({ name, ...p });
}

// Verify no misses
const unmatched = names.length - entries.length;
if (unmatched > 0) {
  console.error(`WARNING: ${unmatched} names unmatched`);
}

// Generate TS
const fields = ["corporateBrand", "productBrand", "modifier", "tier", "qualifier", "prefix", "model", "suffix", "variant"];

let ts = `/**
 * Structured CPU name parts — each segment of the product name broken out.
 * Generated from data.ts names. Do not hand-edit; regenerate with _gen-names.mjs.
 */

export type CpuNameParts = {
  corporateBrand: string;  // "Intel" | "AMD" | "Apple"
  productBrand: string;    // "Core" | "Ryzen" | "Processor" | "M3"
  modifier: string;        // "Ultra" | "Threadripper" | ""
  tier: string;            // "i9" | "i7" | "i5" | "i3" | "9" | "7" | "5" | "3" | ""
  qualifier: string;       // "Pro" | ""
  prefix: string;          // "N" | "" (model number prefix, e.g. N-series)
  model: string;           // "14900" | "9950" | "150" | ""
  suffix: string;          // "K" | "KF" | "KS" | "F" | "X" | "X3D" | "XT" | "G" | "T" | ""
  variant: string;         // "Plus" | ""
};

/** Lookup: full CPU name → structured parts */
export const cpuNames: Record<string, CpuNameParts> = {\n`;

for (const e of entries) {
  const vals = fields.map((f) => `${f}: ${JSON.stringify(e[f])}`).join(", ");
  ts += `  ${JSON.stringify(e.name)}: { ${vals} },\n`;
}

ts += `};\n`;

process.stdout.write(ts);
