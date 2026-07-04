import { XMLParser } from "fast-xml-parser";
import type { AIItem, CategoryKey } from "../../lib/types";
import { getText, hashId, stripHtml, toIso, truncate } from "../lib/fetchUtil";
import type { SourceAdapter } from "./types";

interface FeedDef {
  id: string;
  label: string;
  url: string;
  source: string;
  /** Fallback category before the classifier runs over the merged set. */
  category: CategoryKey;
  /** General-purpose feed: keep only AI-related items. */
  aiOnly?: boolean;
}

// Reputable, public RSS/Atom feeds spanning Chinese + English AI coverage:
// model labs, research blogs, the tech press, and community. Each is fetched
// independently — a single dead feed never sinks the crawl.
const FEEDS: FeedDef[] = [
  // —— 模型实验室 ——
  { id: "rss:openai", label: "OpenAI News", url: "https://openai.com/news/rss.xml", source: "OpenAI", category: "ai-models" },
  { id: "rss:google-ai", label: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", source: "Google AI", category: "ai-models" },
  { id: "rss:deepmind", label: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", source: "Google DeepMind", category: "ai-models" },
  { id: "rss:anthropic", label: "Anthropic", url: "https://www.anthropic.com/rss/feed.xml", source: "Anthropic", category: "ai-models" },
  { id: "rss:meta-ai", label: "Meta AI", url: "https://ai.meta.com/blog/rss.xml", source: "Meta AI", category: "ai-models" },
  { id: "rss:nvidia", label: "NVIDIA Blog", url: "https://blogs.nvidia.com/feed/", source: "NVIDIA", category: "ai-models", aiOnly: true },
  { id: "rss:hf-blog", label: "HuggingFace Blog", url: "https://huggingface.co/blog/feed.xml", source: "HuggingFace Blog", category: "ai-models" },

  // —— Agent / MCP 公司 ——
  { id: "rss:anthropic-mcp", label: "Anthropic MCP", url: "https://modelcontextprotocol.io/feed.xml", source: "MCP", category: "ai-products" },
  { id: "rss:openai-agents", label: "OpenAI Agents", url: "https://openai.com/feed/agents.xml", source: "OpenAI Agents", category: "ai-products" },
  { id: "rss:cursor", label: "Cursor Blog", url: "https://www.cursor.com/feed.xml", source: "Cursor", category: "ai-products" },
  { id: "rss:devin", label: "Devin Blog", url: "https://devin.ai/feed.xml", source: "Devin", category: "ai-products" },
  { id: "rss:claude-code", label: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code/rss.xml", source: "Claude Code", category: "ai-products" },

  // —— 研究 / 技术博客 ——
  { id: "rss:bair", label: "BAIR Blog", url: "https://bair.berkeley.edu/blog/feed.xml", source: "Berkeley AI Research", category: "paper" },
  { id: "rss:simonwillison", label: "Simon Willison", url: "https://simonwillison.net/atom/everything/", source: "Simon Willison", category: "tip", aiOnly: true },
  { id: "rss:aws-ml", label: "AWS ML Blog", url: "https://aws.amazon.com/blogs/machine-learning/feed/", source: "AWS ML", category: "tip" },
  { id: "rss:msr", label: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/feed/", source: "Microsoft Research", category: "paper", aiOnly: true },
  { id: "rss:lilianweng", label: "Lil'Log", url: "https://lilianweng.github.io/index.xml", source: "Lilian Weng", category: "tip" },
  { id: "rss:raschka", label: "Ahead of AI", url: "https://magazine.sebastianraschka.com/feed", source: "Sebastian Raschka", category: "tip" },
  { id: "rss:thegradient", label: "The Gradient", url: "https://thegradient.pub/rss/", source: "The Gradient", category: "tip", aiOnly: true },
];

const AI_KEYWORDS = [
  "ai", "a.i", "人工智能", "大模型", "模型", "llm", "gpt", "claude", "gemini", "llama",
  "智能体", "agent", "生成式", "多模态", "神经网络", "机器学习", "深度学习", "openai",
  "anthropic", "deepseek", "通义", "千问", "qwen", "文心", "豆包", "kimi", "moonshot",
  "训练", "推理", "算力", "gpu", "芯片", "nvidia", "cuda",
  "开源模型", "diffusion", "扩散", "rag", "微调", "embedding", "transformer", "agi",
  "neural", "machine learning", "deep learning", "chatbot", "copilot", "stable diffusion",
  "sora", "midjourney", "cursor", "devin", "manus", "智谱", "glm", "baichuan", "yi-",
];

const MAX_PER_FEED = Number(process.env.RSS_MAX_PER_FEED || 20);

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return text(v[0]);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("#text" in o) return String(o["#text"]);
    if ("@_href" in o) return String(o["@_href"]);
  }
  return "";
}

/** Atom <link> can be an array of rel-typed links; prefer rel="alternate". */
function atomLink(v: unknown): string {
  if (Array.isArray(v)) {
    const alt = v.find((l) => (l as Record<string, unknown>)?.["@_rel"] === "alternate");
    return text(alt ?? v[0]);
  }
  return text(v);
}

function isAiRelated(title: string, summary: string): boolean {
  const hay = `${title} ${summary}`.toLowerCase();
  return AI_KEYWORDS.some((k) => hay.includes(k));
}

function cleanSummary(raw: string): string | null {
  const s = stripHtml(raw);
  if (!s || s.includes("点击查看原文")) return null;
  return truncate(s, 180);
}

function normUrl(u: string | null): string | null {
  if (!u) return null;
  const s = u.trim();
  if (s.startsWith("//")) return "https:" + s;
  return /^https?:\/\//i.test(s) ? s : null;
}

function pickUrl(v: unknown): string | null {
  if (!v) return null;
  if (Array.isArray(v)) {
    for (const x of v) {
      const u = pickUrl(x);
      if (u) return u;
    }
    return null;
  }
  if (typeof v === "string") return normUrl(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return normUrl((o["@_url"] as string) || (o["@_href"] as string) || (o["url"] as string) || "");
  }
  return null;
}

function imgFromHtml(html: unknown): string | null {
  if (!html) return null;
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? normUrl(m[1]) : null;
}

const BLOCKED_IMG_DOMAINS = ["img.36krcdn.com", "static.36kr.com", "static.geekpark.net"];

function isBlockedImage(url: string): boolean {
  try { return BLOCKED_IMG_DOMAINS.some((d) => new URL(url).hostname === d); } catch { return false; }
}

/** Best-effort cover image from common RSS/Atom media fields (no extra requests). */
function extractImage(it: Record<string, unknown>): string | null {
  const enc = it.enclosure as Record<string, unknown> | undefined;
  if (enc) {
    const type = String((enc["@_type"] as string) || "");
    if (!type || type.startsWith("image")) {
      const u = pickUrl(enc);
      if (u) return u;
    }
  }
  const group = it["media:group"] as Record<string, unknown> | undefined;
  const raw =
    pickUrl(it["media:content"]) ||
    pickUrl(it["media:thumbnail"]) ||
    pickUrl(group?.["media:content"]) ||
    pickUrl(it.image) ||
    imgFromHtml(it["content:encoded"]) ||
    imgFromHtml(it.description) ||
    imgFromHtml(it.content) ||
    null;
  if (raw && isBlockedImage(raw)) return null;
  return raw;
}

async function fetchFeed(feed: FeedDef): Promise<AIItem[]> {
  const xml = await getText(feed.url, { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" });
  const doc = parser.parse(xml);
  const rawItems = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? doc?.["rdf:RDF"]?.item ?? [];
  const list = Array.isArray(rawItems) ? rawItems : [rawItems];

  const out: AIItem[] = [];
  for (const it of list.slice(0, MAX_PER_FEED)) {
    const title = text(it.title).trim();
    const link = (atomLink(it.link) || text(it.guid) || text(it.id)).trim();
    if (!title || !link) continue;
    const summary =
      cleanSummary(
        text(it.description) ||
          text(it["content:encoded"]) ||
          text(it.summary) ||
          text(it.content),
      ) ?? "";
    if (feed.aiOnly && !isAiRelated(title, summary)) continue;
    out.push({
      id: hashId(feed.id, link),
      title,
      summary: summary || null,
      source: feed.source,
      sourceUrl: link,
      category: feed.category,
      publishedAt: toIso(text(it.pubDate) || text(it.published) || text(it.updated) || text(it["dc:date"])),
      image: extractImage(it),
      aiSelected: true,
      origin: feed.id,
    });
  }
  return out;
}

export const rssAdapters: SourceAdapter[] = FEEDS.map((feed) => ({
  id: feed.id,
  label: feed.label,
  fetch: () => fetchFeed(feed),
}));
