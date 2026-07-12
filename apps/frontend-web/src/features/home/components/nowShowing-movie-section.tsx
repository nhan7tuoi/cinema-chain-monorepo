"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock3, Ticket } from "lucide-react";
import { getNowShowingMovies } from "../api/home.api";
import type { HomeMovie } from "../types/home.types";

export function NowShowingSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "300px 0px" });

  const [movies, setMovies] = useState<HomeMovie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inView || movies.length > 0) return;

    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const data = await getNowShowingMovies(10, controller.signal);
        setMovies(data);
      } catch {
        if (!controller.signal.aborted) setMovies([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [inView, movies.length]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-20 transition-colors dark:bg-black">
      <div className="absolute left-0 top-16 h-40 w-px bg-[#e50914]/70" />
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#e50914]">
          Lịch chiếu hôm nay
        </p>

        <h2 className="mt-3 text-4xl font-black uppercase italic leading-none text-zinc-950 dark:text-white lg:text-5xl">
          Phim đang chiếu
        </h2>

        {loading ? (
          <div className="mt-9 flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-[348px] min-w-[210px] animate-pulse bg-zinc-200 dark:bg-white/[0.07]" />
            ))}
          </div>
        ) : null}

        <motion.div
          className="-mx-2 mt-9 flex gap-4 overflow-x-auto px-2 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.065 } },
          }}
        >
          {movies.map((movie) => (
            <motion.article
              key={movie.id}
              className="group min-w-[214px]"
              variants={{
                hidden: { opacity: 0, y: 34, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="border border-zinc-200 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.12)] transition duration-500 group-hover:-translate-y-2 group-hover:border-[#e50914] dark:border-white/10 dark:bg-[#080909] dark:shadow-[0_18px_50px_rgba(0,0,0,0.42)] dark:group-hover:shadow-[0_24px_60px_rgba(229,9,20,0.16)]">
                <Link href={`/movies/${movie.slug ?? movie.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                    <Image
                      src={movie.posterUrl || movie.backdropUrl || "/window.svg"}
                      alt={movie.title}
                      fill
                      sizes="214px"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <span className="absolute left-3 top-3 bg-[#e50914] px-2 py-1 text-[10px] font-black uppercase text-white">
                      {movie.ageRating ?? "T13"}
                    </span>
                  </div>
                </Link>

                <div className="p-3.5">
                  <p className="line-clamp-1 text-[10px] font-bold uppercase text-[#e50914]">
                    {movie.genre ?? "Đang chiếu"}
                  </p>

                  <h3 className="mt-1 line-clamp-1 text-sm font-extrabold text-zinc-950 dark:text-white">
                    {movie.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                    <Clock3 className="size-3" />
                    <span>{movie.duration ? `${movie.duration} phút` : "Lịch chiếu hôm nay"}</span>
                  </div>

                  <Link
                    href={`/tickets?movieId=${movie.id}`}
                    className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 bg-zinc-900 text-xs font-bold uppercase text-white transition hover:bg-[#e50914] dark:bg-zinc-800"
                  >
                    <Ticket className="size-3" />
                    Đặt vé
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
