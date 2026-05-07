# I18n Routing Design

> Last regenerated: 2026-05-07

## 1 Purpose

The i18n subsystem provides locale-aware routing, navigation helpers, request-time message loading, and locale URLs for SEO helpers and feed generation.

> Sources: `src/i18n/routing.ts:1-34`, `src/i18n/request.ts:1-31`

## 2 Routing Contract

The supported locales are `en` and `zh`, the default locale is `en`, and locale prefixes are emitted only when needed. Navigation helpers are generated from the same routing config.

> Sources: `src/i18n/routing.ts:6-24`

## 3 Request Message Loading

The request config validates the requested locale and falls back to the default when the request locale is missing or unsupported. It merges `common`, `personal`, and `collections` JSON files for the active locale.

> Sources: `src/i18n/request.ts:5-31`

## 4 App Integration

The locale layout validates route params with `hasLocale`, calls `setRequestLocale`, loads messages through `getMessages`, and wraps the tree in `NextIntlClientProvider`.

> Sources: `src/app/[locale]/layout.tsx:58-91`

## 5 Change Rules

1. When adding a locale, update `LOCALES`, `LOCALE_TO_HREFLANG`, and every message namespace.
2. Keep message keys structurally identical across `en` and `zh`.
3. Run `pnpm lint:quality` after message changes.
4. Do not bypass `src/i18n/routing.ts` with hand-built localized URLs.
