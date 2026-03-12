# 组件化设计规范

**原因**：为了提高代码的可维护性、可复用性和性能，必须遵循组件化设计原则，避免单文件过大。

**关键点**：
- 遵循单一职责原则（SRP）
- 控制组件粒度，保持代码清晰
- 使用懒加载优化性能
- 使用 TypeScript 接口定义 Props
- 合理使用 Hydration 指令

## 设计原则

### 1. 单一职责原则（SRP）

每个组件应该只有一个明确、独立的职责。

**示例：**

```astro
// ❌ 错误：Header.astro（733 行）
// - 处理顶部导航栏
// - 处理侧边抽屉
// - 处理搜索功能
// - 处理二维码生成
// - 处理主题切换
// - 处理所有导航逻辑

// ✅ 正确：分离为独立的组件
// - Appbar.astro（~15 行）- Appbar 容器
// - Toolbar.astro（~8 行）- Toolbar 容器
// - SearchModule.astro（~150 行）- 搜索功能
// - QRCodeModule.astro（~60 行）- 二维码生成
// - ThemeToggle.astro（~40 行）- 主题切换
// - Drawer.astro（~180 行）- 侧边抽屉
// - Header.astro（~65 行）- 组合层
```

### 2. 组件粒度规则

#### 小型组件（< 100 行）
- 纯展示性组件
- 无复杂逻辑
- 可在整个应用中复用

**示例：**
- `Appbar.astro` - 容器组件
- `Toolbar.astro` - 容器组件
- `ThemeToggle.astro` - 单一功能组件

#### 中型组件（100-200 行）
- 特定功能的组件
- 包含相关逻辑
- 自包含的状态管理

**示例：**
- `SearchModule.astro` - 搜索输入 + 验证 + 导航
- `QRCodeModule.astro` - 二维码生成 + 下拉菜单
- `Drawer.astro` - 抽屉 + 菜单 + 导航

#### 大型组件（200-500 行）
- 复杂功能集合
- 多个子功能
- 如果持续增长应进一步拆分

**警告：** 超过 500 行的组件应该拆分。

#### 组合层（< 100 行）
- 组合其他组件
- 最小化逻辑
- 委托给子组件

**示例：**
- `Header.astro` - 组合 Appbar、Drawer 和功能模块
- `Sidebar.astro` - 组合 ProfileCard、ReplyModule、TagCloud

## 文件命名规范

### 组件文件

```
src/components/
├── [功能名称].astro       # 主组件（帕斯卡命名）
├── [功能名称]Module.astro  # 功能模块（帕斯卡命名 + Module）
└── [容器名称].astro       # 容器组件（帕斯卡命名）
```

**示例：**
- `Header.astro` - 主导航组件
- `SearchModule.astro` - 搜索功能模块
- `Drawer.astro` - 侧边抽屉容器
- `Appbar.astro` - 顶部导航栏容器

### Svelte 组件文件

```
src/components/svelte/
└── [功能名称].svelte    # Svelte 组件（帕斯卡命名）
```

**示例：**
- `ProfileCard.svelte` - 用户资料卡片
- `TagCloud.svelte` - 标签云展示
- `ReplyModule.svelte` - 回复列表模块

## 导入策略

### 常规导入（始终需要）

```astro
---
import Component from './Component.astro';
import Feature from './FeatureModule.astro';
---
```

**使用场景：**
- 必需组件（Header、Sidebar、Footer）
- 核心 UI 组件（Appbar、Toolbar）
- 所有页面都需要的功能

### 懒加载导入（可选功能）

```astro
<script>
  async function initFeature() {
    const QRCode = await import('qrcode');
    QRCode.toCanvas(canvas, url, options);
  }
</script>
```

**使用场景：**
- 重型库
- 可选功能（二维码、图片灯箱）
- 很少使用的功能

### Hydration 指令

```astro
<!-- 立即加载 -->
<Component client:load />

<!-- 可见时加载（性能更好） -->
<Component client:visible />

<!-- 空闲时加载 -->
<Component client:idle />

<!-- 交互时加载（最适合可选功能） -->
<Component client:only-visible />
```

**指导原则：**
- `client:load` - 必需组件（Header、Sidebar、Footer）
- `client:visible` - 功能模块（Search、QRCode、ThemeToggle）
- `client:idle` - 非关键功能
- `client:only-visible` - 很少使用的功能

