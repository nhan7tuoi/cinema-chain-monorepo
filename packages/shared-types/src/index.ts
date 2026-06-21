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

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string | null;
    userType: string;
    fullName: string;
    roles: string[];
    permissions: string[];
  };
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string | null;
  userType: string;
}

export interface IUserContext {
  userId: string;
  email: string | null;
  userType: string;
}