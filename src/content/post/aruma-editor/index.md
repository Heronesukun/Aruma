---
title: "打造 Aruma 博客文章本地编辑器"
published: 2026-06-10
pubDate: 2026-06-10
pinned: false
description: "从零开始，用 Svelte 5 + Vite + CodeMirror 6 搭建一个本地博客文章编辑器，完整记录架构设计、Svelte 5 响应式系统踩坑、Aruma 设计风格复刻全过程。"
tags: [Aruma, Svelte 5, Vite, CodeMirror, 前端, Blogging]
author: "拾音"
draft: false
category: "技术"
heroImage: ""
---

## 起因

Aruma 博客的日常工作流是：打开 VS Code → 新建文件夹 → 手写 Markdown → 手动维护 YAML Frontmatter → 图片手动管理 → 提交推送。每次写一篇文章都要走一遍重复流程，标签容易拼写不一致，分类容易漏填，图片路径经常写错。

于是有了这个想法：做一个本地 Web 工具，可视化编写文章，一键发布到 Aruma 项目目录。今天花了一个下午，从零到一搭了出来。

## 技术选型

Aruma 本身就是 **Astro + Svelte 5 + TailwindCSS** 技术栈。编辑器选择 Svelte 5 是自然而然的——我已经熟悉这套生态了。具体组合：

| 技术 | 用途 | 选型理由 |
|------|------|----------|
| **Vite** | 构建工具 | 快，Svelte 原生支持 |
| **Svelte 5** | UI 框架 | 与 Aruma 同栈，$state/$derived runes 是全新体验 |
| **CodeMirror 6** | Markdown 编辑区 | 语法高亮、可扩展、体积可控 |
| **markdown-it** | 预览渲染 | 轻量，插件丰富 |
| **js-yaml** | YAML 序列化 | 替代手动拼接字符串，处理特殊字符 |
| **gray-matter** | Frontmatter 解析 | 读取已有文章的元数据 |

不选 Electron / Tauri：太重了。一个 `pnpm dev` 就能跑的 Web 工具足够满足需求。

## 架构设计

### 目录结构

```
aruma-editor/                  # 独立 Git 仓库，与 Aruma 同级
├── drafts/                    # 草稿目录 (.gitignore)
├── server/
│   └── api.ts                 # Vite 插件，提供文件系统 API
├── src/
│   ├── App.svelte             # 主布局 (侧边栏 + 编辑器)
│   ├── lib/
│   │   ├── store.svelte.ts    # 响应式状态 (Svelte 5 class $state)
│   │   ├── Editor.svelte      # 主编编辑区 (工具栏 + 编辑/预览/分栏)
│   │   ├── ArticleList.svelte # 侧边栏 (草稿列表 + Aruma 文章导入)
│   │   ├── FrontmatterForm.svelte # 元数据表单 + 标签选择器
│   │   ├── MarkdownEditor.svelte  # CodeMirror 封装
│   │   ├── MarkdownPreview.svelte # markdown-it 预览
│   │   └── ImageUploader.svelte   # 图片拖拽/粘贴上传
│   └── styles/
│       └── global.css         # 完整复刻 Aruma 设计系统 CSS
└── aruma-editor.config.json   # Aruma 项目路径等配置
```

### 数据流

```
用户操作 → store (Svelte 5 $state 响应式)
                ↕ 双向绑定
       FrontmatterForm / MarkdownEditor
                ↓ onSave
          fetch POST /api/articles
                ↓
         server/api.ts → fs.writeFileSync
                ↓
          drafts/{slug}/index.md
                ↓ 点 Publish
         copyDirectory → Aruma/src/content/post/{slug}/
```

### 为什么用 Vite 插件而不是独立后端

所有文件操作（读/写/复制）都在 Vite 的 `configureServer` 钩子中通过中间件实现。这样做的好处：

- **零配置**——不需要额外启动 Node 服务
- **安全**——默认只在开发环境中运行，不会暴露到生产
- **直接访问 fs**——可以读取 Aruma 项目中的已有标签和文章

```ts
// server/api.ts 核心结构
export function editorApi(): Plugin {
  return {
    name: "aruma-editor-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith("/api/")) return next();
        // 路由分发：GET/POST /api/articles，/api/tags，/api/aruma/articles...
      });
    },
  };
}
```

## Svelte 5 响应式系统的三个坑

这是整个开发过程中耗时最多的部分。Svelte 5 的 **runes**（$state / $derived / $effect / $props）是全新的响应式模型，而我在上面连踩三坑。

### 第一坑：$derived 只读，不能 bind

最初的设计是 `currentArticle = $derived(...)` 作为导出值，然后在 Editor 中用 `bind:article={currentArticle}` 传给 FrontmatterForm。报错：

> Cannot bind to import — $derived 是只读的，不能作为 bind: 的目标。

**解决**：放弃 `$derived`，改用 class 的 `get` 访问器：

```ts
class Store {
  currentSlug = $state(null);
  articles = $state([]);
  
  get currentArticle(): Article | null {
    return this.currentSlug
      ? this.articles.find(a => a.slug === this.currentSlug) ?? null
      : null;
  }
}
```

Svelte 5 的 `$state` 对 class 实例做了完整 Proxy 包装，`get` 访问器的返回值也是响应式的。

### 第二坑：.svelte 文件不能赋值给 import

早期的设计是导出 `export let articles = $state([])`，然后在组件里 `articles = newValue`。报错：

> Cannot assign to import

