# CSS !important 使用规范

## 基本原则

项目中**应尽量避免使用 `!important` 级别的 CSS**，原因如下：

1. **破坏样式优先级**：`!important` 会打破 CSS 的自然级联规则
2. **难以维护**：一旦使用 `!important`，后续修改将不得不使用更多的 `!important`
3. **与 MDUI 冲突**：MDUI 组件库有自己的样式系统，使用 `!important` 可能导致不可预期的样式冲突
4. **Tailwind CSS 不兼容**：Tailwind 的原子类设计基于正常的 CSS 优先级，`!important` 会破坏这种设计

## 允许使用 !important 的例外情况

### Twikoo 评论区样式

在 `src/styles/twikoo.css` 文件中**允许使用 `!important`**。

**理由**：
1. **第三方库动态注入**：Twikoo 是第三方评论系统，其样式通过 JavaScript 动态注入到页面
2. **选择器优先级高**：Twikoo 内部样式使用了较高的选择器优先级，常规 CSS 无法覆盖
3. **隔离性好**：Twikoo 样式文件独立，`!important` 的影响范围仅限于评论区，不会影响其他组件
4. **无其他替代方案**：由于无法控制 Twikoo 的样式注入时机和方式，`!important` 是唯一可靠的覆盖方式

```css
/* ✅ 允许：在 twikoo.css 中覆盖 Twikoo 默认样式 */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
}
```

## 错误示例

```css
/* ❌ 错误：在普通组件样式中使用 !important */
.album-card {
  background-color: white !important;
  color: black !important;
}

.dark .album-card {
  background-color: black !important;
}
```

```astro
---
// ❌ 错误：在 Tailwind 类中使用 !important
---

<div class="!bg-white !text-black">
  内容
</div>
```

## 正确做法

### 1. 提高选择器优先级

```css
/* ✅ 正确：通过提高选择器优先级覆盖样式 */
.mdui-card.album-card {
  background-color: white;
  color: black;
}

:global(.mdui-theme-layout-dark) .album-card {
  background-color: black;
}
```

### 2. 使用 CSS 变量

```css
/* ✅ 正确：使用 CSS 变量 */
.album-card {
  background-color: var(--card-bg);
  color: var(--text-color);
}
```

### 3. 利用 Tailwind 的优先级

```astro
---
// ✅ 正确：Tailwind 类按顺序应用
---

<div class="bg-white dark:bg-black text-black dark:text-white">
  内容
</div>
```

### 4. 使用作用域样式

```astro
---
// ✅ 正确：使用 Astro 的作用域样式
---

<div class="album-card">
  内容
</div>

<style>
  .album-card {
    background-color: white;
  }
  
  :global(.mdui-theme-layout-dark) .album-card {
    background-color: black;
  }
</style>
```

## 特殊情况处理

### 需要覆盖第三方库样式时

```css
/* ✅ 正确：使用更具体的选择器 */
.mdui-card.my-custom-card {
  /* 自定义样式 */
}

/* ✅ 正确：使用 :where() 降低优先级 */
:where(.mdui-card).my-custom-card {
  /* 自定义样式 */
}
```

### 内联样式优先级最高

```astro
---
// ✅ 正确：使用内联样式（谨慎使用）
---

<div style="background-color: white;">
  内容
</div>
```

## Tailwind CSS 的 !important 使用

Tailwind CSS v4 提供了 `!` 前缀来添加 `!important`：

```astro
---
// ⚠️ 谨慎使用：Tailwind 的 !important 前缀
---

<!-- 只在绝对必要时使用 -->
<div class="!bg-white">
  内容
</div>
```

**使用场景**：仅在必须覆盖第三方库的内联样式时使用。

## 检查清单

在代码审查时，确保：

- [ ] 普通业务 CSS 文件中没有 `!important`
- [ ] `<style>` 标签中没有 `!important`（Twikoo 组件除外）
- [ ] Tailwind 类中没有 `!` 前缀（除非有充分理由）
- [ ] 样式优先级合理，易于理解和维护
- [ ] `twikoo.css` 中的 `!important` 使用合理且必要

## 替代方案优先级

1. **首选**：使用 Tailwind 原子类
2. **次选**：使用 CSS 变量
3. **再次**：提高选择器优先级
4. **最后**：使用作用域样式
5. **避免**：使用 `!important`（Twikoo 样式除外）

## 相关文件

- `src/styles/global.css` - 全局样式
- `src/styles/aruma.css` - 自定义样式
- `src/styles/twikoo.css` - Twikoo 评论区样式（允许 !important）
- `src/styles/tailwind-extensions.css` - Tailwind 扩展

## 参考资料

- [CSS 优先级计算器](https://specificity.keegan.st/)
- [MDUI 样式系统](https://www.mdui.org/docs/theme)
- [Tailwind CSS 优先级](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)
