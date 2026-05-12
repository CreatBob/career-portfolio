# Project Content Design

> Last regenerated: 2026-05-10

## 1 Purpose

The project case study subsystem stores long-form project details as locale-specific MDX files, renders them into localized detail pages, and keeps homepage project cards linked to those slugs through `collections.json`.

> Sources: `src/lib/projects.ts`, `src/app/[locale]/projects/[slug]/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`, `src/i18n/messages/en/collections.json`

## 2 Content Layout

Project case studies live in parallel locale directories:

| Locale  | Directory              |
| ------- | ---------------------- |
| English | `content/projects/en/` |
| Chinese | `content/projects/zh/` |

Homepage project cards still read translated summary data from `src/i18n/messages/{en,zh}/collections.json`, and each listed project must include a `slug` that matches the MDX filename.

> Sources: `content/projects/en/`, `content/projects/zh/`, `src/app/[locale]/page.tsx`, `scripts/lint-quality.mjs`

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
2. Add the same slug to `src/i18n/messages/en/collections.json` and `src/i18n/messages/zh/collections.json` so homepage cards can link to the detail page.
3. Keep required frontmatter fields present in both locales.
4. Run `pnpm lint:quality` after changing project MDX files or project slugs.
5. Run `pnpm build` after changing project routes, parsing logic, or sitemap behavior.
