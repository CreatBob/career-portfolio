# 作品集内容上传流程

> Updated: 2026-05-13
> Sources: `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/page.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`, `src/app/[locale]/blog/(list)/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`, `src/lib/blog.ts`, `src/lib/projects.ts`, `src/lib/project-case-study.ts`, `scripts/lint-quality.mjs`, `content/blog/en/getting-started-template.mdx`, `content/projects/en/getting-started-project-template.mdx`

## 1. 这份文档解决什么问题

这份文档说明当前仓库里“作品集内容从准备到上线”的完整流程，适用于以下几类内容：

- 首页个人资料与站点文案
- 项目案例页
- 博客文章
- 本地图片与封面素材
- 上线前检查与发布

如果你只是想开始写内容，建议先读第 2 节和第 3 节；如果你已经知道自己要改哪一类内容，直接跳到对应小节执行。

## 2. 先判断你要改哪一类内容

| 内容类型 | 主要位置 | 会显示到哪里 | 关键规则 |
| --- | --- | --- | --- |
| 首页首屏、SEO 文案、社交链接 | `src/i18n/messages/{en,zh}/personal.json`、`src/i18n/messages/{en,zh}/common.json`、`src/i18n/messages/{en,zh}/collections.json` | 首页首屏、导航、页脚、元数据、JSON-LD、博客列表说明 | `en` / `zh` 的 key 必须保持一致 |
| 项目案例 | `content/projects/{en,zh}/<slug>.mdx` | `/projects` 列表、`/projects/<slug>` 详情页、站点地图 | 双语 slug 对齐，`category` 对齐，`status: published` 才会显示 |
| 博客文章 | `content/blog/{en,zh}/<slug>.mdx` | `/blog` 列表、`/blog/<slug>` 详情页、Atom Feed、站点地图 | 双语 slug 对齐，`status: published` 才会显示 |
| 博客图片 | `public/blogs/images/<slug>/` | 博客正文 | MDX 里的本地图片路径必须能在 `public/` 下找到 |
| 项目图片与封面 | `public/projects/images/<slug>/` | 项目列表卡片、项目详情正文 | `cover` 和正文图片都必须引用本地有效路径 |
| 简历文件 | `public/resume.pdf` | 首页按钮、导航栏 | 若仍使用 `/resume.pdf`，直接替换文件最稳妥 |

说明：

1. 当前项目列表和项目详情页的主数据源是 `content/projects/*/*.mdx`，不是 `collections.json`。
2. `collections.json` 里的 `projects.items` 更适合当补充资料或未来扩展字段，若保留，建议与项目 MDX 内容保持一致，避免信息漂移。
3. `personal.json` 里的 `homeHero.*` 是当前首页首屏真正使用的字段；`headline` 还会影响 metadata、footer、feed 和 JSON-LD。

## 3. 推荐的完整流程

建议每次都按下面顺序走，这样最不容易返工：

1. 先定本次更新范围。
   只改个人资料、只发项目、只发博客，还是几类内容一起发。范围一旦确定，目录和检查项就清晰了。
2. 先定 slug，再准备双语材料。
   对项目和博客来说，`<slug>.mdx` 会直接变成路由地址，所以 slug 应该尽早确定，并在 `en` 和 `zh` 两边保持一致。
3. 先整理素材，再开始写。
   至少准备好标题、摘要、时间、角色、对外链接、技术栈、关键结果、截图或流程图。图片建议在写正文前就先按 slug 建好目录。
4. 先写主语言版本，再补另一种语言。
   你的写作母语如果是中文，可以先完成 `zh` 内容，再翻成 `en`。但最终提交前，两边的 slug、frontmatter 结构和关键字段必须对齐。
5. 本地预览页面效果。
   启动 `pnpm dev`，逐个看首页、项目列表、项目详情、博客列表、博客详情，确认文案、换行、图片、目录和链接都正常。
6. 跑机械检查。
   至少跑 `pnpm lint:quality`；正式发布前按仓库约定补齐 `pnpm lint`、`pnpm lint:deps`，必要时再跑 `pnpm build`。
7. 再进入发布流程。
   内容确认无误后，再按你的实际部署方式推送和上线。

