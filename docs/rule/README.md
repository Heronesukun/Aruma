# 项目开发规范

本目录包含了 Aruma 项目的开发规范文档，## 规范列表

### 1. [ViewTransitions 使用规范](./01-no-view-transitions.md)

**说明**：ViewTransitions **可以使用**，但必须正确配置以防止主题闪白。

**关键点**：
- 必须配置 `astro:before-swap` 事件处理主题
- 必须禁用 ViewTransitions 默认动画
- 必须设置全局背景色防止闪白
- 可使用自定义动画实现页面进入效果

### 2. [禁止使用 !important CSS](./02-no-important-css.md)

**原因**：`!important` 会破坏 CSS 的自然级联规则，导致样式难以维护。

**关键点**：
- 使用 CSS 变量
- 提高选择器优先级
- 使用作用域样式
- 避免与 MDUI 和 Tailwind 冲突

### 3. [MDUI 主题系统规范](./03-mdui-theme-system.md)

**原因**：项目使用 MDUI 的主题系统，需要保持一致性，避免冲突。

**关键点**：
- 主题相关样式使用 MDUI
- 其他部分可以使用 Tailwind
- 不用 Tailwind 覆盖 MDUI 主题
- 使用 CSS 变量保持一致性

### 4. [i18n 国际化规范](./04-i18n-requirements.md)

**原因**：所有用户可见的字符串都必须使用 i18n 系统，支持多语言。

**关键点**：
- 所有 UI 文本使用 `i18n()` 函数
- 定义 i18nKey 枚举
- 在所有语言文件中添加翻译
- 字符串参数化

## 代码审查检查清单

在提交代码前，请确保：

- [ ] ViewTransitions 已正确配置（主题处理、背景色、动画禁用）
- [ ] 页面切换时没有闪白现象
- [ ] CSS 中没有 `!important`
- [ ] MDUI 主题系统没有被 Tailwind 覆盖
- [ ] 所有用户可见的字符串都使用了 i18n
- [ ] 代码符合项目整体架构

