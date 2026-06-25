export type SeatType = "STANDARD" | "VIP" | "COUPLE"
export type SeatStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE"
export type SeatTool = SeatType | "DELETE"

export interface Branch {
  id: string
  name: string
  address: string
  phone?: string | null
  isActive: boolean
}

export interface Seat {
  id: string
  rowLabel: string
  number: number
  code: string
  gridRow: number
  gridCol: number
  type: SeatType
  status: SeatStatus
  couplePairId?: string | null
}

export interface SeatNode {
  id: string
  row: number
  col: number
  code: string
  type: SeatType
  status: SeatStatus
  couplePairId?: string | null
}

export interface Auditorium {
  id: string
  branchId: string
  name: string
  format: string
  capacity: number
  layoutRows: number
  layoutCols: number
  isActive: boolean
  branch?: Branch
  seats?: Seat[]
  _count?: {
    seats?: number
    showtimes?: number
  }
}

export interface AuditoriumPayload {
  branchId: string
  name: string
  format: string
  layoutRows?: number
  layoutCols?: number
  isActive?: boolean
}

export interface SaveSeatLayoutPayload {
  layoutRows: number
  layoutCols: number
  seats: {
    id?: string
    rowLabel: string
    number: number
    code: string
    gridRow: number
    gridCol: number
    type: SeatType
    status: SeatStatus
    couplePairId?: string | null
  }[]
}

export interface RoomTemplate {
  title: string
  description: string
  type: SeatType
  rowCount: number
  colCount: number
  aisleCols: number[]
  frontSkipRows: number
  frontSkipCols: number[]
  techArea?: { row: number; fromCol: number; toCol: number }
  vipFromRow?: number
  coupleRows?: number[]
}
