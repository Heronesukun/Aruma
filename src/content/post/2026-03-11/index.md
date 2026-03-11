---
title: 博客主题迁移记录：从 Mizuki 到 Aruma
published: 2026-03-11
pubDate: 2026-03-11
pinned: true
description: 2026年3月11日，将博客从Mizuki主题迁移到Aruma主题的记录
tags: [commemorate, Blogging, 迁移]
author: 拾音
draft: false
category: 纪念
heroImage: https://raw.githubusercontent.com/Heronesukun/image-hosting/master/2026-03/VRChat_2026-03-11_sunset.webp
---

## 写在前面

今天完成了博客主题从 **Mizuki** 到 **Aruma** 的迁移，虽然两个主题都是同一位开发者（matsuzaka-yuki）开发的，但在使用体验上还是有不少差异。

## 迁移过程

### 1. Fork 并克隆项目

首先在 GitHub 上 Fork 了 Aruma 项目到自己的仓库：

```
https://github.com/Heronesukun/Aruma
```

### 2. 修改基础配置

修改了 `src/site.config.ts` 中的基本信息：

- 站点标题：**To The Neri**
- 作者：**拾音**
- 描述：**没有梦想的拾音喵**
- 域名：**neri.heronesukun.com**

### 3. 导入文章

将 Mizuki 项目中的个人博客文章复制到 Aruma：

- 2025 年度总结
- 戒戒系列
- 虚无系列
- 春日（立春）
- 冬日系列
- 等等...

### 4. 修复兼容性问题

过程中遇到了一些兼容性问题：

- **YAML 格式问题**：图片链接缺少闭合引号
- **日期字段问题**：Mizuki 使用 `published` 字段，Aruma 需要 `pubDate`
- **封面图字段问题**：Mizuki 使用 `image`，Aruma 需要 `heroImage`
- **图片链接问题**：本地图片改为图床链接

### 5. 关于图片

之前的阿里云 OSS 图床到期，将所有图片迁移到了 GitHub 图床：

- 图片仓库：https://github.com/Heronesukun/image-hosting
- 按日期分类存储：2025-10, 2025-11, 2025-12, 2026-01...

## 写在最后

Aruma 主题相比 Mizuki 更加简洁（真的简洁吗），期待在新主题下继续记录生活。

感谢 matsuzaka-yuki 开发了这么棒的主题！

**继续前行吧。**
