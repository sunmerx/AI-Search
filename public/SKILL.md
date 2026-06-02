# AI Search Skill

> 用自然语言获取每日 AI 行业资讯。无需 API Key。

## 触发词

- 今天 AI 圈有什么新东西
- 看一下最新的 AI 日报
- 最近 OpenAI 有什么发布
- AI 论文 / 开源模型 / 行业动态

## API

基础 URL `https://keyuchen-del.github.io/AI-Search/api/v1`

| 端点 | 说明 |
|------|------|
| `/daily/latest.json` | 最新日报 |
| `/daily/{YYYY-MM-DD}.json` | 指定日期 |
| `/items.json` | 全量条目（500 条） |
| `/category/ai-models.json` | 模型 |
| `/category/ai-products.json` | 产品 |
| `/category/industry.json` | 行业 |
| `/category/paper.json` | 论文 |
| `/category/tip.json` | 技巧 |
| `/digest.json` | AI 每日必读 |
| `/sources.json` | 来源列表 |

## 数据结构

```json
{ "title": "...", "source": "OpenAI", "sourceUrl": "https://...",
  "category": "ai-models", "publishedAt": "2026-06-01T12:00:00Z",
  "aiNote": "一句话点评", "summary": "摘要" }
```

## 安装

```bash
curl -fsSL https://keyuchen-del.github.io/AI-Search/install.sh | bash
```

支持 Claude Code · Cursor · Codex CLI · Gemini CLI · Cline · Windsurf
