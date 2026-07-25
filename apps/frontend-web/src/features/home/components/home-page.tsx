import { HomePageData } from "../types/home.types";
import { PageBody, PageSection } from "@/components/common/layout/page-shell";
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
    <PageBody>
      {data.hero ? (
        <HeroSection movies={data.trendingMovies.length > 0 ? data.trendingMovies : [data.hero]} />
      ) : (
        <PageSection
          className="flex min-h-[520px] items-center pt-24 text-center sm:min-h-[640px]"
          innerClassName="flex justify-center"
        >
          <p className="max-w-md text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Chưa có phim nổi bật để hiển thị.
          </p>
        </PageSection>
      )}

      <TrendingMoviesSection />
      <NowShowingSection />
      <SpotlightTrailerSection />
      <PromotionsSection />
      <NearbyCinemasSection />
    </PageBody>
  );
}
