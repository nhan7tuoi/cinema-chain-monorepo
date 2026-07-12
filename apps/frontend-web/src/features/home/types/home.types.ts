export type HomeMovie = {
    id: string;
    title: string;
    slug?: string | null;
    posterUrl?: string | null;
    backdropUrl?: string | null;
    trailerUrl?: string | null;
    genre?: string | null;
    duration?: number | null;
    releaseDate?: string | Date | null;
    ageRating?: string | null;
    synopsis?: string | null;
    averageRating?: string | number | null;
};

export type HomePromotion = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
};

export type HomeCinema = {
    id: string;
    name: string;
    address: string;
    distance: string;
};

export type HomePageData = {
    hero: HomeMovie | null;
    trendingMovies: HomeMovie[];
    nowShowingMovies: HomeMovie[];
    promotions: HomePromotion[];
    cinemas: HomeCinema[];
};

