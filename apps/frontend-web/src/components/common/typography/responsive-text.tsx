import { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

const textVariants = {
  heroTitle:
    "max-w-full break-words text-lg font-black uppercase leading-[1] tracking-normal text-white drop-shadow-2xl [overflow-wrap:anywhere] sm:text-3xl md:text-5xl lg:text-6xl",
  sectionTitle:
    "max-w-full break-words text-2xl font-black uppercase leading-tight tracking-normal text-zinc-950 sm:text-4xl sm:leading-none lg:text-5xl dark:text-white",
  sectionTitleLarge:
    "max-w-full break-words text-2xl font-black uppercase leading-tight tracking-normal text-zinc-950 sm:text-4xl sm:leading-none lg:text-6xl dark:text-white",
  cardTitle:
    "max-w-full break-words text-lg font-black leading-snug tracking-normal text-zinc-950 sm:text-xl dark:text-white",
  eyebrow:
    "max-w-full break-words text-[10px] font-extrabold uppercase leading-5 tracking-[0.14em] text-[#e50914] sm:text-[11px] sm:tracking-[0.28em]",
  eyebrowWide:
    "max-w-full break-words text-[10px] font-extrabold uppercase leading-5 tracking-[0.14em] text-[#e50914] sm:text-[11px] sm:tracking-[0.36em]",
  body:
    "max-w-full text-sm font-medium leading-6 tracking-normal text-zinc-600 sm:text-base sm:leading-7 dark:text-zinc-300",
  caption:
    "max-w-full text-xs font-medium leading-5 tracking-normal text-zinc-500 dark:text-zinc-400",
} as const;

type TextVariant = keyof typeof textVariants;

type ResponsiveTextProps<TElement extends ElementType> = {
  as?: TElement;
  children: ReactNode;
  className?: string;
  variant?: TextVariant;
} & Omit<React.ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">;

export function ResponsiveText<TElement extends ElementType = "p">({
  as,
  children,
  className,
  variant = "body",
  ...props
}: ResponsiveTextProps<TElement>) {
  const Component = as ?? "p";

  return (
    <Component className={cn(textVariants[variant], className)} {...props}>
      {children}
    </Component>
  );
}

export { textVariants };
