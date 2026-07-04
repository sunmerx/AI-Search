import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { readLocalItems } from "@/lib/localStore";
import { abs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI 平台导航 & 优惠信息",
  description: "全球 AI 平台目录导航 + 最新免费额度/优惠信息汇总（已核验）。覆盖大模型、API中转、云平台、Agent/IDE 等。",
  alternates: { canonical: abs("/deals") },
};

/* ── 完整平台数据 ── */

interface Platform {
  name: string;
  url: string;
  free: string;
  how?: string;
}

const PLATFORM_CATEGORIES: { title: string; icon: string; items: Platform[] }[] = [
  {
    title: "大模型公司", icon: "🤖",
    items: [
      { name: "OpenAI", url: "https://openai.com", free: "GPT-4o mini 免费; 新注册$5 API额度(3个月)", how: "chat.openai.com 免费用" },
      { name: "Anthropic (Claude)", url: "https://anthropic.com", free: "Claude 免费使用(有限次)" },
      { name: "Google Gemini", url: "https://ai.google.dev", free: "Gemini API 免费(60次/分钟)", how: "Google AI Studio 免费" },
      { name: "Meta (Llama)", url: "https://ai.meta.com", free: "Llama 系列开源免费", how: "自部署免费" },
      { name: "Mistral AI", url: "https://mistral.ai", free: "Mistral Small 免费API", how: "Le Chat 免费" },
      { name: "DeepSeek", url: "https://deepseek.com", free: "DeepSeek 免费API额度", how: "注册送500万tokens" },
      { name: "Cohere", url: "https://cohere.com", free: "免费API额度", how: "免费 Trial Key" },
      { name: "智谱AI (GLM)", url: "https://zhipuai.cn", free: "GLM 免费额度" },
      { name: "通义千问 (Qwen)", url: "https://tongyi.aliyun.com", free: "百万tokens/月免费", how: "阿里云模型服务" },
      { name: "字节豆包", url: "https://www.doubao.com", free: "免费API额度", how: "火山引擎注册" },
      { name: "Kimi (月之暗面)", url: "https://kimi.moonshot.cn", free: "免费使用(Web/App)" },
      { name: "百度文心一言", url: "https://yiyan.baidu.com", free: "ERNIE 免费API额度" },
      { name: "零一万物 Yi", url: "https://yi-api.01.ai", free: "Yi 免费API额度" },
      { name: "百川智能", url: "https://baichuan-ai.com", free: "百川免费API" },
      { name: "MiniMax", url: "https://minimax.com", free: "免费API额度" },
      { name: "Stability AI", url: "https://stability.ai", free: "SD 系列开源免费" },
      { name: "xAI (Grok)", url: "https://x.ai", free: "Grok 免费使用(X用户)", how: "X平台免费有限次" },
      { name: "Perplexity AI", url: "https://perplexity.ai", free: "免费版(有限搜索)", how: "Pro $20/月" },
      { name: "面壁智能 (MiniCPM)", url: "https://modelbest.cn", free: "MiniCPM 开源免费" },
      { name: "上海AI实验室 (InternLM)", url: "https://internlm.intern-ai.org.cn", free: "书生系列开源免费" },
      { name: "昆仑万维 (天工)", url: "https://skywork.com", free: "天工免费使用" },
    ],
  },
  {
    title: "API中转/聚合", icon: "🔌",
    items: [
      { name: "OpenRouter", url: "https://openrouter.ai", free: "新用户 $1 额度", how: "注册即得" },
      { name: "Together AI", url: "https://together.ai", free: "新用户 $1 额度" },
      { name: "Groq", url: "https://groq.com", free: "免费API(速率限制)", how: "LPU推理极快" },
      { name: "Fireworks AI", url: "https://fireworks.ai", free: "新用户 $1 额度" },
      { name: "DeepInfra", url: "https://deepinfra.com", free: "免费推理额度" },
      { name: "Replicate", url: "https://replicate.com", free: "免费GPU推理时长" },
      { name: "Modal", url: "https://modal.com", free: "$30/月免费额度" },
      { name: "Lepton AI", url: "https://lepton.ai", free: "免费额度" },
      { name: "API2D", url: "https://api2d.com", free: "注册优惠", how: "国内中转" },
      { name: "CloseAI", url: "https://closeai.com", free: "注册优惠", how: "国内中转" },
    ],
  },
  {
    title: "云平台(AI服务)", icon: "☁️",
    items: [
      { name: "AWS", url: "https://aws.amazon.com/free", free: "新用户 $200(6个月)", how: "绑卡→可用于Bedrock" },
      { name: "Azure", url: "https://azure.microsoft.com/free", free: "新用户 $200(30天)", how: "绑卡→可用于OpenAI" },
      { name: "Google Cloud", url: "https://cloud.google.com/free", free: "新用户 $300(90天)", how: "绑卡→可用于Vertex AI" },
      { name: "阿里云", url: "https://aliyun.com", free: "新用户免费额度", how: "含通义千问API" },
      { name: "火山引擎", url: "https://volcengine.com", free: "新用户赠送", how: "豆包大模型API" },
      { name: "腾讯云", url: "https://cloud.tencent.com", free: "新用户免费", how: "混元大模型API" },
      { name: "百度云", url: "https://cloud.baidu.com", free: "新用户免费", how: "文心大模型API" },
    ],
  },
  {
    title: "Agent / IDE / 开发工具", icon: "⚡",
    items: [
      { name: "Cursor", url: "https://cursor.com", free: "免费版(2000次/月)", how: "下载即用" },
      { name: "Devin", url: "https://devin.ai", free: "需邀请注册得$250", how: "找已有用户发邀请链接" },
      { name: "GitHub Copilot", url: "https://github.com/features/copilot", free: "免费版(2000次/月)", how: "学生/开源维护者免费" },
      { name: "Windsurf (Codeium)", url: "https://codeium.com", free: "免费版" },
      { name: "Cline", url: "https://github.com/cline/cline", free: "开源免费", how: "VS Code插件" },
      { name: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code", free: "需Claude API Key", how: "CLI工具" },
      { name: "Replit Agent", url: "https://replit.com", free: "免费版(有限)" },
      { name: "Bolt.new", url: "https://bolt.new", free: "免费版", how: "AI 全栈生成" },
      { name: "Lovable", url: "https://lovable.dev", free: "免费版" },
      { name: "v0.dev", url: "https://v0.dev", free: "免费版(有限)", how: "Vercel出品" },
      { name: "Manus", url: "https://manus.im", free: "" },
      { name: "Augment Code", url: "https://augmentcode.com", free: "免费版" },
      { name: "Continue.dev", url: "https://continue.dev", free: "开源免费", how: "VS Code/JetBrains插件" },
      { name: "Roo Code", url: "https://github.com/RooVetGit/Roo-Code", free: "开源免费" },
      { name: "Poe", url: "https://poe.com", free: "免费版(有限)", how: "Quora出品" },
      { name: "Phind", url: "https://phind.com", free: "免费版(有限)", how: "AI搜索引擎" },
    ],
  },
  {
    title: "信息/爆料渠道", icon: "📡",
    items: [
      { name: "Product Hunt (AI)", url: "https://producthunt.com/categories/ai", free: "新AI产品发布" },
      { name: "Hacker News Show", url: "https://news.ycombinator.com/show", free: "AI项目发布讨论" },
      { name: "Reddit r/FreeAI", url: "https://reddit.com/r/FreeAI", free: "免费AI资源汇总" },
      { name: "Reddit r/LocalLLaMA", url: "https://reddit.com/r/LocalLLaMA", free: "开源模型/免费模型发布" },
      { name: "GitHub Trending", url: "https://github.com/trending?since=daily", free: "每日AI新项目" },
      { name: "HuggingFace Daily", url: "https://huggingface.co/papers", free: "每日AI论文+模型" },
    ],
  },
];

export default function DealsPage() {
  const items = readLocalItems();
  const dealItems = items.filter((i) => i.origin === "deals").sort((a, b) => (b.heat ?? 0) - (a.heat ?? 0));

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-brand-600">← 返回首页</Link>
        </div>

        <h1 className="text-2xl font-bold dark:text-gray-100 mb-1">🆓 AI 平台导航 & 优惠信息</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          国内外 AI 平台目录导航 + 最新免费额度/优惠信息汇总。每日自动更新。
        </p>

        {/* ── 平台导航目录 ── */}
        <div className="space-y-8 mb-10">
          {PLATFORM_CATEGORIES.map((cat) => (
            <section key={cat.title}>
              <h2 className="text-lg font-semibold dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-amber-500 rounded-sm"></span>
                {cat.icon} {cat.title}
                <span className="text-xs text-gray-400 font-normal">({cat.items.length} 个)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {cat.items.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 bg-white dark:bg-gray-900 transition"
                  >
                    <span className="font-medium text-sm dark:text-gray-100 group-hover:text-amber-600">{p.name}</span>
                    {p.free && <span className="text-xs text-green-600 dark:text-green-500 mt-0.5">{p.free}</span>}
                    {p.how && <span className="text-xs text-gray-400 mt-0.5">💡 {p.how}</span>}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── 每日优惠列表 ── */}
        <section>
          <h2 className="text-lg font-semibold dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-sm"></span>
            📥 每日采集的最新优惠/开源项目
          </h2>
          {dealItems.length === 0 ? (
            <p className="text-sm text-gray-500">暂无数据，等待下次抓取。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealItems.slice(0, 30).map((item) => (
                <a
                  key={item.id}
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="card p-4 hover:border-amber-400 dark:hover:border-amber-600 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug dark:text-gray-100 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.heat != null && item.heat > 0 && (
                      <span className="shrink-0 text-xs text-amber-600 dark:text-amber-500 font-mono">
                        ⭐{item.heat}
                      </span>
                    )}
                  </div>
                  {item.summary && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">{item.source}</div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
