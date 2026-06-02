<h1 align="center">🔍 AI Search</h1>

<p align="center">
  <strong>每天自动聚合全网 AI 资讯 · AI 解读 · 个性化 · 开放 API</strong><br/>
  <sub>Fork AI 信息提取总结 Skill · 内容换源（金融、医疗等）· 一键部署到自己的 Agent 中</sub>
</p>

<p align="center">
  <a href="https://keyuchen-del.github.io/AI-Search/">在线访问</a> &nbsp;·&nbsp;
  <a href="#-agent-接入一行命令">Agent 接入</a> &nbsp;·&nbsp;
  <a href="#-换源--变成任何领域的资讯站">换源指南</a> &nbsp;·&nbsp;
  <a href="#-快速开始">快速开始</a>
</p>

<p align="center">
  <a href="https://github.com/keyuchen-del/AI-Search/actions"><img src="https://github.com/keyuchen-del/AI-Search/actions/workflows/deploy.yml/badge.svg" alt="Build & Deploy" /></a>
  <a href="https://github.com/keyuchen-del/AI-Search/blob/main/LICENSE"><img src="https://img.shields.io/github/license/keyuchen-del/AI-Search" alt="License" /></a>
</p>

---

## 💡 这是什么

> "AI 圈一天发太多东西，等我反应过来已经过气了。"

一个**零服务器、零数据库**的 AI 行业资讯聚合站。GitHub Actions 每天自动从 20+ 公开来源抓取最新资讯，AI 生成一句话点评，静态部署到 GitHub Pages——访客不需要登录、不需要 API Key、没有任何成本。

## ✨ 能做什么

| 能力 | 说明 |
| --- | --- |
| **每日自动更新** | 20+ 源并行抓取，智能去重分类，单源失败不影响整体，每天自动重建部署 |
| **AI 解读** | 每条资讯一句话 AI 点评 + 每日必读精选 + 周报 AI 总结（DeepSeek，可选） |
| **多维度浏览** | 首页瀑布流 / 日报 / 周报 / 趋势图 / 话题聚合 / 时间线，6 种视角看资讯 |
| **交互式趋势** | 纯 SVG 折线图，hover 看数值，自定义日期范围，分类/话题筛选面板 |
| **个性化** | 关注/屏蔽来源 · 关注话题 · 收藏 · 已读 · 导出，全存浏览器本地，无需登录 |
| **全文搜索** | MiniSearch 模糊搜索 + ⌘K 命令面板 + 搜索历史 + 热词推荐 |
| **暗色模式** | 跟随 macOS / Windows / iOS / Android 系统偏好自动切换 |
| **中英文切换** | 全站 80+ 条 UI 文案一键切换语言 |
| **移动端适配** | 底部导航栏 + 响应式布局 + PWA 可安装到手机主屏 |
| **开放 API** | 静态 JSON 端点 + SKILL.md，让 Agent 用自然语言获取数据 |
| **一键换源** | 改一个数组，5 分钟变成金融/医疗/Web3/芯片的资讯站 |

---

## 🚀 快速开始

### 方式一：Fork 部署（5 分钟，零代码）

1. 点右上角 **Fork**
2. Settings → Pages → Source 选 **GitHub Actions**
3. _(可选)_ 添加 Secret `DEEPSEEK_API_KEY` 启用 AI 能力
4. Actions 里跑一次 **Build & Deploy**
5. 访问 `https://<你的用户名>.github.io/AI-Search/`

之后每天自动抓取重建，无需维护。

### 方式二：本地开发

```bash
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search && npm install
npm run crawl          # 抓取真实数据
npm run dev            # http://localhost:3000
npm test               # 运行测试
```

---

## 🤖 Agent 接入（一行命令）

让 Claude Code / Cursor / Codex / Gemini CLI 等 Agent 直接用自然语言获取 AI 资讯：

```bash
curl -fsSL https://keyuchen-del.github.io/AI-Search/install.sh | bash
```

安装后直接问你的 Agent：

```
"今天 AI 圈有什么新东西"
"最近 OpenAI 有什么发布"
"看下 AI 论文"
"Qwen 最新动态"
```

也可以直接调 JSON API（无需 Key）：

```bash
curl .../api/v1/daily/latest.json       # 最新日报
curl .../api/v1/items.json              # 全量资讯（500 条）
curl .../api/v1/category/ai-models.json # 按分类拉取
```

完整端点说明见 [SKILL.md](SKILL.md)。

---

## 🔄 换源 — 变成任何领域的资讯站

