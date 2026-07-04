export type Locale = "zh" | "en";

const dict: Record<string, Record<Locale, string>> = {
  // Nav
  "nav.home": { zh: "首页", en: "Home" },
  "nav.daily": { zh: "日报", en: "Daily" },
  "nav.weekly": { zh: "周报", en: "Weekly" },
  "nav.trends": { zh: "趋势", en: "Trends" },
  "nav.topics": { zh: "话题", en: "Topics" },
  "nav.deals": { zh: "优惠", en: "Deals" },
  "nav.platforms": { zh: "平台", en: "Platforms" },
  "site.subtitle": { zh: "AI 行业资讯聚合", en: "AI News Aggregator" },

  // Search
  "search.placeholder": { zh: "搜索 AI 资讯、模型、工具...", en: "Search AI news, models, tools..." },
  "search.keyword": { zh: "搜索关键词", en: "Search keyword" },

  // Sidebar
  "sidebar.trending": { zh: "本周最热", en: "Trending This Week" },
  "sidebar.trending.desc": { zh: "按 GitHub Star / Hacker News 讨论热度排序", en: "Ranked by GitHub Stars / HN points" },
  "sidebar.sources": { zh: "数据来源", en: "Data Sources" },
  "sidebar.topics": { zh: "热门话题", en: "Hot Topics" },
  "sidebar.quicklinks": { zh: "快速入口", en: "Quick Links" },
  "sidebar.viewall": { zh: "查看全部", en: "View All" },
  "sidebar.recommend": { zh: "推荐阅读", en: "Recommended" },
  "sidebar.recommend.desc": { zh: "各方向精选，换个角度看 AI", en: "Curated picks across categories" },
  "sidebar.sources.filter": { zh: "点击筛选", en: "Click to filter" },
  "sidebar.sources.clear": { zh: "← 清除来源筛选", en: "← Clear source filter" },
  "sidebar.sources.notUpdated": { zh: "个未更新", en: "not updated" },
  "sidebar.sources.count": { zh: "个来源", en: "sources" },

  // Feed
  "feed.showing": { zh: "显示", en: "Showing" },
  "feed.items": { zh: "条", en: "items" },
  "feed.latest": { zh: "最新", en: "Latest" },
  "feed.hottest": { zh: "最热", en: "Hottest" },
  "feed.all": { zh: "全部", en: "All" },
  "feed.today": { zh: "今日新增", en: "New Today" },
  "feed.bookmarks": { zh: "收藏", en: "Bookmarks" },
  "feed.unread": { zh: "未读", en: "Unread" },
  "feed.personalize": { zh: "个性化", en: "Personalize" },
  "feed.export": { zh: "导出收藏", en: "Export" },
  "feed.exported": { zh: "已复制 ✓", en: "Copied ✓" },
  "feed.source": { zh: "来源", en: "Source" },
  "feed.prevPage": { zh: "上一页", en: "Prev" },
  "feed.nextPage": { zh: "下一页", en: "Next" },
  "feed.empty.bookmarks": { zh: "还没有收藏。点卡片右上角的 ★ 收藏感兴趣的内容。", en: "No bookmarks yet. Star items you like." },
  "feed.empty.today": { zh: "今天还没有新增内容。", en: "No new items today." },
  "feed.empty.unread": { zh: "没有未读内容了。", en: "All caught up!" },
  "feed.empty.default": { zh: "没有匹配的内容，换个关键词或分类试试。", en: "No matches. Try different keywords or categories." },

  // Card
  "card.source": { zh: "来源", en: "Source" },
  "card.ai": { zh: "AI 点评", en: "AI Take" },
  "card.uncategorized": { zh: "未分类", en: "Uncategorized" },
  "card.read": { zh: "已读", en: "Read" },

  // Category
  "cat.all": { zh: "全部", en: "All" },
  "cat.ai-models": { zh: "模型发布/更新", en: "Models" },
  "cat.ai-products": { zh: "产品发布/更新", en: "Products" },
  "cat.industry": { zh: "行业动态", en: "Industry" },
  "cat.paper": { zh: "论文研究", en: "Papers" },
  "cat.tip": { zh: "技巧与观点", en: "Tips & Opinions" },
  "time.24h": { zh: "24 小时", en: "24h" },
  "time.3d": { zh: "3 天", en: "3d" },
  "time.7d": { zh: "7 天", en: "7d" },
  "time.30d": { zh: "30 天", en: "30d" },
  "cat.selected": { zh: "精选", en: "Selected" },
  "cat.selected.hint": { zh: "高质量条目", en: "Curated items" },
  "cat.everything": { zh: "全部", en: "Everything" },
  "cat.everything.hint": { zh: "含未精选的次要条目", en: "Including secondary items" },

  // Hero
  "hero.headline": { zh: "头条", en: "Featured" },

  // TopReads
  "topreads.title": { zh: "AI 每日必读", en: "AI Must-Reads" },
  "topreads.desc": { zh: "由 AI 从今日内容精选", en: "AI-curated from today's content" },

  // Footer
  "footer.about": { zh: "关于", en: "About" },
  "footer.privacy": { zh: "隐私", en: "Privacy" },
  "footer.total": { zh: "共", en: "" },
  "footer.totalSuffix": { zh: "条", en: "items" },
  "footer.updated": { zh: "数据更新于", en: "Updated" },

  // Trends
  "trends.title": { zh: "趋势洞察", en: "Trend Insights" },
  "trends.daily": { zh: "每日新增资讯量", en: "Daily New Items" },
  "trends.category": { zh: "分类趋势对比", en: "Category Trends" },
  "trends.topic": { zh: "热门话题趋势", en: "Topic Trends" },
  "trends.ranking": { zh: "话题热度排名", en: "Topic Ranking" },
  "trends.hover": { zh: "鼠标悬浮查看每日具体数值", en: "Hover to see daily values" },

  // Weekly
  "weekly.title": { zh: "AI 周报", en: "AI Weekly" },
  "weekly.top10": { zh: "本周 Top 10", en: "Top 10 This Week" },
  "weekly.activeSources": { zh: "本周活跃来源", en: "Active Sources" },

  // Timeline
  "timeline.title": { zh: "时间线", en: "Timeline" },

  // Topics
  "topics.title": { zh: "话题总览", en: "All Topics" },

  // Common
  "common.back": { zh: "← 返回首页", en: "← Back to Home" },
  "common.topic": { zh: "话题", en: "Topic" },
  "common.related": { zh: "条相关资讯 · 来自历史归档", en: "related items · from archive" },
};

export function t(key: string, locale: Locale): string {
  return dict[key]?.[locale] ?? dict[key]?.zh ?? key;
}

export function getLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  return (localStorage.getItem("ai-search-locale") as Locale) ?? "zh";
}

export function setLocale(locale: Locale) {
  localStorage.setItem("ai-search-locale", locale);
}
