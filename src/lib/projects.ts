import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { rehypeContentImages } from "./content-images";

export interface ProjectLink {
  label: string;
  href: string;
}

export const PROJECT_CATEGORIES = [
  "ai-app",
  "business-system",
  "internal-tool",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectMetadata {
  title: string;
  summary: string;
  dates: string;
  role: string;
  company: string;
  location: string;
  category: ProjectCategory;
  status?: string;
  order?: number;
  featured?: boolean;
  cover?: string;
  technologies?: string[];
  links?: ProjectLink[];
  highlights?: string[];
  updatedAt?: string;
  [key: string]: unknown;
}

interface ProjectRecordBase {
  metadata: ProjectMetadata;
  slug: string;
  locale: string;
}

export type ProjectSummary = ProjectRecordBase;

export interface ProjectPost extends ProjectRecordBase {
  source: string;
}

function isProjectCategory(value: unknown): value is ProjectCategory {
  return (
    typeof value === "string" &&
    PROJECT_CATEGORIES.includes(value as ProjectCategory)
  );
}

function normalizeProjectMetadata(rawMetadata: Record<string, unknown>) {
  const title =
    typeof rawMetadata.title === "string" ? rawMetadata.title : "";
  const summary =
    typeof rawMetadata.summary === "string" ? rawMetadata.summary : "";
  const dates =
    typeof rawMetadata.dates === "string" ? rawMetadata.dates : "";
  const role = typeof rawMetadata.role === "string" ? rawMetadata.role : "";
  const company =
    typeof rawMetadata.company === "string" ? rawMetadata.company : "";
  const location =
    typeof rawMetadata.location === "string" ? rawMetadata.location : "";
  const status =
    typeof rawMetadata.status === "string" ? rawMetadata.status : "draft";
  const technologies = Array.isArray(rawMetadata.technologies)
    ? (rawMetadata.technologies as string[])
    : [];
  const links = Array.isArray(rawMetadata.links)
    ? (rawMetadata.links as ProjectLink[])
    : [];
  const highlights = Array.isArray(rawMetadata.highlights)
    ? (rawMetadata.highlights as string[])
    : [];

  const metadata: ProjectMetadata = {
    ...rawMetadata,
    title,
    summary,
    dates,
    role,
    company,
    location,
    category: isProjectCategory(rawMetadata.category)
      ? rawMetadata.category
      : "internal-tool",
    status,
    order:
      typeof rawMetadata.order === "number" ? rawMetadata.order : undefined,
    featured: Boolean(rawMetadata.featured),
    cover:
      typeof rawMetadata.cover === "string" ? rawMetadata.cover : undefined,
    technologies,
    links,
    highlights,
    updatedAt:
      typeof rawMetadata.updatedAt === "string"
        ? rawMetadata.updatedAt
        : undefined,
  };

  return metadata;
}

function sortProjects<T extends ProjectRecordBase>(projects: T[]) {
  return [...projects].sort((left, right) => {
    const featuredDelta = Number(Boolean(right.metadata.featured)) -
      Number(Boolean(left.metadata.featured));

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    const leftOrder =
      typeof left.metadata.order === "number"
        ? left.metadata.order
        : Number.MAX_SAFE_INTEGER;
    const rightOrder =
      typeof right.metadata.order === "number"
        ? right.metadata.order
        : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.metadata.title.localeCompare(right.metadata.title);
  });
}

function parseProjectFile(
  slug: string,
  locale: string,
): { metadata: ProjectMetadata; rawContent: string } | null {
  const filePath = path.join(getContentDirectory(locale), `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: rawMetadata } = matter(source);

  return {
    metadata: normalizeProjectMetadata(rawMetadata),
    rawContent,
  };
}

export function isPublishedProject<T extends ProjectRecordBase | null | undefined>(
  project: T,
): project is Exclude<T, null | undefined> {
  return Boolean(project && project.metadata.status === "published");
}

function getContentDirectory(locale: string) {
  return path.join(
    process.cwd(),
    "content",
    "projects",
    locale === "zh" ? "zh" : "en",
  );
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

async function markdownToHTML(markdown: string) {
  const parsed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypeContentImages)
    .use(rehypeStringify)
    .process(markdown);

  return parsed.toString();
}

export async function getProject(
  slug: string,
  locale: string = "en",
): Promise<ProjectPost | null> {
  const parsed = parseProjectFile(slug, locale);

  if (!parsed) {
    return null;
  }

  const content = await markdownToHTML(parsed.rawContent);

  return {
    metadata: parsed.metadata,
    slug,
    source: content,
    locale,
  };
}

async function getAllProjectSummaries(
  dir: string,
  locale: string = "en",
): Promise<ProjectSummary[]> {
  const mdxFiles = getMDXFiles(dir);
  const projects = mdxFiles
    .map((file) => {
      const slug = path.basename(file, path.extname(file));
      const parsed = parseProjectFile(slug, locale);

      if (!parsed) {
        return null;
      }

      return {
        metadata: parsed.metadata,
        slug,
        locale,
      };
    })
    .filter((project): project is ProjectSummary => project !== null);

  return projects;
}

export async function getProjectSummaries(
  locale: string = "en",
): Promise<ProjectSummary[]> {
  try {
    const projects = await getAllProjectSummaries(
      getContentDirectory(locale),
      locale,
    );
    return sortProjects(projects);
  } catch (error) {
    console.error(`Error getting projects for locale ${locale}:`, error);
    return [];
  }
}

export async function getPublishedProjectSummaries(
  locale: string = "en",
): Promise<ProjectSummary[]> {
  const projects = await getProjectSummaries(locale);
  return projects.filter(isPublishedProject);
}

export async function getProjects(
  locale: string = "en",
): Promise<ProjectPost[]> {
  try {
    const summaries = await getProjectSummaries(locale);
    const projects = await Promise.all(
      summaries.map((project) => getProject(project.slug, locale)),
    );

    return projects.filter((project): project is ProjectPost => project !== null);
  } catch (error) {
    console.error(`Error getting full projects for locale ${locale}:`, error);
    return [];
  }
}

export async function getPublishedProjects(
  locale: string = "en",
): Promise<ProjectPost[]> {
  const projects = await getProjects(locale);
  return projects.filter(isPublishedProject);
}

export async function getAvailableProjectLocales(
  slug: string,
  locales: string[],
): Promise<string[]> {
  const availableLocales: string[] = [];

  for (const locale of locales) {
    const project = await getProject(slug, locale);
    if (isPublishedProject(project)) {
      availableLocales.push(locale);
    }
  }

  return availableLocales;
}
