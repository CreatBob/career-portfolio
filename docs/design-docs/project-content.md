# Project Content Design

> Last regenerated: 2026-05-10

## 1 Purpose

The project case study subsystem stores long-form project details as locale-specific MDX files, renders them into localized detail pages, and exposes project summaries from MDX frontmatter for the homepage and portfolio archive route.

> Sources: `src/lib/projects.ts`, `src/app/[locale]/projects/page.tsx`, `src/app/[locale]/projects/[slug]/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`

## 2 Content Layout

Project case studies live in parallel locale directories:

| Locale  | Directory              |
| ------- | ---------------------- |
| English | `content/projects/en/` |
| Chinese | `content/projects/zh/` |

The homepage project preview and the `/[locale]/projects` archive both read project summary data directly from `src/lib/projects.ts`, and each MDX filename defines the route slug.

> Sources: `content/projects/en/`, `content/projects/zh/`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/page.tsx`, `scripts/lint-quality.mjs`

## 3 Parsing Pipeline

`getProject` chooses the locale directory, reads the MDX file, parses frontmatter with `gray-matter`, converts Markdown to HTML through the shared Markdown pipeline, and returns a typed `ProjectPost`.

> Sources: `src/lib/projects.ts`, `src/lib/blog.ts`

## 4 Route Integration

`src/app/[locale]/projects/[slug]/layout.tsx` generates localized metadata, alternates, JSON-LD, and table-of-contents chrome. `page.tsx` renders the project hero, metadata panel, highlight cards, and HTML article body.

> Sources: `src/app/[locale]/projects/[slug]/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`

## 5 Required Frontmatter

Each project case study should provide these fields:

- `title`
- `summary`
- `dates`
- `role`
- `company`
- `location`
- `category`
- `status`

Recommended optional fields:

- `order`
- `featured`
- `cover`
- `technologies`
- `links`
- `highlights`
- `updatedAt`

> Sources: `src/lib/projects.ts`, `content/projects/en/jbang-ai-knowledge-base.mdx`

## 6 Change Rules

1. Add matching slugs under `content/projects/en/` and `content/projects/zh/` unless a documented exception exists.
2. Keep required frontmatter fields present in both locales, including the same `category`.
3. Run `pnpm lint:quality` after changing project MDX files or project slugs.
4. Run `pnpm build` after changing project routes, parsing logic, or sitemap behavior.
