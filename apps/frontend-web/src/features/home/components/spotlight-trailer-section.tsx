"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Share2, Ticket } from "lucide-react";
import { getComingSoonMovies } from "../api/home.api";
import type { HomeMovie } from "../types/home.types";

function getCountdown(releaseDate?: string | Date | null) {
  if (!releaseDate) {
    return { days: "12", hours: "08", minutes: "45" };
  }

  const target = new Date(releaseDate).getTime();
  const diff = Math.max(0, target - Date.now());
  const minutesTotal = Math.floor(diff / 60000);
  const days = Math.floor(minutesTotal / 1440);
  const hours = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
  };
}

export function SpotlightTrailerSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "320px 0px",
  });

  const [movie, setMovie] = useState<HomeMovie | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inView || movie) return;

    const controller = new AbortController();

    async function loadSpotlight() {
      try {
        setLoading(true);
        const movies = await getComingSoonMovies(1, controller.signal);
        setMovie(movies[0] ?? null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadSpotlight();

    return () => controller.abort();
  }, [inView, movie]);

  const releaseText = useMemo(() => getCountdown(movie?.releaseDate), [movie?.releaseDate]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_48%,rgba(229,9,20,0.22),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.36em] text-[#e50914]">
            Siêu phẩm mong đợi
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase italic leading-none text-white lg:text-6xl">
            Vượt ngoài chân trời
          </h2>
        </motion.div>

        {loading ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-[380px_1fr]">
            <div className="h-[310px] animate-pulse bg-white/[0.07]" />
            <div className="h-[310px] animate-pulse bg-white/[0.07]" />
          </div>
        ) : null}

        {movie ? (
          <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-[390px_1fr]">
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="border border-white/10 border-l-[#e50914] bg-[#080909]/95 p-7 shadow-[0_26px_70px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-zinc-500">
                Đếm ngược công chiếu
              </p>

              <div className="mt-6 grid grid-cols-3 border border-white/10 bg-black/45">
                {[
                  ["Ngày", releaseText.days],
                  ["Giờ", releaseText.hours],
                  ["Phút", releaseText.minutes],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-white/10 p-4 last:border-r-0">
                    <p className="text-4xl font-black leading-none text-white">{value}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-6 text-2xl font-black uppercase italic leading-7 text-white">
                {movie.title}
              </h3>

              <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-400">
                {movie.synopsis ||
                  "Một chuyến hành trình vượt giới hạn không gian, thời gian và cảm xúc điện ảnh."}
              </p>

              <div className="mt-7 flex gap-3">
                <Link
                  href={`/tickets?movieId=${movie.id}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-white text-xs font-extrabold uppercase text-black transition hover:bg-[#e50914] hover:text-white"
                >
                  <Ticket className="size-4" />
                  Mua vé tối
                </Link>

                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center border border-white/15 text-white transition hover:border-[#e50914] hover:text-[#e50914]"
                  aria-label="Chia sẻ phim"
                >
                  <Share2 className="size-4" />
                </button>
              </div>
            </motion.div>

            <motion.a
              href={movie.trailerUrl ?? "#"}
              initial={{ opacity: 0, x: 36, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative min-h-[310px] overflow-hidden bg-zinc-900 shadow-[0_28px_90px_rgba(229,9,20,0.18)] ring-1 ring-white/10"
            >
              <Image
                src={movie.backdropUrl || movie.posterUrl || "/window.svg"}
                alt={movie.title}
                fill
                sizes="900px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45),rgba(0,0,0,0.08)),linear-gradient(0deg,rgba(0,0,0,0.72),transparent_54%)]" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-[#e50914]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex size-16 items-center justify-center bg-[#e50914] text-white shadow-[0_20px_60px_rgba(229,9,20,0.55)] transition duration-300 group-hover:scale-110">
                  <Play className="size-7 fill-current" />
                </span>
              </div>
            </motion.a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
