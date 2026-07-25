"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Home, Tag, Ticket, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Tickets", href: "/tickets", icon: Ticket },
  { label: "Discounts", href: "/promotions", icon: Tag },
  { label: "Profile", href: "/login", icon: UserRound },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#202322]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-3 shadow-[0_-18px_44px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
    >
      <div className="relative mx-auto grid h-16 max-w-md grid-cols-5 items-center">
        <Link
          href="/movies"
          aria-label="Movies"
          className="absolute left-1/2 top-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e50914] text-white shadow-[0_12px_28px_rgba(229,9,20,0.55)] ring-4 ring-[#2b2f2e]"
        >
          <Clapperboard className="size-6 fill-current" />
        </Link>

        {navItems.slice(0, 2).map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-bold text-zinc-300 transition",
                isActive && "text-[#ff1f2d]",
              )}
            >
              <Icon className="size-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <div aria-hidden="true" />

        {navItems.slice(2).map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-bold text-zinc-300 transition",
                isActive && "text-[#ff1f2d]",
              )}
            >
              <Icon className="size-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
