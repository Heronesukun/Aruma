# ViewTransitions 使用规范

## 概述

ViewTransitions **可以使用**，但必须正确配置以防止主题闪白问题。

## 必要条件

使用 ViewTransitions 时，**必须**满足以下条件：

### 1. 主题持久化处理

必须在 `astro:before-swap` 事件中将主题状态应用到新文档：

```javascript
// ✅ 正确：在 Layout.astro 中保持主题状态
document.addEventListener("astro:before-swap", (event) => {
  const theme = localStorage.getItem("theme");
  const isDark = theme === "dark" || theme === null;
  event.newDocument.documentElement.classList.toggle(
    "mdui-theme-layout-dark",
    isDark,
  );
});
```

### 2. 禁用默认淡入淡出动画

必须在 CSS 中禁用 ViewTransitions 的默认动画，防止闪烁：

```css
/* ✅ 正确：在 global.css 中禁用默认动画 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 即时切换 */
::view-transition-old(root) {
  opacity: 0;
}

::view-transition-new(root) {
  opacity: 1;
}
```

### 3. 全局背景色设置

必须设置全局背景色，防止切换时闪白：

```css
/* ✅ 正确：设置全局背景色 */
html {
  background-color: rgba(255, 255, 255, 0.8);
  transition: background-color 0s; /* 背景色立即切换，不动画 */
}

html.mdui-theme-layout-dark {
  background-color: rgba(66, 66, 66, 0.8);
}
```

## 正确示例

### Layout.astro

```astro
---
// ✅ 正确：使用 ClientRouter 并正确处理主题
import { ClientRouter } from 'astro:transitions';
---

<html>
  <head>
    <ClientRouter />
    <script is:inline>
      // 主题持久化
      document.addEventListener("astro:before-swap", (event) => {
        const theme = localStorage.getItem("theme");
        const isDark = theme === "dark" || theme === null;
        event.newDocument.documentElement.classList.toggle(
          "mdui-theme-layout-dark",
          isDark,
        );
      });
    </script>
  </head>
</html>
```

### global.css

```css
/* ✅ 正确：禁用默认动画并设置背景色 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

html {
  background-color: rgba(255, 255, 255, 0.8);
  transition: background-color 0s;
}

html.mdui-theme-layout-dark {
  background-color: rgba(66, 66, 66, 0.8);
}
```

## 错误示例

```astro
---
// ❌ 错误：使用 ClientRouter 但没有主题处理
import { ClientRouter } from 'astro:transitions';
---

<html>
  <head>
    <ClientRouter />
    <!-- 缺少 astro:before-swap 事件处理 -->
  </head>
</html>
```

```css
/* ❌ 错误：没有设置全局背景色 */
html {
  /* 缺少 background-color 设置 */
}
```

## 添加页面进入动画

如果需要页面进入动画，可以使用自定义动画类：

```css
/* ✅ 可选：添加页面进入动画 */
.page-transition {
  animation: pageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 减少动画时长以提升性能 */
@media (prefers-reduced-motion: reduce) {
  .page-transition {
    animation-duration: 0.15s;
  }
}
```

## 检查清单

在代码审查时，确保：

- [ ] 已正确配置 `astro:before-swap` 事件处理主题
- [ ] CSS 中已禁用 ViewTransitions 默认动画
- [ ] 已设置全局背景色防止闪白
- [ ] 暗色模式切换流畅无闪烁
- [ ] 页面切换时没有闪白现象

## 相关文件

- `src/layouts/Layout.astro` - 主布局文件
- `src/styles/global.css` - 全局样式
- `src/components/Header.astro` - 导航组件

## 更新记录

- **2026-03-11**：更新规范，允许在正确配置下使用 ViewTransitions
