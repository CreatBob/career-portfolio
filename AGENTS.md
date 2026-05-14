# Career Portfolio Agent Guide

This file is the entry map for AI agents working in this repository. Keep it short, current, and linked to deeper docs.

## 1 Quick Start

1. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before changing imports, routing, content loading, or i18n.
2. Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) before running local commands or touching environment variables.
3. Run `pnpm lint`, `pnpm lint:deps`, and `pnpm lint:quality` before handoff.
4. Use `pnpm build` for release-risk changes, route changes, content parsing changes, metadata, or analytics work.
5. Do not hardcode secrets. See [harness/config/environment.json](harness/config/environment.json).

## 2 Project Shape

| Area            | Path                            | Purpose                                                             |
| --------------- | ------------------------------- | ------------------------------------------------------------------- |
| App routes      | `src/app/`                      | Next.js App Router pages, layouts, metadata, API routes             |
| Components      | `src/components/`               | UI, portfolio sections, blog rendering, third-party script wrappers |
| Blog content    | `content/blog/`                 | English and Chinese MDX blog posts                                  |
| Project content | `content/projects/`             | English and Chinese MDX project case studies                        |
| I18n            | `src/i18n/`                     | Locale routing and request message loading                          |
| Data            | `src/data/`                     | Site-wide constants and portfolio config                            |
| Domain helpers  | `src/lib/`                      | Blog/project parsing, JSON-LD, metadata, icon mapping, utilities    |
| Static assets   | `public/`                       | Images, resume, blog assets, icons                                  |
| Harness         | `harness/`, `scripts/`, `docs/` | Agent documentation, environment contract, mechanical checks        |

## 3 Architecture Rules

1. `src/app/api/` routes may import `src/data`, `src/i18n`, and `src/lib`; keep React components out of API routes.
2. `src/app/` UI routes may compose components, data, i18n, and lib helpers.
3. `src/components/` may import other components, `src/data`, `src/i18n`, and `src/lib`.
4. `src/components/ui/` should stay primitive and may import `src/lib/utils`.
5. `src/lib/` may import `src/data` and `src/i18n`; the only component import allowed from lib is `@/components/icons`.
6. `src/i18n/` may import itself and `src/data`.
7. `src/data/` is a leaf and should not import application code.
8. These rules are enforced by `scripts/lint-deps.mjs`.

## 4 Common Workflows

1. Add profile, work, or section list data: edit `src/i18n/messages/{en,zh}/personal.json` or `collections.json`.
2. Add a blog post: add matching slugs under `content/blog/en/` and `content/blog/zh/` unless intentionally locale-specific.
3. Add a project case study: add matching slugs under `content/projects/en/` and `content/projects/zh/`, and keep required frontmatter plus `category` aligned across locales.
4. Add a route: create it under `src/app/[locale]/` unless it is a locale-neutral API or metadata route.
5. Add UI primitives: place reusable shadcn-style primitives under `src/components/ui/`.
6. Add section-level UI: place feature components under `src/components/portfolio/`, `src/components/blog/`, or `src/components/blocks/`.
7. Add analytics behavior: keep credentials server-side in `src/app/api/analytics/route.ts`.
8. Update SEO behavior: review `src/lib/metadata.ts`, `src/lib/jsonld.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts`.

## 5 Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm lint:deps
pnpm lint:quality
pnpm build
pnpm harness:verify
```

`pnpm harness:verify` runs the agent harness checks. It does not replace `pnpm build` for release-risk changes.

## 6 Documentation Map

| Section | Document                                                      | Use it for                                                |
| ------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| 6.1     | [Architecture](docs/ARCHITECTURE.md)                          | System boundaries, dependency graph, data flow            |
| 6.2     | [Development](docs/DEVELOPMENT.md)                            | Install, commands, environment, CI                        |
| 6.3     | [Quality](docs/QUALITY.md)                                    | Review standards and mechanical checks                    |
| 6.4     | [I18n Design](docs/design-docs/i18n-routing.md)               | Locale routing, message loading, nav helpers              |
| 6.5     | [Blog Content Design](docs/design-docs/blog-content.md)       | Blog MDX loading, feeds, rendering                        |
| 6.6     | [Project Content Design](docs/design-docs/project-content.md) | Project case study MDX loading, slug rules, detail routes |
| 6.7     | [Analytics Design](docs/design-docs/analytics-api.md)         | GA4 API route and env handling                            |
| 6.8     | [Content Workflow](docs/CONTENT_WORKFLOW.md)                  | End-to-end process for writing and publishing portfolio content |

## 7 Environment

Required only for GA4 analytics endpoint:

- `GA4_PROPERTY_ID`
- `GA4_CLIENT_EMAIL`
- `GA4_PRIVATE_KEY`

Optional third-party and platform variables:

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_BAIDU_SITE_VERIFICATION`
- `VERCEL_ENV`

## 8 Guardrails

1. Keep generated docs grounded in source file references.
2. Preserve pnpm as the package manager because `pnpm-lock.yaml` is committed.
3. Keep i18n key parity between `src/i18n/messages/en` and `src/i18n/messages/zh`.
4. Keep blog slug parity between `content/blog/en` and `content/blog/zh` unless docs explain the exception.
5. Keep project slug parity between `content/projects/en` and `content/projects/zh`, and keep required frontmatter such as `category` aligned across locales.
6. Never commit `.env` files or secret material.
7. Do not modify unrelated user changes in the working tree.
8. Prefer small, focused patches and run the narrowest useful checks.

## 9 Commit Message Convention

Only commit when the user asks. Use Conventional Commit type plus a concise Chinese description, such as `feat: 新增项目筛选` or `docs: 补充提交规范`.

## 10 Handoff Checklist

1. State which files changed.
2. State which commands passed or failed.
3. Mention unverified areas, especially `pnpm build` if skipped.
4. Link to relevant docs when changing architecture, routing, env, or content flow.
5. After all implementation and verification are complete, decide whether docs need updates.
6. If docs were updated, list them; if not, explain why the change did not affect architecture, environment, data shape, workflow, or agent rules.

---

This file is a navigation map. Keep implementation detail in linked docs.
