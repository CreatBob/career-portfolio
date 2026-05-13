# Blog Content Design

> Last regenerated: 2026-05-07

## 1 Purpose

The blog subsystem reads locale-specific MDX files from the filesystem, converts Markdown content to HTML, normalizes standalone images into styled figure blocks, computes reading time, and feeds pages, sitemap, and Atom feed routes.

> Sources: `src/lib/blog.ts`, `src/lib/content-images.ts`, `src/app/api/feed/atom.xml/route.ts:88-117`

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

The Markdown pipeline uses `remark-parse`, `remark-gfm`, `remark-math`, `remark-rehype`, `rehype-slug`, `rehype-katex`, the shared content-image transformer from `src/lib/content-images.ts`, and `rehype-stringify`.

Standalone Markdown images become figure blocks automatically, and the image title string can control rendering:

```md
![System overview](/blogs/images/my-post/overview.webp)
![Model comparison chart](/blogs/images/my-post/chart.png "size=md")
![Architecture panorama](/blogs/images/my-post/architecture.webp "layout=wide")
![Operator dashboard detail](/blogs/images/my-post/dashboard.webp "caption=Operator dashboard close-up|size=sm")
![Decorative texture](/blogs/images/my-post/texture.webp "caption=off|size=sm")
```

Supported options:

- `size=sm|md|lg`
- `layout=inline|wide`
- `caption=off`
- `caption=...` using `|` separators when the caption contains spaces

> Sources: `src/lib/blog.ts`, `src/lib/content-images.ts`

## 5 Image Assets

For new posts, prefer storing local assets under `public/blogs/images/<slug>/` so each article keeps its own image set. Existing flat paths under `public/blogs/images/` remain valid.

Recommended export targets:

- `size=sm`: render small supporting visuals, export around `1280px` on the long edge.
- `size=md`: render medium diagrams/screenshots, export around `1600px`.
- `size=lg`: default body image, export around `1920px`.
- `layout=wide`: breakout visual, export around `2200px`.

Format guidance:

- Use `.webp` for screenshots or photos.
- Use `.png` for charts with tiny text or transparency.
- Use `.svg` for vector diagrams when possible.

Keep meaningful alt text because it doubles as the default visible caption. If a visible caption is not desired, set `caption=off`.

## 6 Feed Integration

The Atom route resolves locale from query parameters or `Accept-Language`, loads localized posts, sorts newest first, and emits localized feed metadata.

> Sources: `src/app/api/feed/atom.xml/route.ts:18-90`, `src/app/api/feed/atom.xml/route.ts:104-117`

## 7 Change Rules

1. Add matching slugs in `content/blog/en` and `content/blog/zh` unless the exception is documented.
2. Keep required frontmatter fields: `title`, `date`, and `summary`.
3. Put new local article assets under `public/blogs/images/<slug>/` when the post needs images.
4. Run `pnpm lint:quality` after blog content changes so missing local image paths are caught before release.
5. Run `pnpm build` after changing content parsing or feed generation.
