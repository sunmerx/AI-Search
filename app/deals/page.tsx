import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { readLocalItems } from "@/lib/localStore";
import { abs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI 优惠/白嫖信息",
  description: "全球 AI 平台免费额度、优惠信息、白嫖 API 汇总。AWS $200、Azure $200、GCP $300、Devin $270 等。",
  alternates: { canonical: abs("/deals") },
};

const CREDIT_CHEATSHEET = [
  { name: "AWS", credit: "$200", duration: "12个月", how: "注册 aws.amazon.com → 绑信用卡 → 自动获得" },
  { name: "Azure", credit: "$200", duration: "30天", how: "注册 azure.microsoft.com → 绑卡 → 自动获得" },
  { name: "Google Cloud", credit: "$300", duration: "90天", how: "注册 cloud.google.com → 绑卡 → $300" },
  { name: "Devin", credit: "$270", duration: "新用户", how: "注册 (https://devin.ai) → 自动获得额度" },
  { name: "OpenRouter", credit: "$1", duration: "一次性", how: "注册 openrouter.ai → 自动到账" },
  { name: "Together AI", credit: "$1", duration: "新用户", how: "注册 together.ai → API Keys 页领取" },
  { name: "Groq", credit: "免费API", duration: "持续", how: "注册 console.groq.com → 申请 API Key → 免费使用（有速率限制）" },
  { name: "Replicate", credit: "免费GPU时长", duration: "新用户", how: "注册 replicate.com → 获取免费额度" },
  { name: "Modal", credit: "$30/月", duration: "持续", how: "注册 modal.com → 每月自动刷新" },
];

export default function DealsPage() {
  const items = readLocalItems();
  const dealItems = items.filter((i) => i.origin === "deals").sort((a, b) => (b.heat ?? 0) - (a.heat ?? 0));

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-brand-600">← 返回首页</Link>
        </div>

        <h1 className="text-2xl font-bold dark:text-gray-100 mb-1">🆓 AI 优惠 & 白嫖信息</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          全球 AI 平台免费额度、新用户优惠、白嫖 API 汇总。每日自动更新。
        </p>

        {/* 经典额度速查表 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded-sm"></span>
            经典免费额度速查
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">平台</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">额度</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">有效期</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">获取方式</th>
                </tr>
              </thead>
              <tbody>
                {CREDIT_CHEATSHEET.map((item) => (
                  <tr key={item.name} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="py-2.5 px-3 font-medium dark:text-gray-200">{item.name}</td>
                    <td className="py-2.5 px-3 text-green-600 dark:text-green-500 font-medium">{item.credit}</td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{item.duration}</td>
                    <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400 text-xs">{item.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 最新优惠信息 */}
        <section>
          <h2 className="text-lg font-semibold dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded-sm"></span>
            最新优惠/开源项目
          </h2>
          {dealItems.length === 0 ? (
            <p className="text-sm text-gray-500">暂无优惠信息数据，等待下次数据抓取。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dealItems.slice(0, 20).map((item) => (
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
