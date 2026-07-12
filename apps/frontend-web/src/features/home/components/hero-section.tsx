"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Ticket } from "lucide-react";
import { HomeMovie } from "../types/home.types";

type HeroSectionProps = {
  movies: HomeMovie[];
};

const SLIDE_DURATION = 11000;

function getTitleSizeClass(title: string) {
  if (title.length > 52) {
    return "max-w-[860px] text-[clamp(2.45rem,4.2vw,4.2rem)]";
  }

  if (title.length > 32) {
    return "max-w-[760px] text-[clamp(2.85rem,5.2vw,5.15rem)]";
  }

  return "max-w-[640px] text-[clamp(3.25rem,7vw,6.5rem)]";
}

export function HeroSection({ movies }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const heroMovies = useMemo(
    () => movies.filter((movie) => movie.backdropUrl || movie.posterUrl).slice(0, 6),
    [movies],
  );

  const activeMovie = heroMovies[activeIndex] ?? heroMovies[0];

  useEffect(() => {
    if (shouldReduceMotion || heroMovies.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMovies.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [heroMovies.length, shouldReduceMotion]);

  useEffect(() => {
    if (activeIndex > heroMovies.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, heroMovies.length]);

  if (!activeMovie) return null;

  const backdrop = activeMovie.backdropUrl || activeMovie.posterUrl || "/window.svg";

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + heroMovies.length) % heroMovies.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % heroMovies.length);
  }

  return (
    <section className="relative min-h-svh overflow-hidden bg-black">
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
            priority={activeIndex === 0}
            sizes="100vw"
            className="object-cover object-center opacity-95"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_42%,rgba(229,9,20,0.28),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_34%,rgba(0,0,0,0.22)_72%),linear-gradient(0deg,#050606_0%,rgba(5,6,6,0.92)_8%,rgba(5,6,6,0)_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e50914]/70 to-transparent" />

      <div className="relative mx-auto flex min-h-svh max-w-[1440px] items-center px-6 pb-24 pt-28 lg:px-16 lg:pb-24 lg:pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie.id}
            className="max-w-[660px]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex items-center gap-2 text-[11px] font-extrabold uppercase">
              <span className="bg-[#e50914] px-2.5 py-1 text-white">IMAX</span>
              <span className="border border-white/15 bg-white/10 px-2.5 py-1 text-zinc-200 backdrop-blur">
                Dolby Cinema
              </span>
              <span className="ml-2 text-[#ff1f2d]">• Phim hot</span>
            </div>

            <h1
              className={`font-black uppercase italic leading-[0.88] tracking-normal text-white drop-shadow-2xl ${getTitleSizeClass(
                activeMovie.title,
              )}`}
            >
              {activeMovie.title}
            </h1>

            <p className="mt-5 max-w-[560px] text-[clamp(0.95rem,1.1vw,1rem)] font-medium leading-7 text-zinc-300">
              {activeMovie.synopsis ||
                "Trải nghiệm hành trình điện ảnh mãn nhãn với âm thanh, hình ảnh và cảm xúc được đẩy lên tối đa."}
            </p>

            <div className="mt-7 flex items-center gap-4">
              <Link
                href={`/tickets?movieId=${activeMovie.id}`}
                className="inline-flex h-12 items-center gap-2 bg-[#e50914] px-7 text-sm font-extrabold uppercase text-white shadow-[0_18px_46px_rgba(229,9,20,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ff1f2d]"
              >
                <Ticket className="size-4" />
                Đặt vé ngay
              </Link>

              {activeMovie.trailerUrl ? (
                <a
                  href={activeMovie.trailerUrl}
                  className="inline-flex h-12 items-center gap-2 border border-white/20 bg-white/10 px-7 text-sm font-extrabold uppercase text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Play className="size-4 fill-current" />
                  Xem trailer
                </a>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {heroMovies.length > 1 ? (
        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-[1440px] items-end justify-between px-6 lg:px-16">
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
              const isActive = index === activeIndex;

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
        </div>
      ) : null}
    </section>
  );
}
