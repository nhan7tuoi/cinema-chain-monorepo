import { RoomTemplate, SaveSeatLayoutPayload, Seat, SeatNode, SeatType } from "./types"

export const defaultRowCount = 7
export const defaultColCount = 14

export const roomTemplates: RoomTemplate[] = [
  {
    title: "Beta Standard",
    description: "7 hang x 14 cot",
    type: "STANDARD",
    rowCount: 7,
    colCount: 14,
    aisleCols: [5, 10],
    frontSkipRows: 2,
    frontSkipCols: [1, 2, 13, 14],
    techArea: { row: 0, fromCol: 6, toCol: 9 },
    vipFromRow: 4,
  },
  {
    title: "L'amour Couple",
    description: "6 hang x 12 cot",
    type: "COUPLE",
    rowCount: 6,
    colCount: 12,
    aisleCols: [5, 9],
    frontSkipRows: 1,
    frontSkipCols: [1, 12],
    vipFromRow: 3,
    coupleRows: [5],
  },
  {
    title: "Gold Class",
    description: "5 hang x 10 cot",
    type: "VIP",
    rowCount: 5,
    colCount: 10,
    aisleCols: [4, 7],
    frontSkipRows: 0,
    frontSkipCols: [],
    vipFromRow: 0,
  },
  {
    title: "Sweetbox Mix",
    description: "8 hang x 16 cot",
    type: "COUPLE",
    rowCount: 8,
    colCount: 16,
    aisleCols: [6, 11],
    frontSkipRows: 2,
    frontSkipCols: [1, 2, 15, 16],
    vipFromRow: 4,
    coupleRows: [7],
  },
]

export function buildRowLabels(rowCount: number) {
  return Array.from({ length: rowCount }, (_, index) => String.fromCharCode(65 + index))
}

export function dbSeatsToNodes(seats: Seat[] = []): SeatNode[] {
  return seats.map((seat) => ({
    id: seat.id,
    row: seat.gridRow,
    col: seat.gridCol,
    code: seat.code,
    type: seat.type,
    status: seat.status,
    couplePairId: seat.couplePairId,
  }))
}

export function nodesToSavePayload(rowCount: number, colCount: number, seats: SeatNode[]): SaveSeatLayoutPayload {
  const labels = buildRowLabels(rowCount)

  return {
    layoutRows: rowCount,
    layoutCols: colCount,
    seats: seats
      .slice()
      .sort((left, right) => left.row - right.row || left.col - right.col)
      .map((seat) => ({
        id: seat.id,
        rowLabel: labels[seat.row] || String.fromCharCode(65 + seat.row),
        number: seat.col,
        code: seat.code,
        gridRow: seat.row,
        gridCol: seat.col,
        type: seat.type,
        status: seat.status,
        couplePairId: seat.couplePairId || null,
      })),
  }
}

export function buildSeatsFromTemplate(template: RoomTemplate) {
  const seats: SeatNode[] = []
  const rowLabels = buildRowLabels(template.rowCount)
  const cols = Array.from({ length: template.colCount }, (_, index) => index + 1)

  rowLabels.forEach((rowLabel, rowIndex) => {
    cols.forEach((col) => {
      const isCouple = template.coupleRows?.includes(rowIndex) ?? false
      const isAisle = !isCouple && template.aisleCols.includes(col)
      const isMissingFront = rowIndex < template.frontSkipRows && template.frontSkipCols.includes(col)
      const isTechArea = template.techArea
        ? rowIndex === template.techArea.row && col >= template.techArea.fromCol && col <= template.techArea.toCol
        : false

      if (isAisle || isMissingFront || isTechArea) return

      const isVip = !isCouple && template.vipFromRow !== undefined && rowIndex >= template.vipFromRow
      const pairId = isCouple ? `couple-${rowLabel}-${Math.ceil(col / 2)}` : null

      seats.push({
        id: `${rowLabel}${col}`,
        row: rowIndex,
        col,
        code: `${rowLabel}${col}`,
        type: isCouple ? "COUPLE" : isVip ? "VIP" : "STANDARD",
        status: "ACTIVE",
        couplePairId: pairId,
      })
    })
  })

  return seats
}

export function buildCustomSeats(rowCount: number, colCount: number) {
  return buildSeatsFromTemplate({
    title: "Custom",
    description: "",
    type: "STANDARD",
    rowCount,
    colCount,
    aisleCols: colCount >= 12 ? [Math.ceil(colCount / 3), Math.ceil((colCount / 3) * 2)] : [],
    frontSkipRows: 0,
    frontSkipCols: [],
    vipFromRow: Math.max(rowCount - 3, 0),
    coupleRows: rowCount >= 7 ? [rowCount - 1] : [],
  })
}

export function buildSeatAt(row: number, col: number, type: SeatType) {
  const rowLabel = buildRowLabels(row + 1)[row]

  return {
    id: `${rowLabel}${col}-${Date.now()}`,
    row,
    col,
    code: `${rowLabel}${col}`,
    type,
    status: "ACTIVE" as const,
    couplePairId: null,
  }
}
