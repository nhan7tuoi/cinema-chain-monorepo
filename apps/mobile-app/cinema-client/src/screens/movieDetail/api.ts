import apiClient from '@api/apiClient';

import { MovieDetail } from '@type/movie';

export const getMovieDetail = async (id: number): Promise<MovieDetail> => {
  const response = await apiClient.get<any, { data: MovieDetail }>(`/client/movies/${id}`);
  return response.data;
};

export const getMovieReviews = async (id: number, page = 1, limit = 10): Promise<any> => {
  const response = await apiClient.get<any, any>(`/client/movies/${id}/reviews?page=${page}&limit=${limit}`);
  return response;
};

export const createMovieReview = async (id: number, rating: number, content?: string): Promise<any> => {
  const response = await apiClient.post<any, any>(`/client/movies/${id}/reviews`, {
    rating,
    content,
  });
  return response.data || response;
};