## 4. 首页与资料内容怎么上传

### 4.1 `personal.json`

这里主要放首页首屏和站点级个人文案：

- `name.*`：姓名
- `headline`：站点描述，同时影响 metadata、footer、feed、JSON-LD
- `homeHero.greeting` / `displayName` / `alias`：首屏标题区
- `homeHero.typewriterPhrases`：首屏打字机文案
- `homeHero.descriptionLine1` / `descriptionLine2`：首屏介绍
- `blogTagline`：博客列表页说明
- `location.*`：结构化资料中的位置

建议流程：

1. 先改 `zh/personal.json`，把中文文案定下来。
2. 再同步改 `en/personal.json`，保持字段结构完全一致。
3. 如果需要替换简历按钮文案或简历链接，一并检查 `common.json` 的 `navbar.items` 和 `public/resume.pdf`。

注意：

1. 当前首页首屏使用的是 `homeHero.*`，不要只改 `bioMarkdown` 却期待首页自动更新。
2. `headline` 不是展示型废字段，它会直接影响 SEO 和结构化数据。

### 4.2 `collections.json`

这里放结构化资料内容，例如：

- `work.items`
- `education.items`
- `skills`
- `social`
- `news.items`
- `publications.items`
- `awards.items`
- `invitedTalks.items`
- `teaching.items`

建议把它当成“可枚举的履历资料仓库”。即使某些 section 现在没有全部渲染到页面，也尽量保持字段完整、可维护。

注意：

1. `social` 会影响首页社交链接、页脚链接、feed 联系方式和 JSON-LD。
2. `skills`、`work.items`、`education.items` 会进入 Person JSON-LD。
3. `en` / `zh` 两份 `collections.json` 的 key 必须完全一致，否则 `pnpm lint:quality` 会失败。

## 5. 项目案例怎么上传

### 5.1 创建文件

每个项目需要成对创建：

- `content/projects/en/<slug>.mdx`
- `content/projects/zh/<slug>.mdx`

推荐同时建立素材目录：

- `public/projects/images/<slug>/`

### 5.2 最小 frontmatter

项目页至少要有这些字段：

```mdx
---
title: "Project Title"
summary: "One-sentence summary"
dates: "2026.05 - 2026.08"
role: "Your Role"
company: "Company Name"
location: "City"
category: "ai-app"
status: "draft"
---
```

常用可选字段：

- `order`：列表排序，数字越小越靠前
- `featured`：是否作为重点项目优先展示
- `cover`：项目封面，建议填本地 `public/` 路径
- `technologies`
- `links`
- `highlights`
- `updatedAt`

强规则：

1. `category` 只允许 `ai-app`、`business-system`、`internal-tool`。
2. `en` 和 `zh` 的同名项目必须使用同一个 slug。
3. `en` 和 `zh` 的 `category` 必须一致。
4. 想先写草稿就用 `status: "draft"`；只有改成 `status: "published"` 才会进入项目列表、详情路由和 sitemap。

### 5.3 正文推荐结构

当前项目详情页会把每个 `##` 二级标题切成独立章节，并自动生成目录。所以建议直接沿用现有模板结构：

```md
## Project Overview
## My Responsibilities
## Key Challenges
## Solutions
## Impact
## Technical Notes
## Reflection
```

说明：

1. `## Solutions` 和 `## Impact` 在当前页面里有更明确的视觉语义，建议保留。
2. `###` 三级标题适合写子问题、子方案和局部证明。
3. 一篇好的项目案例应该优先回答“做了什么、为什么这样做、结果如何”，而不是简单堆技术名词。

### 5.4 图片写法

正文中直接写 Markdown 图片即可，例如：

```md
![System overview](/projects/images/my-project/overview.webp "layout=wide")
![Dashboard detail](/projects/images/my-project/dashboard.webp "size=md|caption=Operator dashboard")
```

支持的图片参数：

- `size=sm|md|lg`
- `layout=inline|wide`
- `caption=off`
- `caption=...`

建议：

1. 第一张图尽量放系统总览、业务流程图或全局架构图。
2. 截图、图表、指标图都放在对应段落下面，不要集中丢到文末。
3. `cover` 建议使用 `16:9` 图片，路径写成类似 `/projects/images/<slug>/cover.webp`。

