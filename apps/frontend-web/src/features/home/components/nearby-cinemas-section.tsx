"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { PageContainer } from "@/components/common/layout/page-shell";
import { ResponsiveText } from "@/components/common/typography";
import { getNearbyCinemas } from "../api/home.api";
import type { HomeCinema } from "../types/home.types";

export function NearbyCinemasSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "300px 0px",
  });

  const [cinemas, setCinemas] = useState<HomeCinema[]>([]);

  useEffect(() => {
    if (!inView || cinemas.length > 0) return;

    const controller = new AbortController();

    async function loadCinemas() {
      const data = await getNearbyCinemas(controller.signal);
      setCinemas(data);
    }

    loadCinemas();

    return () => controller.abort();
  }, [inView, cinemas.length]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-12 transition-colors sm:py-16 lg:py-20 xl:py-24 dark:bg-[#080b0a]">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

      <PageContainer className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,600px)] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ResponsiveText variant="eyebrow">
            Tìm kiếm rạp chiếu
          </ResponsiveText>

          <ResponsiveText as="h2" variant="sectionTitle" className="mt-3">
            Rạp phim gần bạn
          </ResponsiveText>

          <div className="mt-8 space-y-3 sm:mt-9">
            {cinemas.map((cinema, index) => (
              <Link
                key={cinema.id}
                href={`/cinemas/${cinema.id}`}
                className="group flex items-center justify-between gap-3 border border-zinc-200 bg-zinc-50 p-3 transition hover:border-[#e50914]/70 hover:bg-white sm:p-4 dark:border-white/5 dark:bg-black/35 dark:hover:bg-black/60"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span className="text-xl font-black italic text-zinc-300 transition group-hover:text-[#e50914] sm:text-2xl dark:text-white/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="line-clamp-2 text-sm font-extrabold uppercase text-zinc-950 dark:text-white">
                      {cinema.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {cinema.address} • {cinema.distance}
                    </p>
                  </div>
                </div>

                <MapPin className="size-4 shrink-0 text-[#e50914]" />
              </Link>
            ))}
          </div>

          <Link
            href="/cinemas"
            className="mt-7 inline-flex h-11 w-full items-center justify-center border border-[#e50914] px-5 text-xs font-extrabold uppercase text-zinc-950 transition hover:bg-[#e50914] hover:text-white sm:w-auto dark:text-white"
          >
            Tìm tất cả các rạp
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-zinc-200 ring-1 ring-black/10 sm:min-h-[340px] lg:min-h-[380px] dark:bg-[#202424] dark:ring-white/10"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:46px_46px] opacity-35 dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.14),transparent_38%)] dark:bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.18),transparent_38%)]" />

          <div className="relative text-center">
            <span className="mx-auto grid size-16 place-items-center border border-[#e50914]/60 bg-white/40 dark:bg-black/35">
              <Navigation className="size-8 text-[#e50914]" />
            </span>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300">
              Bản đồ rạp chiếu
            </p>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