Svelte 5 不允许在 `.svelte` 文件中直接给 import 赋值（即使它是从 `.svelte.ts` 导出的 $state 变量）。

**解决**：把所有状态收敛到 class 实例上：

```ts
export const store = new Store();
// 组件中：store.articles = newValue  ✅ 可以
```

`store.articles` 是对象属性赋值，不是 import 赋值，Svelte 允许。

### 第三坑：HTML entity 和 Unicode escape 原样输出

在 Svelte 模板中，`&#9664;` 和 `\u25c0` 都不会被解析，直接输出为字面文本。

**解决**：直接使用 Unicode 字符本身（◀ ▶ ✕ ↑ 📷 📝）：

```svelte
<!-- 错误：显示 &#9664; 原文 -->
<button>&#9664;</button>
<button>{"\u25c0"}</button>

<!-- 正确：显示实际图标 -->
<button>◀</button>
```

## CodeMirror 6 集成

CodeMirror 6 是一次大胆的选择。v6 采用了全新的模块化架构，API 与 v5 完全不同。

### 双向同步

最棘手的部分：编辑器的内容需要与 Svelte store 双向同步。

```svelte
<!-- MarkdownEditor.svelte -->
<script>
  // props: content (输入), onChange (输出回调)
  let { content, onChange } = $props();

  onMount(() => {
    view = new EditorView({
      doc: content,
      extensions: [
        basicSetup, markdown(), oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange(view.state.doc.toString());
        }),
      ],
    });
  });

  // 外部 content 变化 → 同步到 CodeMirror
  $effect(() => {
    if (!view) return;
    const current = view.state.doc.toString();
    if (content !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: content }
      });
    }
  });
</script>
```

关键点：
- `onMount` 中初始化编辑器，注册 `onChange` 回调 → **内→外**
- `$effect` 监听 content prop 变化，dispatch changes → **外→内**
- 两个方向都有 `if (content !== current)` 守卫，避免死循环

### 图片粘贴

CodeMirror 6 的 `EditorView.domEventHandlers` 可以直接拦截 paste/drop 事件：

```ts
EditorView.domEventHandlers({
  paste: (event) => {
    for (const item of event.clipboardData.items) {
      if (item.type.startsWith("image/")) {
        onPasteImage(item.getAsFile());
      }
    }
  }
});
```

## 图片上传

图片通过 multipart/form-data POST 到 `/api/articles/:slug/images`。服务端手动解析 multipart boundary：

```ts
function parseMultipart(buffer: Buffer, boundary: string): MultipartPart[] {
  // 手动解析 multipart 格式，提取文件数据
  // 写入 drafts/{slug}/{timestamp}-{filename}
}
```

为什么不用 `multer` 之类的中间件？因为这个 Vite 插件运行在原生 Node http server 而非 Express，手动解析避免引入额外依赖。

## 标签系统的双向联动

新建文章时，FrontmatterForm 的标签输入框做了两件事：

1. **从 Aruma 读取已有标签**——`/api/tags` 返回 `{ tag, count }[]`，输入时下拉建议
2. **自动过滤**——已添加的标签从建议列表中移除

```svelte
<!-- FrontmatterForm.svelte -->
<script>
  function filteredSuggestions() {
    const input = tagInput.toLowerCase();
    return store.existingTags.filter(
      t => t.tag.toLowerCase().includes(input) 
        && !article.tags.includes(t.tag)  // 已添加的不显示
    );
  }
</script>
```

这样保证了：
- 写文章时标签拼写与已有文章一致
- 不会重复添加同一个标签
- 新标签可以通过 Enter 手动创建

## Aruma 设计风格复刻

编辑器完全复刻了 Aruma 博客的视觉风格：

| 设计元素 | 值 |
|----------|-----|
| 主色调 | `#ff4081` (Material Pink 400) |
| 卡片背景 | `rgba(255,255,255,0.8)` |
| 毛玻璃 | `backdrop-filter: blur(10px)` |
| 卡片圆角 | `7px` |
| 按钮圆角 | `16px` |
| 标签圆角 | `12px` |
| 卡片阴影 | `0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)` |
| 过渡动画 | `all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)` |

所有设计 token 以 CSS 自定义属性的形式定义在 `global.css` 中，与 Aruma 的 `aruma.css` 保持一致。

## 发布流程

点击 Publish 按钮的完整流程：

```
1. 前端 POST /api/articles/{slug}/publish
2. 后端校验：
   ├── Aruma 项目路径是否存在
   ├── src/content/post/ 目录是否存在
   └── 目标 slug 是否已存在 (防覆盖)
3. copyDirectory(drafts/{slug}, Aruma/src/content/post/{slug})
   └── 递归复制所有文件 (index.md + 图片)
4. 返回成功
5. 前端更新文章列表，标记为 published
```

## 总结

这个下午的收获：

1. **Svelte 5 runes 需要适应**——`$state` class 是目前最舒适的跨组件状态方案
2. **Codemirror 6 模块化做得好**——按需引入，初始体积可控
3. **Vite 插件做本地服务非常方便**——不需要 Express / Koa 等额外依赖
4. **先写方案再动工**——避免了很多架构返工

完整代码在 [GitHub](https://github.com/Heronesukun/Aruma-editor)，可以 Clone 下来直接用。

## 待完善

- [ ] 自动保存（debounce 1s 后自动触发 Save）
- [ ] 支持数学公式预览（复用 Aruma 的 KaTeX 配置）
- [ ] 文章搜索 / 筛选
- [ ] 拖拽排序草稿列表
- [ ] 多语言 slug 生成建议
