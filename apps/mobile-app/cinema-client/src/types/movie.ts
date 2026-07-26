export interface MovieDetail {
  id: number;
  slug: string | null;
  title: string;
  originalTitle: string | null;
  director: string | null;
  cast: string | null;
  genre: string | null;
  duration: number;
  releaseDate: string | Date;
  endDate: string | Date | null;
  format: string;
  synopsis: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  ageRating: string | null;
  language: string | null;
  subtitle: string | null;
  country: string | null;
  averageRating: string | number | null;
  ratingCount: number;
  viewCount: number;
  isFeatured: boolean;
  status: string;
}

export interface HomeMovie {
  id: number;
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
}
