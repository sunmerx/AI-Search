import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Analytics from "@/components/Analytics";
import ThemeSync from "@/components/ThemeSync";
import AutoUpdate from "@/components/AutoUpdate";
import LocaleProvider from "@/components/LocaleProvider";
import MobileNav from "@/components/MobileNav";
import ScrollToTop from "@/components/ScrollToTop";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/seo";

const TITLE = "AI Search · AI 行业资讯聚合";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · AI Search" },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ["AI 资讯", "人工智能", "大模型", "LLM", "AI 新闻", "AI 日报", "AI Agent", "机器学习", "AI 工具"],
  authors: [{ name: "keyuchen-del", url: "https://github.com/keyuchen-del" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "zh_CN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Search" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE_DESC, images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#2453ee",
};

const DARK_MODE_SCRIPT = `(function(){try{if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DARK_MODE_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        <a href="#main-content" className="skip-link">
          跳到主内容
        </a>
        <LocaleProvider>
        {children}
        <MobileNav />
        <ScrollToTop />
        </LocaleProvider>
        <ThemeSync />
        <AutoUpdate />
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
