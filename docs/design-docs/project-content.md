# Project Content Design

> Last regenerated: 2026-05-10

## 1 Purpose

The project case study subsystem stores long-form project details as locale-specific MDX files, renders them into localized detail pages, normalizes standalone body images into styled figure blocks, and exposes project summaries from MDX frontmatter for the homepage and portfolio archive route.

> Sources: `src/lib/projects.ts`, `src/lib/content-images.ts`, `src/app/[locale]/projects/page.tsx`, `src/app/[locale]/projects/[slug]/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`

## 2 Content Layout

Project case studies live in parallel locale directories:

| Locale  | Directory              |
| ------- | ---------------------- |
| English | `content/projects/en/` |
| Chinese | `content/projects/zh/` |

The homepage project preview and the `/[locale]/projects` archive both read project summary data directly from `src/lib/projects.ts`, and each MDX filename defines the route slug.

> Sources: `content/projects/en/`, `content/projects/zh/`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/page.tsx`, `scripts/lint-quality.mjs`

## 3 Parsing Pipeline

`getProject` chooses the locale directory, reads the MDX file, parses frontmatter with `gray-matter`, converts Markdown to HTML through the shared Markdown pipeline, applies the shared content-image transformer, and returns a typed `ProjectPost`.

> Sources: `src/lib/projects.ts`, `src/lib/content-images.ts`

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

## 6 Body Images And Covers

Project case study body content uses the same Markdown image controls as blog posts:

```md
![Knowledge ingestion workflow](/projects/images/jbang-ai-knowledge-base/workflow.webp)
![Operations dashboard summary](/projects/images/jbang-ai-knowledge-base/dashboard.webp "size=md")
![Cross-team system overview](/projects/images/jbang-ai-knowledge-base/overview.webp "layout=wide")
![Task progress panel](/projects/images/jbang-ai-knowledge-base/progress.webp "caption=任务进度面板|size=sm")
```

Supported options:

- `size=sm|md|lg`
- `layout=inline|wide`
- `caption=off`
- `caption=...` using `|` separators when the caption contains spaces

For new case studies, prefer storing body assets under `public/projects/images/<slug>/`.

Cover guidance:

- Keep `cover` as a local `public/` path when the archive card needs a specific image.
- Prefer a `16:9` asset around `1600 x 900` or `1920 x 1080`.
- Use `.webp` for screenshots/photos and `.png` when the design contains tiny text or transparency.

## 7 Change Rules

1. Add matching slugs under `content/projects/en/` and `content/projects/zh/` unless a documented exception exists.
2. Keep required frontmatter fields present in both locales, including the same `category`.
3. Put new local body images under `public/projects/images/<slug>/` and keep local `cover` paths inside `public/`.
4. Run `pnpm lint:quality` after changing project MDX files, project slugs, local covers, or body images so missing asset paths are caught early.
5. Run `pnpm build` after changing project routes, parsing logic, or sitemap behavior.
