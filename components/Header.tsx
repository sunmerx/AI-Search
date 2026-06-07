import Link from "next/link";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center text-sm font-bold shadow-sm">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight dark:text-white">AI Search</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <NavLinks />
      </div>
    </header>
  );
}
