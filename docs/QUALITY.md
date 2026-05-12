# Quality

> Last regenerated: 2026-05-07

## 1 Quality Goals

1. Keep routes thin and composition-focused.
2. Keep API routes server-only and free of React component imports.
3. Keep i18n, blog content, and project content structurally paired across `en` and `zh`.
4. Keep agent-facing documentation truthful and source-linked.
5. Keep environment secrets out of source control.

## 2 Mechanical Checks

| Check                 | Command             | Enforces                                                                       |
| --------------------- | ------------------- | ------------------------------------------------------------------------------ |
| ESLint                | `pnpm lint`         | Syntax, recommended JS/TS rules, import sorting                                |
| Dependency boundaries | `pnpm lint:deps`    | Layer import rules from `docs/ARCHITECTURE.md`                                 |
| Harness quality       | `pnpm lint:quality` | Required docs, AGENTS size, i18n parity, blog slug parity, project slug parity |
| Build                 | `pnpm build`        | Next.js compile and route generation                                           |

> Sources: `eslint.config.mts:1-14`, `scripts/lint-deps.mjs`, `scripts/lint-quality.mjs`, `package.json:15-22`

## 3 Review Standards

1. Lead with behavior risk, not style preference.
2. Cite exact files and lines for issues.
3. Check whether changes respect locale routing and message loading.
4. Check whether blog and project content changes preserve slug, locale parity, and asset references.
5. Check whether analytics changes keep GA4 credentials server-side.
6. Check whether app routes import only allowed layers.

## 4 Agent Handoff Standards

Every implementation handoff should include:

1. Files changed.
2. Commands run and results.
3. Commands skipped and why.
4. Known follow-up risks.

## 5 Current Known Constraints

1. No test runner is configured in `package.json`; use `pnpm lint`, `pnpm build`, and harness linters as the clean baseline verification.
2. `src/lib` has a documented exception allowing imports from `@/components/icons`.
3. GA4 endpoint behavior depends on external credentials and should be tested with configured environment variables before release.

> Sources: `package.json:15-22`, `src/lib/utils.tsx:4`, `src/lib/social-icons.tsx:1`, `src/app/api/analytics/route.ts:13-24`
