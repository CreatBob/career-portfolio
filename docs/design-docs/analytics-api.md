# Analytics API Design

> Last regenerated: 2026-05-07

## 1 Purpose

The analytics API route fetches GA4 metrics server-side so service account credentials are never exposed to the browser.

> Sources: `src/app/api/analytics/route.ts:1-15`

## 2 Environment Contract

The route requires `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, and `GA4_PRIVATE_KEY`. Missing credentials produce a JSON 500 response instead of attempting a GA4 request.

> Sources: `src/app/api/analytics/route.ts:13-24`

## 3 Query Modes

1. If the request includes `path`, the route normalizes it and queries `screenPageViews` for that exact path.
2. If no `path` is provided, the route queries total `sessions`.
3. Responses include cache headers with a 24 hour shared max age.

> Sources: `src/app/api/analytics/route.ts:27-88`, `src/app/api/analytics/route.ts:91-115`

## 4 Client-Side Analytics

The layout injects Google Tag Manager outside development and only injects Vercel Analytics and Speed Insights when `VERCEL_ENV` is present.

> Sources: `src/app/[locale]/layout.tsx:93-106`

## 5 Change Rules

1. Do not expose GA4 service account credentials through `NEXT_PUBLIC_` variables.
2. Keep analytics fetches server-side.
3. Preserve controlled error behavior when credentials are missing.
4. Run `pnpm build` after changing this route or third-party script injection.
