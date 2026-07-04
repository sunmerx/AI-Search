/**
 * Deals & Freebies adapter
 *
 * Scrapes publicly available sources for AI company promotions, free-tier offers,
 * discounted API access, and new open-source model releases that are free to use.
 * Falls back gracefully if any single source is unreachable.
 */
import type { AIItem } from "../../lib/types";
import { getJson, getText, truncate, hashId, toIso } from "../lib/fetchUtil";
import type { SourceAdapter } from "./types";

/* ── GitHub: repos related to free AI APIs / tools ── */

interface GHItem {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  created_at: string;
  topics?: string[];
}

interface GHSearch {
  items: GHItem[];
}

const FREE_TOPICS = [
  "free-ai",
  "free-api",
  "free-gpt",
  "free-llm-api",
  "free-ai-api",
  "free-models",
  "free-mcp",
  "free-agent",
  "free-tools",
];

const DAYS = 7; // only last 7 days for fresh deals
const PER_TOPIC = 5;

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function sinceDate(days = DAYS): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

async function fetchGitHubFreeRepos(): Promise<AIItem[]> {
  const since = sinceDate();
  const out: AIItem[] = [];
  for (const topic of FREE_TOPICS) {
    try {
      const q = encodeURIComponent(`topic:${topic} created:>${since}`);
      const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=${PER_TOPIC}`;
      const data = await getJson<GHSearch>(url, ghHeaders());
      for (const r of data.items || []) {
        out.push({
          id: `deal-gh-${hashId("deal", r.full_name)}`,
          title: `🆓 ${r.full_name}`,
          summary: r.description
            ? truncate(`[免费/开源] ${r.description}`, 160)
            : "免费 AI 相关开源项目",
          source: "GitHub Deals",
          sourceUrl: r.html_url,
          category: "ai-products",
          publishedAt: r.created_at,
          tags: [...(r.topics || []).slice(0, 3), "free", r.language].filter(Boolean) as string[],
          heat: r.stargazers_count,
          aiSelected: true,
          origin: "deals",
        });
      }
    } catch (e) {
      console.warn(`[deals] GitHub topic "${topic}" failed:`, e);
    }
  }
  return out;
}

/* ── Cursor changelog (HTML parse fallback) ── */

async function fetchCursorChangelog(): Promise<AIItem[]> {
  const out: AIItem[] = [];
  try {
    const html = await getText("https://www.cursor.com/changelog");
    // Look for changelog entries in the page
    const entries = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi) || [];
    for (let i = 0; i < Math.min(entries.length, 5); i++) {
      const article = entries[i];
      const titleMatch = article.match(/<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/i);
      const descMatch = article.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : null;
      if (!title) continue;
      out.push({
        id: `deal-cursor-${hashId("cursor", title)}`,
        title: `⚡ Cursor: ${title}`,
        summary: descMatch
          ? truncate(descMatch[1].replace(/<[^>]+>/g, "").trim(), 160)
          : "Cursor IDE 更新",
        source: "Cursor",
        sourceUrl: "https://www.cursor.com/changelog",
        category: "ai-products",
        publishedAt: new Date().toISOString(),
        tags: ["cursor", "IDE", "更新"],
        aiSelected: true,
        origin: "deals",
      });
    }
  } catch (e) {
    console.warn("[deals] Cursor changelog fetch failed:", e);
  }
  return out;
}

/* ── Search for free model announcements on HuggingFace ── */

interface HFModel {
  id: string;
  likes: number;
  downloads: number;
  createdAt: string;
  pipeline_tag?: string;
}

interface HFSearch {
  models: HFModel[];
}

async function fetchHFFreeModels(): Promise<AIItem[]> {
  const out: AIItem[] = [];
  try {
    const url =
      "https://huggingface.co/api/models?search=free+model&sort=likes&direction=-1&limit=10";
    const data = await getJson<HFSearch>(url);
    for (const m of data.models || []) {
      if (!m.id) continue;
      out.push({
        id: `deal-hf-${hashId("hfdeal", m.id)}`,
        title: `🤗 ${m.id}`,
        summary: `免费模型 · ${m.downloads?.toLocaleString() || "?"} 下载 · ${m.likes || 0} ❤️`,
        source: "HuggingFace Free Models",
        sourceUrl: `https://huggingface.co/${m.id}`,
        category: "ai-models",
        publishedAt: m.createdAt || null,
        tags: ["free", "model", m.pipeline_tag || "ml"].filter(Boolean) as string[],
        heat: m.likes || 0,
        aiSelected: true,
        origin: "deals",
      });
    }
  } catch (e) {
    console.warn("[deals] HF free models search failed:", e);
  }
  return out;
}

/* ── Adapter ── */

export const deals: SourceAdapter = {
  id: "deals",
  label: "AI Deals & Freebies",
  async fetch(): Promise<AIItem[]> {
    const results = await Promise.allSettled([
      fetchGitHubFreeRepos(),
      fetchCursorChangelog(),
      fetchHFFreeModels(),
    ]);
    const all: AIItem[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") all.push(...r.value);
    }
    // Tag every item with heat bonus so they surface to the top
    for (const item of all) {
      if (!item.heat || item.heat < 10) item.heat = 10 + Math.floor(Math.random() * 20);
    }
    console.log(`[deals] fetched ${all.length} deal/freebie items`);
    return all;
  },
};
