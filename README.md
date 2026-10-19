<div align="center">

# Aruma

一个基于 Astro 6 与 Svelte 5 构建的个人博客，兼顾内容创作、视觉表现与静态站点性能。

[![Astro](https://img.shields.io/badge/Astro-6.0-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Code License](https://img.shields.io/badge/Code-MIT-blue.svg)](./LICENSE)
[![Content License](https://img.shields.io/badge/Content-CC_BY--NC--ND_4.0-lightgrey.svg)](./src/content/post/LICENSE)

[在线预览](https://aruma.mysqil.com) · [问题反馈](https://github.com/Heronesukun/Aruma/issues) · [项目文档](./docs)

</div>

## 项目简介

Aruma 是 [Heronesukun](https://github.com/Heronesukun) 的个人博客项目。它以 Astro 的静态生成能力为基础，通过 Svelte 组件提供交互体验，并使用 MDUI、Tailwind CSS、Pagefind、KaTeX 与 PhotoSwipe 等工具完善主题、搜索、数学公式和相册能力。

项目不仅包含文章系统，也集成了相册、追番、日记、友链、设备展示、音乐播放器和站点统计等页面，适合作为个人内容站点直接使用，也可以作为二次开发 Astro 博客的参考实现。

## 功能特性

### 内容与导航

- 使用 Astro Content Collections 管理 Markdown / MDX 文章，并通过 Zod 校验 Frontmatter。
- 支持文章置顶、分类、标签、归档、草稿、阅读时间与字数统计。
- 提供文章列表、分页、全文搜索、RSS、Atom 与 Sitemap。
- 支持目录式文章资源，图片可以与文章放在同一文件夹中维护。
- 生产环境自动过滤草稿内容，避免草稿进入列表、详情页和订阅源。

### 界面与阅读体验

- 响应式玻璃拟态布局，适配桌面、平板与移动端。
- 亮色 / 暗色主题切换，并在 Astro ClientRouter 页面切换期间保持主题状态。
- 顶部提供站内搜索、当前页面二维码和主题切换入口。
- 支持 KaTeX 数学公式、代码高亮、代码复制和宽表格横向滚动。
- 集成 PhotoSwipe 相册预览、Pace 页面加载进度与本地音乐播放器。
- 内置简体中文、繁体中文、英文和日文翻译结构，便于继续扩展国际化内容。

### 扩展页面

- 相册：扫描本地相册目录并生成相册列表与详情页。
- 追番：支持本地 JSON、Bilibili、Bangumi 及混合数据源。
- 日记、友链与设备：使用结构化 JSON 数据维护。
- 评论：预留 Twikoo 评论与最近回复组件，可通过站点配置启用。
- 侧边栏：包含个人资料、公告、站点统计、分类云与标签云。

### 工程能力

- Astro 6 静态输出，构建结果位于 `dist/`。
- Svelte 5 按需水合，减少不必要的客户端 JavaScript。
- Sharp 图片处理、字体压缩、KaTeX 按文章加载与 Pagefind 离线索引。
- TypeScript、Astro Check 与 Prettier 组成基础质量检查流程。
- 项目内置主题、i18n、组件化和 View Transitions 开发规范。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Astro 6、Svelte 5、TypeScript |
| 样式 | MDUI 2、Tailwind CSS 4、原生 CSS |
| 内容 | Astro Content Collections、Markdown、MDX |
| 搜索 | Pagefind |
| 数学公式 | Remark Math、Rehype KaTeX、KaTeX |
| 图片与相册 | Astro Assets、Sharp、PhotoSwipe |
| 其他 | QRCode、Pace、Twikoo、Lucide、Iconify |

## 环境要求

- Node.js `^20.19.1` 或 `>=22.12.0`
- pnpm `>=7.1.0`

推荐使用较新的 Node.js LTS 和 Corepack 管理 pnpm。

## 快速开始

```bash
git clone https://github.com/Heronesukun/Aruma.git
cd Aruma

corepack enable
pnpm install
pnpm dev
```

开发服务器默认运行在 <http://localhost:4321>。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 拉取外部数据、构建站点、生成搜索索引并压缩资源 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm check` | 运行 Astro 类型与模板诊断 |
| `pnpm type-check` | 运行 TypeScript 类型检查 |
| `pnpm lint` | 检查 `src/` 下的代码格式 |
| `pnpm format` | 使用 Prettier 格式化 `src/` |

## 站点配置

主要配置文件如下：

| 文件 | 用途 |
| --- | --- |
| [`src/site.config.ts`](./src/site.config.ts) | 站点信息、导航、主题资源、侧边栏、音乐、评论和追番数据源 |
| [`astro.config.mjs`](./astro.config.mjs) | 站点域名、Astro 集成、Markdown 与图片处理配置 |
| [`src/content.config.ts`](./src/content.config.ts) | 文章集合与 Frontmatter Schema |
| [`src/data/anime.json`](./src/data/anime.json) | 本地追番数据 |
| [`src/data/diary.json`](./src/data/diary.json) | 日记数据 |
| [`src/data/friends.json`](./src/data/friends.json) | 友链数据 |
| [`src/data/devices.json`](./src/data/devices.json) | 设备展示数据 |

如果部署到自己的域名，请同步修改 `astro.config.mjs` 中的 `site`，以及 `src/site.config.ts` 中的站点资料和外部服务配置。

## 添加文章

你可以直接维护 Markdown 文件，也可以使用 [Aruma Editor](https://github.com/Heronesukun/arumaEditor) 完成可视化写作与发布。

### 使用 Aruma Editor（推荐）

Aruma Editor 是面向 Aruma 与 Mizuki 博客的本地优先 Markdown 编辑器，提供实时预览、Frontmatter 表单、草稿自动保存、历史版本、文章同步和发布前差异检查。

1. 前往 [Aruma Editor Releases](https://github.com/Heronesukun/arumaEditor/releases/latest) 下载 Windows x64 便携版。
2. 在“管理博客连接”中选择 Aruma 项目根目录，或直接选择 `src/content/post/`。
3. 新建草稿，或者同步并打开已有文章。
4. 编辑正文、标题、日期、分类、标签、摘要与头图。
5. 点击“检查并发布”，确认目标路径与文件差异后写入博客目录。
6. 回到 Aruma 项目运行 `pnpm dev` 预览，确认无误后再提交 Git 变更。

Aruma Editor 只会在你授权的本地博客目录中读写文章，不会代替 Aruma 执行构建、`git commit` 或远程推送。详细功能和安全机制请参阅 [Aruma Editor 项目说明](https://github.com/Heronesukun/arumaEditor#readme)。

### 手动创建

在 `src/content/post/` 下创建 Markdown 或 MDX 文件。推荐每篇文章使用独立目录，方便将正文与图片一起管理：

```text
src/content/post/my-post/
├── index.md
└── cover.webp
```

Frontmatter 示例：

```yaml
---
title: 我的第一篇文章
description: 文章摘要
pubDate: 2026-08-14
updatedDate: 2026-08-14
category: 随想
tags:
  - Astro
  - Blogging
heroImage: ./cover.webp
pinned: false
draft: false
---
```

日期字段兼容 `pubDate`、`published` 或 `date`。设置 `draft: true` 后，文章不会出现在生产环境的页面、统计和订阅源中。

数学公式使用 `$$...$$` 定界；单个 `$` 保留为普通文本，避免 `$state`、`$derived` 等代码标识被误判为公式。

## 构建与部署

```bash
pnpm build
```

构建脚本会依次执行：

1. 拉取配置启用的外部追番与评论数据。
2. 生成 Astro 静态站点。
3. 为 `dist/` 生成 Pagefind 搜索索引。
4. 压缩站点字体资源。

最终产物位于 `dist/`，可以部署到支持静态站点的任意平台。构建过程可能访问外部 API；在 CI 环境中请确保网络可用。Bilibili 与 Bangumi 凭据分别通过 `BILIBILI_SESSDATA` 和 `BANGUMI_ACCESS_TOKEN` 环境变量提供，请使用部署平台的 Secret 管理器，不要将令牌或 Cookie 提交到仓库。

## 项目结构

```text
Aruma/
├── public/                 # 字体、音乐、相册和其他静态资源
├── scripts/                # 数据拉取与字体构建脚本
├── src/
│   ├── assets/             # 由 Astro 处理的站点资源
│   ├── components/         # Astro 与 Svelte 组件
│   ├── content/            # 文章与独立内容集合
│   ├── data/               # 追番、日记、友链和设备数据
│   ├── i18n/               # 国际化键值与语言文件
│   ├── layouts/            # 全局与文章布局
│   ├── pages/              # 文件路由与订阅源
│   ├── plugins/            # Remark / Rehype 插件
│   ├── styles/             # 全局、主题与功能样式
│   └── site.config.ts      # 站点核心配置
├── docs/                   # 用户文档与开发规范
├── astro.config.mjs
├── package.json
└── pnpm-lock.yaml
```

## 开发文档

- [代码格式约定](./docs/user/CODE_FORMAT.md)
- [外部追番数据源](./docs/user/EXTERNAL_ANIME_SOURCE.md)
- [个人资料卡片配置](./docs/user/PROFILE_CARD.md)
- [项目开发规范](./docs/rule/README.md)

提交代码前建议运行：

```bash
pnpm type-check
pnpm lint
pnpm check
```

## 作者

[Heronesukun](https://github.com/Heronesukun)

## 许可证

本仓库采用双许可证，代码与文章内容分别授权：

- **代码、模板与脚本：** 采用 [MIT License](./LICENSE)。你可以自由使用、复制、修改、合并、发布、分发、再授权或销售，但必须保留原版权与许可声明。
- **文章内容：** `src/content/post/` 下由 Heronesukun 创作的原创文章及原创随文媒体采用 [CC BY-NC-ND 4.0](./src/content/post/LICENSE)。允许在正确署名并链接原文与许可证的前提下进行非商业、原样转载；禁止分发修改、改编或翻译后的版本。

文章中引用的第三方图片、文字、商标及其他材料仍归原权利人所有，不因本仓库的许可证而被重新授权。
