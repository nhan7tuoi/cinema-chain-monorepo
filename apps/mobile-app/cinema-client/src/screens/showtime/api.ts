import apiClient from '@api/apiClient';
import { Cinema } from './components/CinemaCard';
import dayjs from 'dayjs';

export const getShowtimesByMovie = async (movieId: number, date: Date): Promise<Cinema[]> => {
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  
  // Hardcode vị trí trung tâm TP.HCM (Quận 1) làm vị trí giả lập cho máy ảo
  const mockLat = 10.7769;
  const mockLng = 106.7009;

  const response = await apiClient.get<any, { data: Cinema[] }>(`/client/showtimes/movie/${movieId}`, {
    params: {
      date: dateStr,
      latitude: mockLat,
      longitude: mockLng,
    }
  });
  return response.data;
};

export const getShowtimeDetails = async (showtimeId: number): Promise<any> => {
  const response = await apiClient.get<any, { data: any }>(`/client/showtimes/${showtimeId}`);
  return response.data;
};