## 组件结构模板

```astro
---
// 1. 导入
import { siteConfig } from '../site.config';
import { i18n } from '../i18n/translation';
import I18nKey from '../i18n/i18nKey';
import RelatedComponent from './RelatedComponent.astro';

// 2. 数据获取（服务端）
const data = await fetchData();

// 3. Props 接口
interface Props {
  title?: string;
  class?: string;
}

const { title = "默认值", class: className = "" } = Astro.props;

// 4. 组件 HTML
<div class={`component ${className}`}>
  <slot />
</div>

// 5. 样式（作用域）
<style>
  .component {
    /* 组件特定样式 */
  }
</style>

// 6. 脚本（客户端）
<script>
  // 导入客户端依赖
  import { navigate } from 'astro:transitions/client';

  // 定义函数
  function initComponent() {
    // 组件初始化逻辑
  }

  // 绑定事件监听器
  document.addEventListener('astro:page-load', initComponent);
</script>
```

## 状态管理

### 组件级状态

```astro
<script>
  let isOpen = false;
  let count = 0;

  function toggle() {
    isOpen = !isOpen;
  }
</script>
```

### 共享状态（全局）

```javascript
// 用于跨组件通信
window.sharedState = {
  theme: 'dark',
  drawerOpen: false,
};

// 或使用 Astro View Transitions
navigate('/path', { state: { key: 'value' } });
```

## 代码组织

### 章节顺序

```astro
---
// 1. 前言（Frontmatter）
---

// 2. Props 接口
interface Props { ... }

// 3. 组件 HTML
<div>...</div>

// 4. 样式
<style>...</style>

// 5. 脚本
<script>...</script>
```

### 注释规范

```astro
---
// 导入外部库
import Library from 'library';

// 获取服务端数据
const data = await fetchData();

// 定义 Props
interface Props { ... }

// 组件渲染
<div>
  <!-- 主内容 -->
  <slot />
  <!-- 嵌套组件 -->
  <ChildComponent />
</div>

<!-- 作用域样式 -->
<style>
  /* 为复杂样式使用描述性注释 */
</style>

<!-- 客户端初始化 -->
<script>
  // 导入客户端库
  import { navigate } from 'astro:transitions/client';

  // 定义初始化函数
  function init() { ... }

  // 事件监听器
  document.addEventListener('astro:page-load', init);
</script>
```

## 组件架构

### 推荐项目结构

```
src/
├── components/
│   ├── containers/           # 容器/包装组件
│   │   ├── Appbar.astro
│   │   ├── Toolbar.astro
│   │   └── Drawer.astro
│   ├── features/             # 功能模块
│   │   ├── SearchModule.astro
│   │   ├── QRCodeModule.astro
│   │   ├── ThemeToggle.astro
│   │   └── PhotoSwipe.astro
│   ├── layout/              # 布局组件
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   ├── Footer.astro
│   │   └── BaseHead.astro
│   ├── ui/                  # UI 组件
│   │   ├── FilterButton.astro
│   │   └── FormattedDate.astro
│   ├── cards/               # 卡片组件
│   │   ├── AlbumCard.astro
│   │   ├── DiaryCard.astro
│   │   └── AnimeCard.astro
│   ├── svelte/              # Svelte 组件
│   │   ├── ProfileCard.svelte
│   │   ├── ReplyModule.svelte
│   │   └── TagCloud.svelte
│   └── PhotoSwipe.astro
├── layouts/                 # 页面布局
│   ├── Layout.astro
│   └── BlogPost.astro
├── pages/                   # 页面路由
└── styles/                  # 全局样式
```

### 组件分类

#### 1. 容器组件
**目的：** 提供结构的包装组件

**示例：**
- `Appbar.astro` - 顶部导航容器
- `Toolbar.astro` - Toolbar 内容容器
- `Drawer.astro` - 侧边抽屉容器

**特征：**
- 最小化逻辑
- 使用 slots 进行组合
- 应用基础样式

#### 2. 功能模块
**目的：** 具有特定功能的自包含组件

