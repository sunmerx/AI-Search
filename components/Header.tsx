import { Suspense } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";

export default function Header({ defaultKeyword = "" }: { defaultKeyword?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            <path d="M14 5a9 9 0 1 1-4.5 16.8" stroke="currentColor" className="text-brand-500" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M20.5 21.5 26 27" stroke="currentColor" className="text-brand-500" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-semibold tracking-tight dark:text-white">AI Search</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <Suspense fallback={
            <div className="w-full h-9 rounded-full border border-gray-200 bg-gray-50 animate-pulse" />
          }>
            <SearchBar defaultValue={defaultKeyword} />
          </Suspense>
        </div>

        <NavLinks />
      </div>
    </header>
  );
}
