#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "src");

const allowedImports = {
  "app-api": new Set(["data", "i18n", "lib"]),
  app: new Set(["components", "components-icons", "data", "i18n", "lib"]),
  "components-ui": new Set(["lib"]),
  components: new Set(["components", "components-icons", "data", "i18n", "lib"]),
  lib: new Set(["data", "i18n", "components-icons"]),
  i18n: new Set(["data", "i18n"]),
  data: new Set(["data"]),
  proxy: new Set(["i18n"]),
};

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".next", "node_modules", "dist", "build"].includes(entry.name)) continue;
      files.push(...walk(full));
      continue;
    }
    if (/\.(ts|tsx|js|jsx|mts|mjs)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function toRepoPath(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function sourceZone(repoPath) {
  if (repoPath === "src/proxy.ts") return "proxy";
  if (repoPath.startsWith("src/app/api/")) return "app-api";
  if (repoPath.startsWith("src/app/")) return "app";
  if (repoPath.startsWith("src/components/ui/")) return "components-ui";
  if (repoPath.startsWith("src/components/")) return "components";
  if (repoPath.startsWith("src/lib/")) return "lib";
  if (repoPath.startsWith("src/i18n/")) return "i18n";
  if (repoPath.startsWith("src/data/")) return "data";
  return null;
}

function targetZone(importPath) {
  if (importPath === "@/components/icons") return "components-icons";
  if (importPath.startsWith("@/components/")) return "components";
  if (importPath.startsWith("@/data/")) return "data";
  if (importPath.startsWith("@/i18n/")) return "i18n";
  if (importPath.startsWith("@/lib/")) return "lib";
  if (importPath.startsWith("@/app/")) return "app";
  return null;
}

function extractAliasImports(source) {
  const imports = [];
  const importRe = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["'](@\/[^"']+)["']/g;
  let match;
  while ((match = importRe.exec(source))) imports.push(match[1]);
  return imports;
}

function violationMessage(file, fromZone, importPath, toZone) {
  const allowed = [...(allowedImports[fromZone] ?? [])].sort().join(", ") || "no app aliases";
  return [
    `${file} imports ${importPath}.`,
    `Source zone "${fromZone}" may import: ${allowed}.`,
    `Target zone "${toZone}" is outside that boundary.`,
    "Fix options:",
    "1. Move the shared code to an allowed lower-level module.",
    "2. Pass data through props or function parameters instead of importing upward.",
    "3. If this is a real architecture exception, document it in docs/ARCHITECTURE.md and update scripts/lint-deps.mjs.",
  ].join("\n  ");
}

const violations = [];
for (const file of walk(sourceRoot)) {
  const repoPath = toRepoPath(file);
  const fromZone = sourceZone(repoPath);
  if (!fromZone) continue;
  const source = fs.readFileSync(file, "utf8");
  for (const importPath of extractAliasImports(source)) {
    const toZone = targetZone(importPath);
    if (!toZone) continue;
    if (!allowedImports[fromZone]?.has(toZone)) {
      violations.push(violationMessage(repoPath, fromZone, importPath, toZone));
    }
  }
}

if (violations.length > 0) {
  console.error(`Found ${violations.length} dependency boundary violation(s):\n`);
  console.error(violations.map((v, i) => `${i + 1}. ${v}`).join("\n\n"));
  process.exit(1);
}

console.log("Dependency boundaries are valid.");