**示例：**
- `SearchModule.astro` - 搜索输入 + 验证 + 导航
- `QRCodeModule.astro` - 二维码生成
- `ThemeToggle.astro` - 暗/亮色模式切换
- `PhotoSwipe.astro` - 图片灯箱

**特征：**
- 100-200 行
- 单一功能聚焦
- 可能使用懒加载
- 事件驱动初始化

#### 3. 布局组件
**目的：** 高级页面结构组件

**示例：**
- `Header.astro` - 页面头部（组合多个模块）
- `Sidebar.astro` - 页面侧边栏
- `Footer.astro` - 页面底部

**特征：**
- 100-300 行
- 组合其他组件
- 最小化逻辑
- 委托给子组件

#### 4. UI 组件
**目的：** 可复用的 UI 元素

**示例：**
- `FilterButton.astro` - 过滤切换按钮
- `FormattedDate.astro` - 日期格式化器

**特征：**
- < 100 行
- 纯展示性
- 高度可复用
- 基于 Props 的配置

## 代码拆分策略

### 1. 识别拆分机会

#### 组件需要拆分的迹象
- ❌ 组件 > 500 行
- ❌ 多个不相关的功能
- ❌ 难以理解
- ❌ 难以测试
- ❌ 修改影响多个功能

#### 何时拆分

```javascript
// 拆分条件：
if (组件行数 > 500 ||
    有多个不相关功能 ||
    难以维护) {
  拆分组件();
}
```

### 2. 拆分流程

#### 步骤 1：识别功能
列出组件中的所有功能：
1. Appbar 结构
2. 抽屉导航
3. 搜索功能
4. 二维码生成
5. 主题切换
6. 导航菜单

#### 步骤 2：分组相关功能
```
组 1：Appbar 结构
  - Appbar.astro
  - Toolbar.astro

组 2：抽屉导航
  - Drawer.astro
  - 导航菜单

组 3：功能模块
  - SearchModule.astro
  - QRCodeModule.astro
  - ThemeToggle.astro
```

#### 步骤 3：提取到新组件
- 创建新组件文件
- 复制相关代码
- 更新导入
- 更新引用

#### 步骤 4：更新父组件
- 导入新组件
- 使用组件替换提取的代码
- 测试功能

### 3. 懒加载策略

#### 重型库

```javascript
// ❌ 错误：立即导入
import QRCode from 'qrcode';

// ✅ 正确：懒加载
async function initQRCode() {
  const QRCode = await import('qrcode');
  QRCode.toCanvas(canvas, url, options);
}
```

#### 可选功能

```astro
<!-- ❌ 错误：立即加载 -->
<OptionalFeature client:load />

<!-- ✅ 正确：可见时加载 -->
<OptionalFeature client:visible />

<!-- ✅ 更好：交互时加载 -->
<OptionalFeature client:only-visible />

<!-- ✅ 最佳：空闲时加载 -->
<OptionalFeature client:idle />
```

## 最佳实践

### 1. 使用 Slots 提高灵活性

```astro
<!-- 父组件 -->
<div class="container">
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>

<!-- 使用 -->
<Parent>
  <div slot="header">自定义头部</div>
  <div>内容</div>
  <div slot="footer">自定义底部</div>
</Parent>
```

### 2. 使用 Props 进行配置

```astro
---
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const { variant = 'primary', size = 'medium' } = Astro.props;
---

<button class={`btn btn-${variant} btn-${size}`}>
  <slot />
</button>
```

### 3. 保持样式作用域

```astro
<style>
  .my-component {
    /* 组件特定样式 */
  }

  /* 避免全局选择器 */
  /* :global(div) { ... } */
</style>
```

### 4. 使用 TypeScript 接口

```astro
---
interface Props {
  title: string;
  description?: string;
  action?: () => void;
}

interface State {
  isOpen: boolean;
  count: number;
}
---
```

### 5. 处理客户端事件

```javascript
// 清理事件监听器
function init() {
  document.addEventListener('astro:page-load', handler);
}

function cleanup() {
  document.removeEventListener('astro:page-load', handler);
}

// 使用自定义元素自动清理
document.addEventListener('astro:page-load', () => {
  if (!element.dataset.bound) {
    element.dataset.bound = 'true';
    element.addEventListener('click', handler);
  }
});
```

## 迁移指南

### 重构大型组件

#### 重构前（733 行）

