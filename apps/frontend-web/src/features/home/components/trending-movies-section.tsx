"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { PageContainer } from "@/components/common/layout/page-shell";
import { ResponsiveText } from "@/components/common/typography";
import { getTrendingMovies } from "../api/home.api";
import type { HomeMovie } from "../types/home.types";

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 42, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function TrendingMoviesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isNearViewport = useInView(sectionRef, {
    once: true,
    margin: "320px 0px",
  });

  const [movies, setMovies] = useState<HomeMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!isNearViewport || hasLoaded) return;

    const controller = new AbortController();

    async function loadTrendingMovies() {
      try {
        setIsLoading(true);
        const data = await getTrendingMovies(12, controller.signal);
        setMovies(data);
        setHasLoaded(true);
      } catch {
        if (!controller.signal.aborted) setMovies([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadTrendingMovies();

    return () => controller.abort();
  }, [isNearViewport, hasLoaded]);

  return (
    <section ref={sectionRef} className="relative bg-zinc-50 py-12 text-zinc-950 sm:py-16 lg:py-20 dark:bg-[#050606] dark:text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

      <PageContainer>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <ResponsiveText variant="eyebrow">
              Đang được quan tâm
            </ResponsiveText>
            <ResponsiveText as="h2" variant="sectionTitle" className="mt-3 lg:text-4xl">
              Xu hướng hiện nay
            </ResponsiveText>
          </div>

          <Link
            href="/movies"
            className="hidden text-xs font-extrabold uppercase text-zinc-500 transition hover:text-[#e50914] dark:text-zinc-400 md:inline-flex"
          >
            Xem tất cả
          </Link>
        </div>

        {isLoading && movies.length === 0 ? (
          <div className="flex gap-3 overflow-hidden sm:gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[280px] min-w-[156px] animate-pulse bg-zinc-200 min-[390px]:min-w-[170px] sm:h-[360px] sm:min-w-[220px] dark:bg-white/[0.07]"
              />
            ))}
          </div>
        ) : null}

        {movies.length > 0 ? (
          <motion.div
            className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] sm:-mx-2 sm:gap-5 sm:px-2 [&::-webkit-scrollbar]:hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.22 }}
            variants={listVariants}
          >
            {movies.map((movie) => {
              const imageUrl = movie.posterUrl || movie.backdropUrl || "/window.svg";

              return (
                <motion.article
                  key={movie.id}
                  className="group relative min-w-[156px] snap-start min-[390px]:min-w-[170px] sm:min-w-[220px]"
                  variants={cardVariants}
                  transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/movies/${movie.slug ?? movie.id}`} className="block">
                    <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900 shadow-[0_18px_38px_rgba(15,23,42,0.16)] ring-1 ring-black/10 transition duration-500 group-hover:-translate-y-2 group-hover:ring-[#e50914]/70 dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)] dark:ring-white/10">
                      <Image
                        src={imageUrl}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 46vw, 220px"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90" />
                      <div className="absolute inset-0 bg-[#e50914]/0 transition duration-500 group-hover:bg-[#e50914]/10" />
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-black/60 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
                        <Star className="size-3 fill-[#e50914] text-[#e50914]" />
                        {movie.averageRating ?? "8.0"}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-4 pb-6">
                        <p className="text-[10px] font-extrabold uppercase text-[#ff1f2d]">
                          {movie.genre ?? "Cinema"}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-base font-black uppercase leading-5 text-white">
                          {movie.title}
                        </h3>
                      </div>

                      <div className="absolute inset-x-4 bottom-3 h-[3px] overflow-hidden bg-white/15">
                        <span className="block h-full origin-left scale-x-0 bg-[#e50914] shadow-[0_0_18px_rgba(229,9,20,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        ) : null}
      </PageContainer>
    </section>
  );
}
