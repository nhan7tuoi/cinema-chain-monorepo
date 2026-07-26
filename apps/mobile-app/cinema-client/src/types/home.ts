import { HomeMovie } from './movie';

export interface HomePromotion {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface HomeCinema {
  id: number;
  name: string;
  address: string;
  distance: string;
}

export interface HomePageData {
  hero: HomeMovie | null;
  trendingMovies: HomeMovie[];
  nowShowingMovies: HomeMovie[];
  promotions: HomePromotion[];
  cinemas: HomeCinema[];
}
