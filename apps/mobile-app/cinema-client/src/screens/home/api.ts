import apiClient from '@api/apiClient';

import { HomePromotion, HomeCinema, HomePageData } from '@type/home';
import { HomeMovie } from '@type/movie';

const delay = (ms: number) => new Promise(res => setTimeout(() => res(undefined), ms));

export const getHomePageData = async (): Promise<HomePageData> => {
  await delay(5000);
  const hotMoviesResponse = await apiClient.get<any, { data: HomeMovie[] }>('/client/movies/trending', {
    params: { limit: 6 },
  });

  const hotMovies = hotMoviesResponse.data ?? [];

  return {
    hero: hotMovies[0] ?? null,
    trendingMovies: hotMovies,
    nowShowingMovies: [], // Add actual API calls if needed similar to web
    promotions: [],
    cinemas: [],
  };
};

export const getTrendingMovies = async (limit = 12): Promise<HomeMovie[]> => {
  await delay(5000);
  const response = await apiClient.get<any, { data: HomeMovie[] }>('/client/movies/trending', {
    params: { limit },
  });
  return response.data ?? [];
};

export const getNowShowingMovies = async (limit = 10): Promise<HomeMovie[]> => {
  await delay(5000);
  const response = await apiClient.get<any, { data: HomeMovie[] }>('/client/movies', {
    params: {
      status: 'NOW_SHOWING',
      page: 1,
      limit,
    },
  });
  return response.data ?? [];
};

export const getHomePromotions = async (): Promise<HomePromotion[]> => {
  await delay(5000);
  const response = await apiClient.get<any, { data: HomePromotion[] }>('/client/promotions', {
    params: { limit: 3 },
  });
  return response.data ?? [];
};

export const getNearbyCinemas = async (): Promise<HomeCinema[]> => {
  await delay(5000);
  const response = await apiClient.get<any, { data: HomeCinema[] }>('/client/branches', {
    params: { limit: 4 },
  });
  return response.data ?? [];
};
