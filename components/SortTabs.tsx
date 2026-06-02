"use client";

import Link from "next/link";
import type { Mode, CategoryKey } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

interface Props {
  mode: Mode;
  since: string;
  category: CategoryKey | "all";
  keyword?: string;
}

function href(params: {
  mode: Mode;
  since: string;
  category: string;
  keyword?: string;
}) {
  const sp = new URLSearchParams();
  if (params.category !== "all") sp.set("category", params.category);
  if (params.mode !== "selected") sp.set("mode", params.mode);
  if (params.since) sp.set("since", params.since);
  if (params.keyword) sp.set("keyword", params.keyword);
  sp.set("page", "1");
  return `/?${sp.toString()}`;
}

export default function SortTabs({ mode, since, category, keyword }: Props) {
  const { t } = useLocale();

  const modeOpts: { key: Mode; label: string }[] = [
    { key: "selected", label: t("cat.selected") },
    { key: "all", label: t("cat.everything") },
  ];

  const sinceOpts: { key: string; label: string }[] = [
    { key: "24h", label: t("time.24h") },
    { key: "3d", label: t("time.3d") },
    { key: "7d", label: t("time.7d") },
    { key: "30d", label: t("time.30d") },
  ];

  return (
    <div className="flex items-center mb-3 flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-sm">
          {modeOpts.map((o) => (
            <Link
              key={o.key}
              href={href({ mode: o.key, since, category, keyword })}
              scroll={false}
              className={
                "px-3 h-8 inline-flex items-center rounded-md transition-colors duration-150 " +
                (mode === o.key
                  ? "bg-brand-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-gray-800")
              }
            >
              {o.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 text-sm">
          {sinceOpts.map((o) => (
            <Link
              key={o.key}
              href={href({ mode, since: o.key, category, keyword })}
              scroll={false}
              className={
                "px-3 h-8 inline-flex items-center rounded-md transition-colors duration-150 " +
                (since === o.key
                  ? "bg-brand-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-gray-800")
              }
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