本项目是**通用资讯聚合模板**——换掉数据源和分类，它就是另一个领域的站。

### 示例：换成金融科技站

**第一步**：编辑 `scripts/sources/rss.ts`，替换 FEEDS 数组：

```typescript
const FEEDS: FeedDef[] = [
  { id: "rss:ft", label: "Financial Times", url: "https://www.ft.com/rss/home",
    source: "FT", category: "market" },
  { id: "rss:bloomberg", label: "Bloomberg",
    url: "https://feeds.bloomberg.com/markets/news.rss",
    source: "Bloomberg", category: "market" },
  { id: "rss:wsj", label: "WSJ",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    source: "WSJ", category: "market" },
];
```

**第二步**：编辑 `lib/categories.ts`，换分类：

```typescript
export const CATEGORIES = [
  { key: "market", label: "市场行情", desc: "全球市场动态" },
  { key: "fintech", label: "金融科技", desc: "Fintech 创新" },
  { key: "policy", label: "政策监管", desc: "央行与监管" },
  { key: "crypto", label: "加密货币", desc: "区块链与数字资产" },
];
```

**第三步**：

```bash
npm run crawl && npm run dev
```

> 同时修改 `lib/types.ts` 中的 `CategoryKey` 类型以匹配新分类。

---

## 📡 数据来源

当前覆盖 **25+ 公开 RSS / API**，每条资讯保留原始链接可溯源：

| 类别 | 来源 | 类型 |
|------|------|------|
| **模型实验室** | OpenAI | RSS |
| | Google AI Blog | RSS |
| | Google DeepMind | RSS |
| | HuggingFace Blog + Daily Papers | RSS + API |
| | NVIDIA Blog | RSS |
| **学术 / 深度** | arXiv (cs.AI / cs.CL / cs.LG) | API |
| | Lil'Log · Ahead of AI · The Gradient | RSS |
| | BAIR · Microsoft Research · MIT News | RSS |
| **科技媒体** | The Verge · TechCrunch · VentureBeat | RSS |
| | Ars Technica · MIT Tech Review · AWS ML | RSS |
| **社区** | Hacker News | API |
| | GitHub Trending | API |
| | Simon Willison | RSS |
| **中文** | 量子位 · 36氪 · IT之家 | RSS |
| | 少数派 · InfoQ 中文 | RSS |

> 加一个源只需在 `scripts/sources/rss.ts` 加一行。

---

## 📁 项目结构

| 目录 / 文件 | 说明 |
|-------------|------|
| `app/` | 页面路由 — 首页、日报、周报、趋势、话题、时间线、关于 |
| `components/` | 30+ React 组件 — 图表、搜索、个性化、移动端导航等 |
| `lib/` | 核心逻辑 — 类型定义、筛选排序、i18n、趋势计算、周报生成 |
| `scripts/` | 构建脚本 — 抓取编排、源适配器、API 生成、OG 图片生成 |
| `scripts/sources/` | 数据源适配器 — RSS / GitHub / Hacker News / arXiv / HF Papers |
| `data/` | 数据快照 — items + meta + digest + 月度归档（自动维护） |
| `tests/` | 单元测试 — Vitest，覆盖筛选和趋势核心逻辑 |
| `worker/` | Cloudflare Worker — AI 问答代理，隐藏 Key + IP 限流 |
| `public/` | 静态资源 — OG 图片、SW、SKILL.md、安装脚本 |
| `SKILL.md` | Agent 技能描述 — API 端点 + 触发词 + 数据结构 |
| `.github/` | CI/CD — 每日自动抓取 → 测试 → 构建 → 部署 |

---

## ⚙️ 环境变量

| 变量 | 说明 |
|------|------|
| `DEEPSEEK_API_KEY` | AI 点评/必读（不设则跳过，其余功能不受影响） |
| `NEXT_PUBLIC_ASK_AI_URL` | AI 问答代理地址（见 `worker/` 目录） |
| `NEXT_PUBLIC_BASE_PATH` | Pages 子路径（CI 自动设置） |

## 🤝 贡献

最常见的贡献是**加一个数据源**——在 `scripts/sources/rss.ts` 的 `FEEDS` 数组加一行：

```typescript
{ id: "rss:example", label: "Example", url: "https://example.com/feed.xml", source: "Example", category: "industry" },
```

验证：`npm run crawl -- --only=rss:example && npm run dev`，确认能抓到后提 PR。

## 👤 作者

**[@keyuchen-del](https://github.com/keyuchen-del)** · AI Product Manager · 关注 AI 产品与工程的交叉领域

## 📄 License

[MIT](LICENSE)