```astro
---
import { siteConfig } from '../site.config';
import { getCollection } from 'astro:content';
import { i18n } from '../i18n/translation';
import I18nKey from '../i18n/i18nKey';
import DrawerProfile from './svelte/DrawerProfile.svelte';

// ... 700+ 行混合关注点的代码

const posts = await getCollection('post');
// ... 复杂数据处理

<div class="mdui-appbar mdui-shadow-0 mdui-appbar-fixed mdui-appbar-scroll-hide">
  <!-- Appbar 结构 -->
</div>

<div class="mdui-drawer mdui-drawer-close mdui-drawer-full-height drawer" id="main-drawer">
  <!-- 包含所有导航的抽屉结构 -->
</div>

<style>
  /* 所有样式混在一起（400+ 行） */
</style>

<script>
  import QRCode from 'qrcode';
  import { navigate } from 'astro:transitions/client';

  // 所有逻辑混在一起（200+ 行）
  function initHeader() {
    // 二维码逻辑
    // 抽屉逻辑
    // 搜索逻辑
    // 主题切换逻辑
    // 导航逻辑
  }

  document.addEventListener('astro:page-load', initHeader);
</script>
```

#### 重构后（6 个组件，~65 行主组件）

```astro
---
// Header.astro（组合层）
import Appbar from './Appbar.astro';
import Toolbar from './Toolbar.astro';
import Drawer from './Drawer.astro';

// Appbar.astro（容器，~15 行）
<div class="mdui-appbar mdui-shadow-0 mdui-appbar-fixed mdui-appbar-scroll-hide">
  <slot />
</div>

// Toolbar.astro（容器，~8 行）
<div class="mdui-toolbar">
  <slot />
</div>

// Drawer.astro（功能，~180 行）
---
import DrawerProfile from './svelte/DrawerProfile.svelte';
import { siteConfig } from '../site.config';
import { getCollection } from 'astro:content';
import { i18n } from '../i18n/translation';
import I18nKey from '../i18n/i18nKey';

const posts = await getCollection('post');
// 数据处理
---

<div class="mdui-drawer mdui-drawer-close mdui-drawer-full-height drawer">
  <DrawerProfile social={siteConfig.social} client:load />
  <!-- 导航菜单 -->
</div>

<style>
  /* Drawer 特定样式 */
</style>

<script>
  import { navigate } from 'astro:transitions/client';

  // Drawer 特定逻辑
  function initDrawer() {
    // 抽屉打开/关闭逻辑
    // 导航逻辑
  }

  document.addEventListener('astro:page-load', initDrawer);
</script>

// SearchModule.astro（功能，~150 行）
---
import { i18n } from '../i18n/translation';
import I18nKey from '../i18n/i18nKey';
import { navigate } from 'astro:transitions/client';
---

<div class="mdui-textfield mdui-textfield-expandable appbar-search">
  <button class="mdui-textfield-icon mdui-btn mdui-btn-icon" id="open-search">
    <i class="mdui-icon material-icons">search</i>
  </button>
  <input class="mdui-textfield-input" type="text" id="search-input"
         placeholder={i18n(I18nKey.searchPlaceholder)} autocomplete="off" />
</div>

<style>
  /* 搜索特定样式 */
</style>

<script>
  import { navigate } from 'astro:transitions/client';

  // 搜索特定逻辑
  function initSearch() {
    // 搜索输入验证
    // 提交时导航
  }

  document.addEventListener('astro:page-load', initSearch);
</script>

// QRCodeModule.astro（功能，~60 行）
---
<mdui-dropdown id="qrcode-dropdown" trigger="click" placement="bottom-end">
  <button class="mdui-btn mdui-btn-icon" slot="trigger" id="open-qrcode">
    <i class="mdui-icon material-icons">devices</i>
  </button>
  <div class="qrcode-container">
    <canvas id="qrcode-canvas"></canvas>
  </div>
</mdui-dropdown>

<style>
  /* 二维码特定样式 */
</style>

<script>
  async function initQRCode() {
    const QRCode = await import('qrcode');
    const url = window.location.href;
    QRCode.toCanvas(qrcodeCanvas, url, options);
  }

  document.addEventListener('astro:page-load', initQRCode);
</script>

// ThemeToggle.astro（功能，~40 行）
---
<button id="toggle-dark-mode" class="mdui-btn mdui-btn-icon">
  <i class="mdui-icon material-icons" id="dark-mode-icon">brightness_5</i>
</button>

<script>
  function initThemeToggle() {
    // 主题切换逻辑
  }

  document.addEventListener('astro:page-load', initThemeToggle);
</script>

<!-- Header.astro（组合，~65 行） -->
---
import Appbar from './Appbar.astro';
import Toolbar from './Toolbar.astro';
import Drawer from './Drawer.astro';
import SearchModule from './SearchModule.astro';
import QRCodeModule from './QRCodeModule.astro';
import ThemeToggle from './ThemeToggle.astro';
---

<Appbar>
  <Toolbar>
    <button class="mdui-btn mdui-btn-icon" id="toggle-drawer">
      <i class="mdui-icon material-icons">menu</i>
    </button>
    <a href="/" class="mdui-typo-title">{siteConfig.title}</a>
    <div class="mdui-toolbar-spacer"></div>
    <SearchModule />
    <QRCodeModule />
    <ThemeToggle />
  </Toolbar>
</Appbar>

<Drawer />

<style>
  .mdui-typo-title {
    text-decoration: none;
    color: inherit;
  }
</style>

<script>
  import 'mdui/components/dropdown.js';
  import 'mdui/components/icon.js';
</script>
```

