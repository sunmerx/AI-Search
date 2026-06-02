"use client";

import { useState, useRef } from "react";
import type { AIItem } from "@/lib/types";

const PROXY_URL = process.env.NEXT_PUBLIC_ASK_AI_URL ?? "";
const MODEL = "deepseek-chat";

function searchItems(items: AIItem[], query: string, limit = 15): AIItem[] {
  const q = query.toLowerCase();
  const scored = items
    .map((item) => {
      let score = 0;
      const title = item.title.toLowerCase();
      const summary = (item.summary ?? "").toLowerCase();
      const note = (item.aiNote ?? "").toLowerCase();
      if (title.includes(q)) score += 10;
      for (const word of q.split(/\s+/)) {
        if (word.length < 2) continue;
        if (title.includes(word)) score += 5;
        if (summary.includes(word)) score += 2;
        if (note.includes(word)) score += 2;
        if (item.source.toLowerCase().includes(word)) score += 3;
      }
      if (item.heat) score += Math.min(item.heat / 500, 3);
      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((s) => s.item);
}

function buildContext(items: AIItem[]): string {
  return items
    .map((i, idx) => {
      const parts = [`[${idx + 1}] ${i.title}`];
      if (i.source) parts.push(`来源: ${i.source}`);
      if (i.publishedAt) parts.push(`日期: ${i.publishedAt.slice(0, 10)}`);
      if (i.summary) parts.push(`摘要: ${i.summary.slice(0, 120)}`);
      if (i.aiNote) parts.push(`AI点评: ${i.aiNote}`);
      if (i.sourceUrl) parts.push(`链接: ${i.sourceUrl}`);
      return parts.join("\n");
    })
    .join("\n\n");
}

export default function AskAI({ items }: { items: AIItem[] }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  if (!PROXY_URL) return null;

  async function ask() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");

    const relevant = searchItems(items, question);
    const context = buildContext(relevant);

    const systemPrompt = `你是 AI Search 的智能助手。用户会问关于 AI 行业的问题，你需要基于以下站内资讯数据来回答。
回答要求：
- 用中文回答，简洁有条理
- 引用具体的资讯标题和来源
- 如果数据中没有相关信息，诚实说明
- 不要编造不存在的内容

以下是与用户问题相关的站内资讯（共 ${relevant.length} 条）：

${context}`;

    try {
      const res = await fetch(`${PROXY_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
        }),
      });

      if (!res.ok) {
        setAnswer(`请求失败 (${res.status})，请稍后再试。`);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setLoading(false); return; }
      const decoder = new TextDecoder();
      let buf = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.replace(/^data: /, "").trim();
          if (!trimmed || trimmed === "[DONE]") continue;
          try {
            const json = JSON.parse(trimmed);
            const delta = json.choices?.[0]?.delta?.content ?? "";
            full += delta;
            setAnswer(full);
          } catch {}
        }
      }
    } catch (e) {
      setAnswer(`网络错误：${e instanceof Error ? e.message : String(e)}`);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition flex items-center justify-center"
        title="问 AI"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3A7 7 0 0 1 12 2Z" />
          <path d="M9 21h6M10 17v4M14 17v4" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:right-6 z-50 md:w-[380px] max-h-[70vh] md:max-h-[520px] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold dark:text-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-brand-500 text-white grid place-items-center text-xs font-bold">AI</span>
          问 AI
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 grid place-items-center transition"
        >
          ✕
        </button>
      </div>

      {/* Answer area */}
      <div ref={answerRef} className="flex-1 overflow-y-auto px-4 py-3 min-h-[120px] max-h-[300px]">
        {!answer && !loading && (
          <div className="text-sm text-gray-400 dark:text-gray-500 text-center mt-8 space-y-2">
            <p>基于站内 {items.length} 条资讯回答你的问题</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {["最近有什么 AI 大事？", "OpenAI 最近发布了什么？", "有哪些值得关注的开源项目？"].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="px-2.5 py-1 text-[11px] rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-600 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {(answer || loading) && (
          <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {answer}
            {loading && <span className="inline-block w-1.5 h-4 bg-brand-500 animate-pulse ml-0.5 align-middle rounded-sm" />}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-gray-100 dark:border-gray-700">
        <form
          onSubmit={(e) => { e.preventDefault(); ask(); }}
          className="flex gap-2"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="问一个关于 AI 行业的问题..."
            disabled={loading}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="shrink-0 w-9 h-9 rounded-xl bg-brand-500 text-white grid place-items-center hover:bg-brand-600 transition disabled:opacity-40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
