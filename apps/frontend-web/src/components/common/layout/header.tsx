import Link from "next/link";
import { MapPin, Search, UserRound } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Phim", href: "/movies" },
  { label: "Vé", href: "/tickets" },
  { label: "Rạp chiếu", href: "/theaters" },
];

export function HeaderLayout() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/82 text-zinc-950 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-black/72 dark:text-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-10 px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-extrabold uppercase tracking-tight text-[#e50914]"
        >
          CinePremium
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
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

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Choose location"
            className="hidden h-10 items-center gap-2 px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white sm:flex"
          >
            <MapPin className="size-4 text-[#e50914]" />
            TP. Hồ Chí Minh
          </button>

          <ThemeToggle />

          <button
            type="button"
            aria-label="Search"
            className="grid size-10 place-items-center text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Search className="size-5" />
          </button>

          <Link
            href="/login"
            aria-label="Login"
            className="grid size-10 place-items-center text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <UserRound className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