## 性能影响

### 重构前
```
Header.astro: 733 行，30K JS
```

### 重构后
```
Header.astro:       65 行，45K JS（主）+ chunks
Appbar.astro:       15 行，~2K JS
Toolbar.astro:      8 行，~1K JS
Drawer.astro:       180 行，1.9K JS
SearchModule.astro:  150 行，1.4K JS
QRCodeModule.astro:  60 行，0.59K JS（懒加载）
ThemeToggle.astro:  40 行，<1K JS
```

### 改进
- **可维护性**: +91%（733 → 65 行主组件）
- **代码组织**: 1 个大组件 → 6 个聚焦组件
- **懒加载**: 二维码仅在需要时加载
- **缓存**: 独立的 chunks 更好地缓存
- **测试**: 更容易测试单个功能

## 测试策略

### 单元测试

```javascript
// 测试单个组件
describe('SearchModule', () => {
  it('应该初始化搜索输入', () => { });
  it('应该在提交时导航', () => { });
  it('应该在按 ESC 时关闭', () => { });
});
```

### 集成测试

```javascript
// 测试组件组合
describe('Header', () => {
  it('应该渲染所有模块', () => { });
  it('应该处理抽屉切换', () => { });
  it('应该更新主题', () => { });
});
```

### 端到端测试
- 测试用户流程
- 测试组件交互
- 测试导航

## 代码审查检查清单

在提交代码前，请确保：

- [ ] 组件行数 < 500（除非有充分理由）
- [ ] 遵循单一职责原则（SRP）
- [ ] 使用 TypeScript 接口定义 Props
- [ ] 重型库使用懒加载（`await import()`）
- [ ] 可选功能使用适当的 Hydration 指令（`client:visible`）
- [ ] 使用 slots 提高灵活性
- [ ] 保持样式作用域
- [ ] 清理事件监听器（使用 `dataset.bound`）
- [ ] 文件命名符合规范（PascalCase、Module 后缀）
- [ ] 代码格式化通过（`npm run format`）
- [ ] Lint 检查通过（`npm run lint`）

## 参考资源

- [Astro 组件最佳实践](https://docs.astro.build/zh-cn/core-concepts/astro-components/)
- [Astro View Transitions](https://docs.astro.build/zh-cn/guides/view-transitions/)
- [组件驱动开发](https://componentdriven.org/)

## 相关文档

- [CODE_FORMAT.md](../CODE_FORMAT.md) - 代码格式规范
- [01-no-view-transitions.md](./01-no-view-transitions.md) - ViewTransitions 使用规范
- [02-no-important-css.md](./02-no-important-css.md) - CSS 规范
- [03-mdui-theme-system.md](./03-mdui-theme-system.md) - MDUI 主题系统
- [04-i18n-requirements.md](./04-i18n-requirements.md) - i18n 国际化规范

---

**最后更新**: 2026-03-12
**维护者**: Aruma 开发团队
