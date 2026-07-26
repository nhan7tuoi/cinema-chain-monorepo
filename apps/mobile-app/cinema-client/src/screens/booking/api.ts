import apiClient from '@api/apiClient';

export interface CreateBookingPayload {
  showtimeId: number;
  seatIds: number[];
  combos?: { comboId: number; quantity: number }[];
}

export const createBooking = async (payload: CreateBookingPayload) => {
  const response = await apiClient.post('/bookings', payload);
  return response.data;
};

export const simulatePayment = async (orderCode: string) => {
  const response = await apiClient.post(`/bookings/${orderCode}/simulate-payment`);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await apiClient.get('/bookings/my-tickets');
  return response.data;
};

export const getCombos = async () => {
  const response = await apiClient.get('/bookings/combos');
  return response.data;
};
