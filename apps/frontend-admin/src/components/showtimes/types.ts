export type ShowtimeStatus = "SCHEDULED" | "SELLING" | "SOLD_OUT" | "CANCELLED" | "FINISHED"

export interface Branch {
  id: string
  name: string
  address: string
  phone?: string | null
  isActive?: boolean
}

export interface Auditorium {
  id: string
  branchId: string
  name: string
  format: string
  capacity: number
  isActive?: boolean
}

export interface Movie {
  id: string
  title: string
  duration?: number
  format?: string | null
}

export interface Showtime {
  id: string
  branchId: string
  auditoriumId: string
  movieId: string
  startsAt: string
  endsAt: string
  status: ShowtimeStatus
  basePrice?: string | number | null
  note?: string | null
  auditorium?: Auditorium
  movie?: Movie
}

export interface ShowtimePayload {
  branchId: string
  auditoriumId: string
  movieId: string
  startsAt: string
  status: ShowtimeStatus
  basePrice: number
  bufferMinutes?: number
  note?: string
}

export interface GenerateShowtimesPayload {
  branchId: string
  auditoriumId: string
  movieId: string
  dateFrom: string
  dateTo: string
  operatingStartTime: string
  operatingEndTime: string
  bufferMinutes: number
  status: ShowtimeStatus
  basePrice: number
  selectedStartsAt?: string[]
  note?: string
}

export interface ShowtimePreviewSlot {
  startsAt: string
  endsAt: string
  selectable: boolean
  reason?: "PAST" | "CONFLICT" | string
}
