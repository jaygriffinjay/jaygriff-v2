#!/usr/bin/env node

/**
 * new-post.js
 *
 * Deterministic file-creation step for the post-creator skill.
 * Given a title, writes a new .tsx post file into content/tsx/ with a
 * pre-filled template. Does nothing fuzzy — same input always produces
 * the same path and the same shape of file.
 *
 * Usage:
 *   node .github/skills/post-creator/scripts/new-post.js "My New Post Title"
 *
 * Run from the repo root — content/tsx/ is resolved from process.cwd().
 */

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(process.cwd(), "content", "tsx");

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* Title → PascalCase React component name, prefixed if it would start with a digit. */
function componentName(title) {
  const pascal = title
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  return /^[0-9]/.test(pascal) ? `Post${pascal}` : pascal || "Post";
}

/* Title and date are not emitted here — the route renders those from the DB. */
function buildTemplate({ title }) {
  return `import { Paragraph } from "@/components/typography";

export default function ${componentName(title)}() {
  return (
    <>
      <Paragraph>Start writing here.</Paragraph>
    </>
  );
}
`;
}

function createPost(rawTitle) {
  if (!rawTitle || !rawTitle.trim()) {
    throw new Error(
      'Title is required, e.g. node .github/skills/post-creator/scripts/new-post.js "My Post Title"'
    );
  }

  const title = rawTitle.trim();
  const slug = slugify(title);
  const date = todayISODate();
  const filename = `${date}-${slug}.tsx`;
  const filePath = path.join(POSTS_DIR, filename);

  if (fs.existsSync(filePath)) {
    throw new Error(`File already exists at ${filePath} — refusing to overwrite.`);
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(filePath, buildTemplate({ title }), "utf8");

  return filePath;
}

if (require.main === module) {
  const titleArg = process.argv.slice(2).join(" ");
  try {
    const filePath = createPost(titleArg);
    console.log(filePath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { createPost, slugify, todayISODate };