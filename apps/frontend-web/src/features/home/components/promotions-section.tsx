"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CreditCard, Gift, Ticket } from "lucide-react";
import { getHomePromotions } from "../api/home.api";
import type { HomePromotion } from "../types/home.types";

const icons = [Ticket, Gift, CreditCard];

export function PromotionsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "300px 0px",
  });

  const [promotions, setPromotions] = useState<HomePromotion[]>([]);

  useEffect(() => {
    if (!inView || promotions.length > 0) return;

    const controller = new AbortController();

    async function loadPromotions() {
      const data = await getHomePromotions(controller.signal);
      setPromotions(data);
    }

    loadPromotions();

    return () => controller.abort();
  }, [inView, promotions.length]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-zinc-50 py-24 transition-colors dark:bg-[#0b0f0e]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e50914]/35 to-transparent dark:via-[#e50914]/45" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#e50914]">
          Ưu đãi chỉ có tại CinePremium
        </p>

        <h2 className="mt-3 text-4xl font-black uppercase italic leading-none text-zinc-950 dark:text-white lg:text-5xl">
          Khuyến mãi đặc biệt
        </h2>

        <motion.div
          className="mt-9 grid gap-5 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09 } },
          }}
        >
          {promotions.map((promotion, index) => {
            const Icon = icons[index % icons.length];

            return (
              <motion.article
                key={promotion.id}
                className="group relative overflow-hidden border border-[#e50914]/45 bg-white p-7 shadow-[0_18px_38px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-1 hover:border-[#e50914] dark:border-[#e50914]/55 dark:bg-black/25 dark:shadow-none dark:hover:bg-black/45"
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.97 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute -right-12 -top-12 size-32 rounded-full bg-[#e50914]/10 blur-2xl transition group-hover:bg-[#e50914]/16" />

                <Icon className="size-6 text-[#e50914]" />

                <h3 className="mt-6 text-xl font-black text-zinc-950 dark:text-white">
                  {promotion.title}
                </h3>

                <p className="mt-3 min-h-[78px] text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {promotion.description}
                </p>

                <Link
                  href="/promotions"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase text-zinc-950 transition group-hover:text-[#e50914] dark:text-white"
                >
                  Chi tiết ưu đãi
                  <ArrowRight className="size-3.5" />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
