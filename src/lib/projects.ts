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

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMetadata {
  title: string;
  summary: string;
  dates: string;
  role: string;
  company: string;
  location: string;
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

export interface ProjectPost {
  metadata: ProjectMetadata;
  slug: string;
  source: string;
  locale: string;
}

export function isPublishedProject(
  project: ProjectPost | null | undefined,
): project is ProjectPost {
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
    .use(rehypeStringify)
    .process(markdown);

  return parsed.toString();
}

export async function getProject(
  slug: string,
  locale: string = "en",
): Promise<ProjectPost | null> {
  const filePath = path.join(getContentDirectory(locale), `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: rawMetadata } = matter(source);
  const content = await markdownToHTML(rawContent);

  const metadata: ProjectMetadata = {
    ...rawMetadata,
    title: rawMetadata.title || "",
    summary: rawMetadata.summary || "",
    dates: rawMetadata.dates || "",
    role: rawMetadata.role || "",
    company: rawMetadata.company || "",
    location: rawMetadata.location || "",
    status: rawMetadata.status || "draft",
    order:
      typeof rawMetadata.order === "number" ? rawMetadata.order : undefined,
    featured: Boolean(rawMetadata.featured),
    cover:
      typeof rawMetadata.cover === "string" ? rawMetadata.cover : undefined,
    technologies: Array.isArray(rawMetadata.technologies)
      ? (rawMetadata.technologies as string[])
      : [],
    links: Array.isArray(rawMetadata.links)
      ? (rawMetadata.links as ProjectLink[])
      : [],
    highlights: Array.isArray(rawMetadata.highlights)
      ? (rawMetadata.highlights as string[])
      : [],
    updatedAt:
      typeof rawMetadata.updatedAt === "string"
        ? rawMetadata.updatedAt
        : undefined,
  };

  return {
    metadata,
    slug,
    source: content,
    locale,
  };
}

async function getAllProjects(
  dir: string,
  locale: string = "en",
): Promise<ProjectPost[]> {
  const mdxFiles = getMDXFiles(dir);
  const projects = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = path.basename(file, path.extname(file));
      const project = await getProject(slug, locale);
      return project;
    }),
  );

  return projects.filter((project): project is ProjectPost => project !== null);
}

function sortProjects(projects: ProjectPost[]) {
  return [...projects].sort((left, right) => {
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

export async function getProjects(
  locale: string = "en",
): Promise<ProjectPost[]> {
  try {
    const projects = await getAllProjects(getContentDirectory(locale), locale);
    return sortProjects(projects);
  } catch (error) {
    console.error(`Error getting projects for locale ${locale}:`, error);
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
