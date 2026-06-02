"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryKey, Mode } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

interface Props {
  active: CategoryKey | "all";
  mode: Mode;
  since?: string;
  keyword?: string;
}

function buildHref(opts: {
  category: string;
  mode: Mode;
  since?: string;
  keyword?: string;
}) {
  const sp = new URLSearchParams();
  if (opts.category !== "all") sp.set("category", opts.category);
  if (opts.mode !== "selected") sp.set("mode", opts.mode);
  if (opts.since) sp.set("since", opts.since);
  if (opts.keyword) sp.set("keyword", opts.keyword);
  sp.set("page", "1");
  return `/?${sp.toString()}`;
}

export default function CategoryNav({ active, mode, since, keyword }: Props) {
  const { t } = useLocale();
  const tabs: { key: CategoryKey | "all"; label: string }[] = [
    { key: "all", label: t("cat.all") },
    ...CATEGORIES.map((c) => ({ key: c.key, label: t(`cat.${c.key}`) })),
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scroll-hide">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <Link
              key={tab.key}
              href={buildHref({ category: tab.key, mode, since, keyword })}
              scroll={false}
              className={
                "shrink-0 px-3 h-11 flex items-center text-sm border-b-2 transition-colors duration-150 " +
                (isActive
                  ? "border-brand-500 text-brand-600 dark:text-brand-500 font-medium"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-brand-600")
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
