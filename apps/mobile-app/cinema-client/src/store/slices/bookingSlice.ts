import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Seat {
  id: number;
  name: string;
  price: number;
}

export interface Combo {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingState {
  showtimeId: number | null;
  selectedSeats: Seat[];
  combos: Record<string, Combo>;
  expiresAt: number | null;
}

const initialState: BookingState = {
  showtimeId: null,
  selectedSeats: [],
  combos: {},
  expiresAt: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    initBookingSession: (state, action: PayloadAction<{ showtimeId: number; holdDurationMinutes: number }>) => {
      state.showtimeId = action.payload.showtimeId;
      state.selectedSeats = [];
      state.combos = {};
      state.expiresAt = Date.now() + action.payload.holdDurationMinutes * 60000;
    },
    
    toggleSeat: (state, action: PayloadAction<Seat>) => {
      const seat = action.payload;
      const existsIndex = state.selectedSeats.findIndex(s => s.id === seat.id);
      
      if (existsIndex >= 0) {
        state.selectedSeats.splice(existsIndex, 1);
      } else {
        if (state.selectedSeats.length < 8) {
          state.selectedSeats.push(seat);
        }
      }
    },

    updateComboQuantity: (state, action: PayloadAction<{ combo: Combo; quantityChange: number }>) => {
      const { combo, quantityChange } = action.payload;
      const current = state.combos[combo.id] || { ...combo, quantity: 0 };
      
      const newQuantity = current.quantity + quantityChange;
      
      if (newQuantity <= 0) {
        delete state.combos[combo.id];
      } else {
        state.combos[combo.id] = { ...current, quantity: newQuantity };
      }
    },

    clearBooking: () => initialState,
  },
});

export const { initBookingSession, toggleSeat, updateComboQuantity, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
