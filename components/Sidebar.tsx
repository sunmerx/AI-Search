"use client";

import Link from "next/link";
import type { AIItem } from "@/lib/types";
import type { StoreMeta } from "@/lib/localStore";
import type { ViewState } from "./HomeClient";
import { buildHref } from "@/lib/href";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatBJDate } from "@/lib/timeFormat";
import TrendingList from "./TrendingList";
import SourceFilter from "./SourceFilter";
import { useLocale } from "./LocaleProvider";

export default function Sidebar({
  trending,
  meta,
  state,
  sources,
  topics,
  trendSummary,
  recommend,
}: {
  trending: AIItem[];
  meta?: StoreMeta | null;
  state: ViewState;
  sources: [string, number][];
  topics?: { slug: string; name: string; count: number }[];
  trendSummary?: string | null;
  recommend?: AIItem[];
}) {
  const { t } = useLocale();
  const top = trending.slice(0, 10);
  const failed = meta ? Object.keys(meta.errors ?? {}).length : 0;
  const topSources = sources.slice(0, 14);

  const sourceHref = (name: string) =>
    buildHref({
      category: state.category,
      mode: state.mode,
      since: state.since,
      keyword: state.keyword,
      source: state.source === name ? undefined : name,
    });

  return (
    <aside className="space-y-4">
      {/* 热门榜单 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold dark:text-gray-100 mb-1 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          {t("sidebar.trending")}
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">{t("sidebar.trending.desc")}</p>
        <TrendingList items={top} trendSummary={trendSummary} />
      </div>

      {/* 数据来源（可点筛选） */}
      {sources.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold dark:text-gray-100 mb-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            {t("sidebar.sources")}
          </h3>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2.5">
            {meta?.fetchedAt && <>{t("footer.updated")} {formatBJDate(meta.fetchedAt)} · </>}
            {sources.length} {t("sidebar.sources.count")}
            {failed > 0 && <span className="text-amber-500"> · {failed} {t("sidebar.sources.notUpdated")}</span>}
            <span className="text-gray-400"> · {t("sidebar.sources.filter")}</span>
          </div>
          <SourceFilter
            sources={topSources}
            activeSources={state.source ? state.source.split(",") : []}
          />
        </div>
      )}

      {/* 推荐阅读 */}
      {recommend && recommend.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold dark:text-gray-100 mb-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            {t("sidebar.recommend")}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">{t("sidebar.recommend.desc")}</p>
          <ul className="space-y-2.5">
            {recommend.map((it) => {
              const cat = it.category ? CATEGORY_MAP[it.category] : null;
              return (
                <li key={it.id} className="text-sm leading-snug">
                  <a href={it.sourceUrl} target="_blank" rel="noreferrer" className="group">
                    {cat && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 mr-1.5 align-middle">
                        {cat.label}
                      </span>
                    )}
                    <span className="text-gray-700 dark:text-gray-200 group-hover:text-brand-600">{it.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 热门话题 */}
      {topics && topics.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold dark:text-gray-100 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-500 rounded-sm" />
              {t("sidebar.topics")}
            </span>
            <Link href="/topics" className="text-[11px] text-brand-600 dark:text-brand-500 font-normal hover:underline">{t("sidebar.viewall")}</Link>
          </h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/topic/${t.slug}`}
                className="px-2.5 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600 transition"
              >
                {t.name}
                <span className="ml-1 text-gray-400">{t.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 快速入口 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold dark:text-gray-100 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          {t("sidebar.quicklinks")}
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <Link href="/daily" className="text-gray-700 dark:text-gray-300 hover:text-brand-600">
              · 今日 AI 资讯日报
            </Link>
          </li>
          <li>
            <Link href="/?category=ai-models&since=7d" className="text-gray-700 dark:text-gray-300 hover:text-brand-600">
              · 最近一周模型发布
            </Link>
          </li>
          <li>
            <Link href="/?category=paper&since=7d" className="text-gray-700 dark:text-gray-300 hover:text-brand-600">
              · 最近一周 AI 论文
            </Link>
          </li>
          <li>
            <Link href="/topic/agent" className="text-gray-700 dark:text-gray-300 hover:text-brand-600">
              · AI Agent 话题
            </Link>
          </li>
          <li>
            <Link href="/topic/opensource" className="text-gray-700 dark:text-gray-300 hover:text-brand-600">
              · 开源模型话题
            </Link>
          </li>
          <li>
            <Link href="/?keyword=OpenAI" className="text-gray-700 dark:text-gray-300 hover:text-brand-600">
              · OpenAI 相关
            </Link>
          </li>
        </ul>
      </div>

    </aside>
  );
}
