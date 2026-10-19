# 外部动漫数据源使用指南

本文档介绍如何在 Aruma 项目中配置和使用 Bilibili 和 Bangumi 数据源。

## 功能概述

Aruma 支持从以下数据源获取动漫数据：
- **本地数据** (`local`): 使用 `src/data/anime.json` 文件
- **Bilibili** (`bilibili`): 从 Bilibili API 拉取追番列表
- **Bangumi** (`bangumi`): 从 Bangumi.tv API 拉取观看列表
- **混合模式** (`mixed`): 合并所有数据源的数据

## 配置方法

### 1. 编辑 `src/site.config.ts`

找到 `animeSource` 配置项，修改如下：

```typescript
animeSource: {
  enable: true,  // 启用外部数据源
  mode: 'mixed', // 可选：'local', 'bilibili', 'bangumi', 'mixed'
  
  // Bilibili 配置
  bilibili: {
    userId: '你的 Bilibili 用户 ID',  // 必填
    amount: 50,                       // 拉取数量
    cacheTime: 86400                  // 缓存时间（秒），默认 24 小时
  },
  
  // Bangumi 配置
  bangumi: {
    userId: '你的 Bangumi 用户 ID',   // 必填
    amount: 50,                       // 拉取数量
    cacheTime: 86400                  // 缓存时间（秒）
  }
},
```

### 2. 获取用户 ID

#### Bilibili 用户 ID
1. 访问你的 Bilibili 个人空间
2. URL 格式：`https://space.bilibili.com/12345678`
3. 数字部分即为用户 ID

#### Bangumi 用户 ID
1. 访问你的 Bangumi 个人主页
2. URL 格式：`https://bgm.tv/user/yourname`
3. `yourname` 部分即为用户 ID

### 3. 配置 Token（可选）

Token 只能通过构建进程的环境变量提供，不要写入 `src/site.config.ts`、Markdown 或其他会提交到 Git 的文件。可参考仓库根目录的 `.env.example`，真实值应保存在当前 Shell 或部署平台的 Secret 管理器中。

#### Bilibili SESSDATA
1. 登录 Bilibili 网页版
2. 打开浏览器开发者工具（F12）
3. 在 Application/Cookie 中找到 SESSDATA
4. 复制其值，将它设置为 `BILIBILI_SESSDATA`

#### Bangumi Access Token

如需访问需要认证的 Bangumi 数据，将 Access Token 设置为 `BANGUMI_ACCESS_TOKEN`。

PowerShell 示例：

```powershell
$env:BILIBILI_SESSDATA = "your-sessdata"
$env:BANGUMI_ACCESS_TOKEN = "your-access-token"
pnpm build
```

Bash 示例：

```bash
BILIBILI_SESSDATA="your-sessdata" BANGUMI_ACCESS_TOKEN="your-access-token" pnpm build
```

## 构建和运行

### 首次构建
```bash
# 安装依赖
pnpm install

# 构建项目（会自动拉取外部数据）
pnpm build
```

### 单独拉取数据
```bash
# 手动运行数据拉取脚本
node scripts/fetch-external-anime.js
```

## 数据缓存

- 数据缓存在 `src/data/external-anime.json`
- 元数据（缓存时间等）在 `src/data/external-anime-meta.json`
- 缓存时间由 `cacheTime` 配置控制

## 字体优化

当启用外部数据源时，构建时会自动：
1. 从番剧数据中提取标题、描述等文本
2. 将提取的字符加入字体子集化
3. 生成优化的字体文件

## 页面功能

访问 `/anime` 页面可以：
- 查看所有番剧（按年份排序）
- 按状态过滤（全部、观看中、已完成、计划看）
- 搜索番剧
- 查看各数据源的统计信息

## 故障排除

### 数据拉取失败
1. 检查用户 ID 是否正确
2. 检查网络连接
3. 如使用私有数据，检查构建进程是否正确读取了 `BILIBILI_SESSDATA` 或 `BANGUMI_ACCESS_TOKEN`
4. 查看控制台错误信息

### 字体压缩失败
1. 确保 `external-anime.json` 文件存在
2. 检查 `animeSource.enable` 是否为 `true`

## 注意事项

- Bilibili API 有访问频率限制，建议设置合理的 `cacheTime`
- 部分 Bilibili 数据需要登录才能访问（需要 token）
- Bangumi API 可能需要 User-Agent 标识
