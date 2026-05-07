# Development

> Last regenerated: 2026-05-07

## 1 Requirements

| Tool | Version | Evidence |
| --- | --- | --- |
| Node.js | `>=18.18.0 <=22` | `package.json:87-89` |
| pnpm | lockfile committed | `pnpm-lock.yaml`, `pnpm-workspace.yaml` |
| Next.js | `16.1.1` | `package.json:43` |
| TypeScript | `5.9.x` | `package.json:77` |

## 2 Install

```bash
pnpm install
```

Use pnpm for dependency changes because the repository commits `pnpm-lock.yaml`.

## 3 Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local Next.js dev server |
| `pnpm build` | Build the production app |
| `pnpm start` | Start the built production app |
| `pnpm lint` | Run ESLint |
| `pnpm lint:deps` | Check architecture import boundaries |
| `pnpm lint:quality` | Check harness, i18n, and content consistency |
| `pnpm harness:verify` | Run both harness linters |

> Sources: `package.json:15-22`, `scripts/lint-deps.mjs`, `scripts/lint-quality.mjs`

## 4 Environment Variables

### 4.1 Required For GA4 Endpoint

| Variable | Sensitive | Purpose |
| --- | --- | --- |
| `GA4_PROPERTY_ID` | No | Google Analytics property ID |
| `GA4_CLIENT_EMAIL` | Yes | Service account client email |
| `GA4_PRIVATE_KEY` | Yes | Service account private key, with escaped newlines supported |

> Sources: `src/app/api/analytics/route.ts:13-24`, `harness/config/environment.json`

### 4.2 Optional

| Variable | Sensitive | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GTM_ID` | No | Enables Google Tag Manager script |
| `NEXT_PUBLIC_BAIDU_SITE_VERIFICATION` | No | Emits Baidu site verification metadata |
| `VERCEL_ENV` | No | Enables Vercel Analytics and Speed Insights in deployed environments |

> Sources: `src/components/third-party/gtm.tsx:8`, `src/components/third-party/baidu.tsx:6`, `src/app/[locale]/layout.tsx:93-106`

## 5 Local Startup

```bash
pnpm dev
```

Default URL: `http://localhost:3000`.

The harness also includes `harness/scripts/start-server.sh` and `harness/scripts/start-server.ps1` for executor-style startup.

## 6 CI

The harness workflow runs install, ESLint, dependency lint, quality lint, and production build.

> Sources: `.github/workflows/harness.yml`

## 7 Change Checklist

1. For route or metadata changes, run `pnpm build`.
2. For dependency boundary changes, run `pnpm lint:deps`.
3. For i18n or blog changes, run `pnpm lint:quality`.
4. For UI changes, run `pnpm lint` and visually inspect the changed route.
5. For analytics changes, verify missing credentials still return a controlled 500 response.
