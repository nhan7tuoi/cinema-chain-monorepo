import type { HomeCinema, HomeMovie, HomePageData, HomePromotion } from "../types/home.types";
import apiClient from "@/lib/axios";

export async function getHomePageData(): Promise<HomePageData> {
    const hotMoviesResponse = await apiClient.get<HomeMovie[]>("/client/movies/trending", {
        params: { limit: 6 },
    });

    const hotMovies = hotMoviesResponse.data ?? [];

    return {
        hero: hotMovies[0] ?? null,
        trendingMovies: hotMovies,
        nowShowingMovies: [],
        promotions: [],
        cinemas: [],
    };
}
export async function getTrendingMovies(
    limit = 12,
    signal?: AbortSignal,
): Promise<HomeMovie[]> {
    const response = await apiClient.get<HomeMovie[]>("/client/movies/trending", {
        params: { limit },
        signal,
    });

    return response.data ?? [];
}

export async function getNowShowingMovies(limit = 10, signal?: AbortSignal): Promise<HomeMovie[]> {
    const reponse = await apiClient.get<HomeMovie[]>("/client/movies", {
        params: {
            status: "NOW_SHOWING",
            page: 1,
            limit
        },
        signal
    })
    return reponse.data ?? [];
}
export async function getComingSoonMovies(limit = 6, signal?: AbortSignal): Promise<HomeMovie[]> {
    const reponse = await apiClient.get<HomeMovie[]>("/client/movies", {
        params: {
            status: "COMING_SOON",
            page: 1,
            limit
        },
        signal
    })
    return reponse.data ?? []
}

export async function getHomePromotions(
    signal?: AbortSignal,
): Promise<HomePromotion[]> {
    const response = await apiClient.get<HomePromotion[]>("/client/promotions", {
        params: { limit: 3 },
        signal,
    });

    return response.data ?? [];
}

export async function getNearbyCinemas(
    signal?: AbortSignal,
): Promise<HomeCinema[]> {
    const response = await apiClient.get<HomeCinema[]>("/client/branches", {
        params: { limit: 4 },
        signal,
    });

    return response.data ?? [];
}
