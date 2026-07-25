import { cn } from "@/lib/utils";

type PageBodyProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

type PageSectionProps = PageBodyProps &
  Readonly<{
    innerClassName?: string;
  }>;

export function PageBody({ children, className }: PageBodyProps) {
  return (
    <main
      className={cn(
        "min-h-screen w-full overflow-x-hidden bg-zinc-50 pb-24 text-zinc-950 transition-colors md:pb-0 dark:bg-[#050606] dark:text-white",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function PageContainer({ children, className }: PageBodyProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] min-w-0 px-4 sm:px-6 lg:px-10 xl:px-16", className)}>
      {children}
    </div>
  );
}

export function PageSection({ children, className, innerClassName }: PageSectionProps) {
  return (
    <section className={cn("relative overflow-hidden py-14 sm:py-16 lg:py-20 xl:py-24", className)}>
      <PageContainer className={innerClassName}>{children}</PageContainer>
    </section>
  );
}
