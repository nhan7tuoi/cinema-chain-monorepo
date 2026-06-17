export type SeatType = 'NORMAL' | 'VIP' | 'SWEETBOX';

export type ShowtimeSeatStatus = 'AVAILABLE' | 'HOLDING' | 'SOLD';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IUser {
  id: string;
  phone_number: string;
  email?: string;
  full_name: string;
  branch_id?: number;
  created_at: Date;
}