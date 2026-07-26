export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  MovieDetail: { movieId: number };
  Showtime: { movieId: number; movieTitle: string };
  SeatSelection: { showtime: any };
  ComboSelection: { selectedSeats: any[]; showtime: any };
  Checkout: { selectedSeats: any[]; showtime: any; comboQuantities: Record<string, number>; finalTotalPrice: number };
  Payment: { orderCode: string; amount: number };
  Login: undefined;
  TicketDetail: { booking: any };
  Search: undefined;
};
