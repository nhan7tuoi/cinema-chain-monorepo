"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Ticket } from "lucide-react";
import { PageContainer } from "@/components/common/layout/page-shell";
import { ResponsiveText } from "@/components/common/typography";
import { HomeMovie } from "../types/home.types";

type HeroSectionProps = {
  movies: HomeMovie[];
};

const SLIDE_DURATION = 11000;

function getTitleSizeClass(title: string) {
  if (title.length > 52) {
    return "max-w-[860px] text-[1.7rem] min-[390px]:text-[1.95rem] sm:text-5xl lg:text-6xl";
  }

  if (title.length > 32) {
    return "max-w-[760px] text-[1.95rem] min-[390px]:text-[2.2rem] sm:text-6xl lg:text-7xl";
  }

  return "max-w-[640px] text-[2.2rem] min-[390px]:text-[2.6rem] sm:text-7xl lg:text-8xl";
}

export function HeroSection({ movies }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const heroMovies = useMemo(
    () => movies.filter((movie) => movie.backdropUrl || movie.posterUrl).slice(0, 6),
    [movies],
  );

  const safeActiveIndex = heroMovies.length > 0 ? activeIndex % heroMovies.length : 0;
  const activeMovie = heroMovies[safeActiveIndex];

  useEffect(() => {
    if (shouldReduceMotion || heroMovies.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMovies.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [heroMovies.length, shouldReduceMotion]);

  if (!activeMovie) return null;

  const backdrop = activeMovie.backdropUrl || activeMovie.posterUrl || "/window.svg";

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + heroMovies.length) % heroMovies.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % heroMovies.length);
  }

  return (
    <section className="relative min-h-[calc(100svh-4rem)] w-full overflow-hidden bg-black sm:min-h-[calc(100svh-5rem)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMovie.id}
          className="absolute inset-0"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.018 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.006 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={backdrop}
            alt={activeMovie.title}
            fill
            priority={safeActiveIndex === 0}
            sizes="100vw"
            className="object-cover object-[58%_center] opacity-95 sm:object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.22)_32%,rgba(0,0,0,0.92)_84%),linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.44)_68%,rgba(0,0,0,0.22)_100%)] sm:bg-[radial-gradient(circle_at_74%_42%,rgba(229,9,20,0.28),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_34%,rgba(0,0,0,0.22)_72%),linear-gradient(0deg,#050606_0%,rgba(5,6,6,0.92)_8%,rgba(5,6,6,0)_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e50914]/70 to-transparent" />

      <PageContainer className="relative flex min-h-[calc(100svh-4rem)] min-w-0 items-end pb-28 pt-24 sm:min-h-[calc(100svh-5rem)] sm:items-center sm:pb-24 sm:pt-28 lg:pb-24 lg:pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie.id}
            className="w-full min-w-0 max-w-[660px] pb-4 sm:pb-0"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 flex max-w-full flex-wrap items-center gap-1.5 text-[8px] font-extrabold uppercase sm:mb-5 sm:gap-2 sm:text-[11px]">
              <span className="bg-[#e50914] px-2 py-1 text-white sm:px-2.5">IMAX</span>
              <span className="border border-white/15 bg-black/25 px-2 py-1 text-zinc-200 backdrop-blur sm:bg-white/10 sm:px-2.5">
                Dolby Cinema
              </span>
              <span className="text-[#ff1f2d] sm:ml-2">• Phim hot</span>
            </div>

            <ResponsiveText
              as="h1"
              variant="heroTitle"
              className={getTitleSizeClass(activeMovie.title)}
            >
              {activeMovie.title}
            </ResponsiveText>

            <ResponsiveText
              variant="body"
              className="mt-3 line-clamp-3 max-w-[560px] text-[0.82rem] leading-6 text-zinc-200 sm:mt-5 sm:line-clamp-none sm:text-base"
            >
              {activeMovie.synopsis ||
                "Trải nghiệm hành trình điện ảnh mãn nhãn với âm thanh, hình ảnh và cảm xúc được đẩy lên tối đa."}
            </ResponsiveText>

            <div className="mt-5 flex w-full max-w-sm flex-col gap-2.5 sm:mt-7 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={`/tickets?movieId=${activeMovie.id}`}
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 bg-[#e50914] px-4 text-xs font-extrabold uppercase text-white shadow-[0_18px_46px_rgba(229,9,20,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ff1f2d] sm:h-12 sm:px-7 sm:text-sm"
              >
                <Ticket className="size-4" />
                Đặt vé ngay
              </Link>

              {activeMovie.trailerUrl ? (
                <a
                  href={activeMovie.trailerUrl}
                  className="inline-flex h-10 min-w-0 items-center justify-center gap-2 border border-white/15 bg-white/10 px-4 text-xs font-extrabold uppercase text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 sm:h-12 sm:px-7 sm:text-sm"
                >
                  <Play className="size-4 fill-current" />
                  Xem trailer
                </a>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </PageContainer>

      {heroMovies.length > 1 ? (
        <PageContainer className="absolute inset-x-0 bottom-4 z-10 hidden items-end justify-between sm:flex sm:bottom-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Phim trước"
              onClick={goToPrevious}
              className="grid size-10 place-items-center border border-white/15 bg-black/35 text-white backdrop-blur transition hover:border-[#e50914] hover:bg-[#e50914]"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Phim tiếp theo"
              onClick={goToNext}
              className="grid size-10 place-items-center border border-white/15 bg-black/35 text-white backdrop-blur transition hover:border-[#e50914] hover:bg-[#e50914]"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="hidden w-[420px] gap-3 md:flex">
            {heroMovies.map((movie, index) => {
              const isActive = index === safeActiveIndex;

              return (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group flex-1 text-left"
                  aria-label={`Chọn phim ${movie.title}`}
                >
                  <div className="h-[3px] overflow-hidden bg-white/18">
                    <span
                      className={`block h-full origin-left bg-[#e50914] transition-transform duration-500 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-2 line-clamp-1 text-[11px] font-extrabold uppercase transition ${
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")} {movie.title}
                  </p>
                </button>
              );
            })}
          </div>
        </PageContainer>
      ) : null}
    </section>
  );
}