## 6. 博客文章怎么上传

### 6.1 创建文件

每篇博客同样建议双语成对创建：

- `content/blog/en/<slug>.mdx`
- `content/blog/zh/<slug>.mdx`

如果有图片，再建立：

- `public/blogs/images/<slug>/`

### 6.2 最小 frontmatter

```mdx
---
title: "Post Title"
date: "2026-05-13"
summary: "What this post is about"
status: "draft"
---
```

常用可选字段：

- `updatedAt`
- `image`

强规则：

1. `title`、`date`、`summary` 是必填项。
2. `status: "published"` 后才会进入博客列表、详情页、feed 和 sitemap。
3. 列表页会按 `date` 倒序展示，所以日期要写准确。
4. 阅读时长会自动计算，不需要手填。

### 6.3 正文建议

博客页会自动生成目录，所以建议：

1. 至少使用 `##` 组织一级段落。
2. `###` 用来拆子主题。
3. 如果文章主要是在讲项目复盘，可以直接从 `content/blog/en/getting-started-template.mdx` 的结构出发。

### 6.4 图片写法

```md
![Architecture map](/blogs/images/my-post/overview.webp "layout=wide")
![Chart](/blogs/images/my-post/chart.png "size=md")
```

建议把图片放在：

- `public/blogs/images/<slug>/`

这样文章、slug 和资源目录能一一对应，后续维护最省心。

## 7. 图片与本地资源规则

无论是博客还是项目，当前仓库都依赖 `public/` 下的本地资源路径。也就是说：

1. 正文里的本地图片路径要以 `/` 开头。
2. 该路径最终必须能映射到 `public/` 下的真实文件。
3. `pnpm lint:quality` 会检查 MDX 正文图片和项目 `cover` 是否存在。

推荐约定：

- 博客：`public/blogs/images/<slug>/`
- 项目：`public/projects/images/<slug>/`
- 简历：`public/resume.pdf`

## 8. 写完后的检查流程

### 8.1 本地页面检查

先运行：

```bash
pnpm dev
```

然后至少检查这些页面：

1. `/`
2. `/projects`
3. `/projects/<slug>`
4. `/blog`
5. `/blog/<slug>`
6. `/zh/...` 对应双语页面

重点看：

- 标题、摘要、日期是否正确
- 首页首屏文案是否换行自然
- 项目封面和正文图片是否加载成功
- 博客目录和项目目录是否生成正常
- 外链是否可点击
- 中英文版本是否都能打开

### 8.2 命令检查

内容改动后的推荐命令：

```bash
pnpm lint
pnpm lint:deps
pnpm lint:quality
pnpm build
```

建议理解为：

1. `pnpm lint`：基础代码与格式问题
2. `pnpm lint:deps`：架构边界检查，通常内容改动不会触发，但正式提交流程仍建议跑
3. `pnpm lint:quality`：i18n key、slug、图片路径、项目分类等内容级检查
4. `pnpm build`：发布前最后确认，尤其适合新增已发布项目、博客、metadata 或路由相关内容时执行

## 9. 真正发布前的最终清单

上线前再过一遍这份 checklist：

1. `en` / `zh` 的文件是否都已创建。
2. slug 是否一致。
3. 项目 `category` 是否一致且合法。
4. `status` 是否已经从 `draft` 改成需要的状态。
5. 图片路径是否全部指向 `public/` 下真实文件。
6. 首页文案、社交链接、简历路径是否已同步。
7. `pnpm lint:quality` 是否通过。
8. 准备上线的内容是否已经过 `pnpm build`。

## 10. 发布方式说明

内容检查通过后，再进入你的部署流程：

1. 如果你当前是 Git 推送自动部署，就按正常提交流程 push。
2. 如果你当前走 OpenNext / Cloudflare 流程，仓库里已经提供了 `pnpm preview`、`pnpm deploy` 和 `pnpm upload` 脚本，但只在你确认这就是当前生产流程时再使用。

核心原则只有一个：

先把内容写对、结构对、资源路径对，再发布。
