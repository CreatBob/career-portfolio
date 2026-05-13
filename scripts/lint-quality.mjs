#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function exists(...parts) {
  return fs.existsSync(repoPath(...parts));
}

function readJson(...parts) {
  return JSON.parse(fs.readFileSync(repoPath(...parts), "utf8"));
}

function flattenKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return [prefix];
  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(child, next);
  });
}

function markdownFileCount(dir) {
  if (!exists(dir)) return 0;
  return fs.readdirSync(repoPath(dir)).filter((name) => name.endsWith(".md"))
    .length;
}

function mdxSlugs(dir) {
  if (!exists(dir)) return [];
  return fs
    .readdirSync(repoPath(dir))
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""))
    .sort();
}

function readFrontmatter(file) {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] || "";
}

function projectCategoryMap(locale) {
  const dir = repoPath("content", "projects", locale);
  if (!fs.existsSync(dir)) return new Map();

  return new Map(
    fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => {
        const slug = name.replace(/\.mdx$/, "");
        const frontmatter = readFrontmatter(path.join(dir, name));
        const categoryMatch = frontmatter.match(/^category:\s*"?(.*?)"?\s*$/m);
        return [slug, categoryMatch?.[1] || ""];
      }),
  );
}

function isLocalPublicAssetReference(value) {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  );
}

