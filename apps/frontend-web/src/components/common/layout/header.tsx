import Link from "next/link";
import { Bell, MapPin, Search, UserRound } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Phim", href: "/movies" },
  { label: "Khuyến mãi", href: "/discount" },
];

export function HeaderLayout() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/82 text-zinc-950 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-black/72 dark:text-white">
      <div className="mx-auto flex h-16 max-w-[1440px] min-w-0 items-center gap-2 px-4 sm:h-20 sm:px-6 md:gap-8 lg:px-10 xl:px-16">
        <Link
          href="/"
          className="min-w-0 shrink text-base font-extrabold uppercase tracking-tight text-[#e50914] sm:text-xl"
        >
          CinePremium
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 md:flex lg:gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            aria-label="Choose location"
            className="hidden h-10 items-center gap-2 px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white lg:flex"
          >
            <MapPin className="size-4 text-[#e50914]" />
            TP. Hồ Chí Minh
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-9 place-items-center border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 sm:size-10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#e50914]" />
          </button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <button
            type="button"
            aria-label="Search"
            className="hidden size-10 place-items-center text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white sm:grid"
          >
            <Search className="size-5" />
          </button>

          <Link
            href="/login"
            aria-label="Login"
            className="hidden size-10 place-items-center text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 sm:grid dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <UserRound className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
