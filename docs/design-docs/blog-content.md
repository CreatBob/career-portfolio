# Blog Content Design

> Last regenerated: 2026-05-07

## 1 Purpose

The blog subsystem reads locale-specific MDX files from the filesystem, converts Markdown content to HTML, computes reading time, and feeds pages, sitemap, and Atom feed routes.

> Sources: `src/lib/blog.ts:1-37`, `src/lib/blog.ts:78-134`, `src/app/api/feed/atom.xml/route.ts:88-117`

## 2 Content Layout

Blog files live in parallel locale directories:

| Locale | Directory |
| --- | --- |
| English | `content/blog/en/` |
| Chinese | `content/blog/zh/` |

> Sources: `src/lib/blog.ts:100-105`

## 3 Parsing Pipeline

`getPost` chooses the locale directory, checks file existence, reads the source, parses frontmatter with `gray-matter`, converts Markdown to HTML through `markdownToHTML`, computes reading time, and returns a typed `BlogPost`.

> Sources: `src/lib/blog.ts:100-134`

## 4 Markdown Conversion

The Markdown pipeline uses `remark-parse`, `remark-gfm`, `remark-math`, `remark-rehype`, `rehype-slug`, `rehype-katex`, `rehype-pretty-code`, and `rehype-stringify`.

> Sources: `src/lib/blog.ts:4-12`, `src/lib/blog.ts:78-98`

## 5 Feed Integration

The Atom route resolves locale from query parameters or `Accept-Language`, loads localized posts, sorts newest first, and emits localized feed metadata.

> Sources: `src/app/api/feed/atom.xml/route.ts:18-90`, `src/app/api/feed/atom.xml/route.ts:104-117`

## 6 Change Rules

1. Add matching slugs in `content/blog/en` and `content/blog/zh` unless the exception is documented.
2. Keep required frontmatter fields: `title`, `date`, and `summary`.
3. Run `pnpm lint:quality` after blog content changes.
4. Run `pnpm build` after changing content parsing or feed generation.