function normalizePublicAssetPath(value) {
  return value.split(/[?#]/, 1)[0].replace(/^\/+/, "");
}

function collectMarkdownImageReferences(source) {
  const matches = source.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g);
  const references = [];

  for (const match of matches) {
    const assetPath = match[1];
    if (isLocalPublicAssetReference(assetPath)) {
      references.push(assetPath);
    }
  }

  return references;
}

function collectHtmlImageReferences(source) {
  const matches = source.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  const references = [];

  for (const match of matches) {
    const assetPath = match[1];
    if (isLocalPublicAssetReference(assetPath)) {
      references.push(assetPath);
    }
  }

  return references;
}

function collectFrontmatterAssetReferences(frontmatter, fieldNames) {
  const references = [];

  for (const fieldName of fieldNames) {
    const match = frontmatter.match(
      new RegExp(`^${fieldName}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"),
    );
    const assetPath = match?.[1]?.trim();

    if (isLocalPublicAssetReference(assetPath)) {
      references.push(assetPath);
    }
  }

  return references;
}

function validateMdxAssetReferences(dir, options = {}) {
  if (!exists(dir)) return;

  const frontmatterFields = options.frontmatterFields || [];
  const files = fs
    .readdirSync(repoPath(dir))
    .filter((name) => name.endsWith(".mdx"))
    .sort();

  for (const name of files) {
    const filePath = repoPath(dir, name);
    const source = fs.readFileSync(filePath, "utf8");
    const frontmatter = readFrontmatter(filePath);
    const references = new Set([
      ...collectMarkdownImageReferences(source),
      ...collectHtmlImageReferences(source),
      ...collectFrontmatterAssetReferences(frontmatter, frontmatterFields),
    ]);

    for (const reference of references) {
      const assetPath = normalizePublicAssetPath(reference);

      if (!exists("public", assetPath)) {
        failures.push(
          [
            `${path.relative(root, filePath)} references a missing local asset.`,
            `Missing asset: /${assetPath}.`,
            "Fix options:",
            "1. Add the file under public/ so the path resolves at runtime.",
            "2. Update the MDX image path or frontmatter reference to the correct asset.",
          ].join("\n  "),
        );
      }
    }
  }
}

function compareSets(label, leftName, left, rightName, right) {
  const rightSet = new Set(right);
  const leftSet = new Set(left);
  const leftOnly = left.filter((item) => !rightSet.has(item));
  const rightOnly = right.filter((item) => !leftSet.has(item));
  if (leftOnly.length || rightOnly.length) {
    failures.push(
      [
        `${label} mismatch.`,
        `${leftName} only: ${leftOnly.join(", ") || "none"}.`,
        `${rightName} only: ${rightOnly.join(", ") || "none"}.`,
        "Fix options:",
        `1. Add the missing entries to ${leftName} or ${rightName}.`,
        "2. If the mismatch is intentional, document the exception and adjust this linter.",
      ].join("\n  "),
    );
  }
}

const requiredFiles = [
  "AGENTS.md",
  "docs/ARCHITECTURE.md",
  "docs/DEVELOPMENT.md",
  "docs/QUALITY.md",
  "docs/design-docs/i18n-routing.md",
  "docs/design-docs/blog-content.md",
  "docs/design-docs/project-content.md",
  "docs/design-docs/analytics-api.md",
  "harness/config/environment.json",
  "scripts/lint-deps.mjs",
  "scripts/lint-quality.mjs",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    failures.push(
      `${file} is missing. Create it or update scripts/lint-quality.mjs if the harness structure changed.`,
    );
  }
}

if (exists("AGENTS.md")) {
  const lineCount = fs
    .readFileSync(repoPath("AGENTS.md"), "utf8")
    .trimEnd()
    .split(/\r?\n/).length;
  if (lineCount < 80 || lineCount > 120) {
    failures.push(
      `AGENTS.md has ${lineCount} lines. Keep it between 80 and 120 lines so it stays a navigation map, not a manual.`,
    );
  }
}

if (markdownFileCount("docs/design-docs") < 3) {
  failures.push(
    "docs/design-docs should contain at least three component design documents. Add docs for major subsystems.",
  );
}

for (const namespace of ["common", "personal", "collections"]) {
  const en = flattenKeys(
    readJson("src", "i18n", "messages", "en", `${namespace}.json`),
  ).sort();
  const zh = flattenKeys(
    readJson("src", "i18n", "messages", "zh", `${namespace}.json`),
  ).sort();
  compareSets(`i18n namespace ${namespace}`, "en", en, "zh", zh);
}

compareSets(
  "blog slug parity",
  "content/blog/en",
  mdxSlugs("content/blog/en"),
  "content/blog/zh",
  mdxSlugs("content/blog/zh"),
);

compareSets(
  "project slug parity",
  "content/projects/en",
  mdxSlugs("content/projects/en"),
  "content/projects/zh",
  mdxSlugs("content/projects/zh"),
);

const enProjectSlugs = mdxSlugs("content/projects/en");
const enProjectCategories = projectCategoryMap("en");
const zhProjectCategories = projectCategoryMap("zh");
const validProjectCategories = new Set([
  "ai-app",
  "business-system",
  "internal-tool",
]);

for (const locale of ["en", "zh"]) {
  const categoryMap =
    locale === "en" ? enProjectCategories : zhProjectCategories;

  for (const [slug, category] of categoryMap.entries()) {
    if (!validProjectCategories.has(category)) {
      failures.push(
        [
          `content/projects/${locale}/${slug}.mdx must define a valid category.`,
          `Found: ${category || "missing"}.`,
          "Allowed values: ai-app, business-system, internal-tool.",
        ].join("\n  "),
      );
    }
  }
}

for (const slug of enProjectSlugs) {
  if (enProjectCategories.get(slug) !== zhProjectCategories.get(slug)) {
    failures.push(
      [
        `project category parity mismatch for slug ${slug}.`,
        `en: ${enProjectCategories.get(slug) || "missing"}.`,
        `zh: ${zhProjectCategories.get(slug) || "missing"}.`,
        "Fix options:",
        "1. Keep project category aligned between locale files.",
        "2. If the mismatch is intentional, document the exception and adjust this linter.",
      ].join("\n  "),
    );
  }
}

validateMdxAssetReferences("content/blog/en");
validateMdxAssetReferences("content/blog/zh");
validateMdxAssetReferences("content/projects/en", {
  frontmatterFields: ["cover"],
});
validateMdxAssetReferences("content/projects/zh", {
  frontmatterFields: ["cover"],
});

if (exists("harness/config/environment.json")) {
  const envConfig = readJson("harness", "config", "environment.json");
  if (envConfig.version !== "2.0") {
    failures.push(
      "harness/config/environment.json must use schema version 2.0.",
    );
  }
  if (envConfig.scripts?.verify) {
    failures.push(
      "Do not add a static verify script to environment.json. Verification is generated at task runtime.",
    );
  }
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} quality issue(s):\n`);
  console.error(
    failures.map((failure, i) => `${i + 1}. ${failure}`).join("\n\n"),
  );
  process.exit(1);
}

console.log("Harness quality checks passed.");
