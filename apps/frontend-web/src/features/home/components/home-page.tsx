import { HomePageData } from "../types/home.types";
import { HeroSection } from "./hero-section";
import { NearbyCinemasSection } from "./nearby-cinemas-section";
import { NowShowingSection } from "./nowShowing-movie-section";
import { PromotionsSection } from "./promotions-section";
import { SpotlightTrailerSection } from "./spotlight-trailer-section";
import { TrendingMoviesSection } from "./trending-movies-section";

type HomePageProps = {
  data: HomePageData;
};

export function Homepage({ data }: HomePageProps) {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-[#050606] dark:text-white">
      {data.hero ? (
        <HeroSection movies={data.trendingMovies.length > 0 ? data.trendingMovies : [data.hero]} />
      ) : (
        <section className="flex min-h-[720px] items-center justify-center px-8 pt-20 text-center">
          <p className="max-w-md text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Chưa có phim nổi bật để hiển thị.
          </p>
        </section>
      )}

      <TrendingMoviesSection />
      <NowShowingSection />
      <SpotlightTrailerSection />
      <PromotionsSection />
      <NearbyCinemasSection />
    </main>
  );
}
