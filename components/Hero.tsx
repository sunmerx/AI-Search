"use client";

import { useState } from "react";
import type { AIItem } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { cleanText } from "@/lib/text";
import { useLocale } from "./LocaleProvider";

export default function Hero({ item }: { item: AIItem }) {
  const [imgError, setImgError] = useState(false);
  const { t } = useLocale();
  const cat = item.category ? CATEGORY_MAP[item.category] : null;
  const intro = item.aiNote || cleanText(item.summary);

  if (!item.image || imgError) {
    return (
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="card block overflow-hidden group mb-5"
      >
        <div className="relative h-32 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          <span className="text-white/80 text-4xl font-bold tracking-wider">AI</span>
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-medium backdrop-blur">{t("hero.headline")}</span>
            {cat && (
              <span className="text-xs px-2 py-0.5 rounded bg-black/30 text-white backdrop-blur">{cat.label}</span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-lg sm:text-xl font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-600 line-clamp-2">
            {item.title}
          </h2>
          {intro && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{intro}</p>}
          <div className="mt-3 text-xs text-gray-400">{t("card.source")}：{item.source}</div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="card block overflow-hidden group mb-5"
    >
      <div className="relative h-48 sm:h-64">
        <img
          src={item.image}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-brand-600 text-white font-medium shadow">{t("hero.headline")}</span>
          {cat && (
            <span className="text-xs px-2 py-0.5 rounded bg-black/55 text-white backdrop-blur">{cat.label}</span>
          )}
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-lg sm:text-xl font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-600 line-clamp-2">
          {item.title}
        </h2>
        {intro && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{intro}</p>}
        <div className="mt-3 text-xs text-gray-400">{t("card.source")}：{item.source}</div>
      </div>
    </a>
  );
}
