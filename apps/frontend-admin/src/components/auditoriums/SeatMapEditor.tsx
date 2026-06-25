"use client"

import * as React from "react"
import { CheckCircle2, Circle, Grip, MousePointer2, RotateCcw, Save, Star, Trash2, XCircle, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { buildCustomSeats, buildRowLabels, buildSeatAt, buildSeatsFromTemplate, roomTemplates } from "./seat-utils"
import { RoomTemplate, SeatNode, SeatStatus, SeatTool, SeatType } from "./types"

const seatTypeConfig: Record<SeatType, { label: string; className: string; icon: React.ElementType }> = {
  STANDARD: {
    label: "Standard",
    className: "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
    icon: Circle,
  },
  VIP: {
    label: "VIP",
    className: "border-amber-300 bg-amber-100 text-amber-900 hover:border-amber-400 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-200",
    icon: Star,
  },
  COUPLE: {
    label: "Couple",
    className: "border-rose-300 bg-rose-100 text-rose-900 hover:border-rose-400 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-200",
    icon: CheckCircle2,
  },
}

const seatStatusConfig: Record<SeatStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Dang ban", className: "" },
  MAINTENANCE: {
    label: "Bao tri",
    className: "border-orange-300 bg-orange-50 text-orange-600 opacity-80 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300",
  },
  INACTIVE: {
    label: "Khoa",
    className: "border-slate-300 bg-slate-100 text-slate-400 opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500",
  },
}

interface SeatMapEditorProps {
  auditoriumName: string
  branchName: string
  isActive: boolean
  rowCount: number
  colCount: number
  seats: SeatNode[]
  isSaving?: boolean
  onRowCountChange: (value: number) => void
  onColCountChange: (value: number) => void
  onSeatsChange: (seats: SeatNode[]) => void
  onSave: () => void
}

export function SeatMapEditor({
  auditoriumName,
  branchName,
  isActive,
  rowCount,
  colCount,
  seats,
  isSaving = false,
  onRowCountChange,
  onColCountChange,
  onSeatsChange,
  onSave,
}: SeatMapEditorProps) {
  const [selectedTool, setSelectedTool] = React.useState<SeatTool>("STANDARD")
  const [selectedStatus, setSelectedStatus] = React.useState<SeatStatus>("ACTIVE")
  const [selectedSeatId, setSelectedSeatId] = React.useState<string | null>(null)
  const [pendingCoupleSeatId, setPendingCoupleSeatId] = React.useState<string | null>(null)
  const [draggingSeatId, setDraggingSeatId] = React.useState<string | null>(null)
  const [zoom, setZoom] = React.useState(42)

  const rowLabels = React.useMemo(() => buildRowLabels(rowCount), [rowCount])
  const cols = React.useMemo(() => Array.from({ length: colCount }, (_, index) => index + 1), [colCount])
  const selectedSeat = seats.find((seat) => seat.id === selectedSeatId)
  const activeCount = seats.filter((seat) => seat.status === "ACTIVE").length
  const maintenanceCount = seats.filter((seat) => seat.status === "MAINTENANCE").length
  const vipCount = seats.filter((seat) => seat.type === "VIP").length
  const coupleCount = seats.filter((seat) => seat.type === "COUPLE").length
  const rowHeaderSize = Math.max(30, Math.round(zoom * 0.8))
  const seatSize = Math.max(28, Math.round(zoom * 0.85))

  React.useEffect(() => {
    setSelectedSeatId(null)
    setPendingCoupleSeatId(null)
  }, [auditoriumName])

  const setSeats = (updater: (current: SeatNode[]) => SeatNode[]) => onSeatsChange(updater(seats))

  const updateSelectedSeat = (changes: Partial<SeatNode>) => {
    if (!selectedSeatId) return
    setSeats((current) => {
      const selected = current.find((seat) => seat.id === selectedSeatId)
      const shouldSplitCouple = selected?.couplePairId && changes.type && changes.type !== "COUPLE"

      return current.map((seat) => {
        if (shouldSplitCouple && seat.couplePairId === selected.couplePairId) {
          return {
            ...seat,
            type: seat.id === selectedSeatId ? changes.type || seat.type : "STANDARD",
            couplePairId: null,
          }
        }

        return seat.id === selectedSeatId ? { ...seat, ...changes } : seat
      })
    })
  }

  const splitCouplePair = (seat: SeatNode) => {
    setSeats((current) => current.map((item) => (
      item.couplePairId && item.couplePairId === seat.couplePairId
        ? { ...item, type: "STANDARD", couplePairId: null }
        : item.id === seat.id && !seat.couplePairId
          ? { ...item, type: "STANDARD", couplePairId: null }
          : item
    )))
    setSelectedSeatId(null)
    setPendingCoupleSeatId(null)
  }

  const deleteSeat = (seat: SeatNode) => {
    setSeats((current) => current.filter((item) => (
      seat.couplePairId ? item.couplePairId !== seat.couplePairId : item.id !== seat.id
    )))
    setSelectedSeatId(null)
    setPendingCoupleSeatId(null)
  }

  const handleCoupleSeatClick = (seat: SeatNode) => {
    if (seat.type === "COUPLE" && seat.couplePairId) {
      splitCouplePair(seat)
      return
    }

    if (!pendingCoupleSeatId) {
      setSeats((current) => current.map((item) => item.id === seat.id ? { ...item, type: "COUPLE", status: selectedStatus, couplePairId: null } : item))
      setSelectedSeatId(seat.id)
      setPendingCoupleSeatId(seat.id)
      return
    }

    const pending = seats.find((item) => item.id === pendingCoupleSeatId)
    if (!pending || pending.id === seat.id || pending.row !== seat.row || Math.abs(pending.col - seat.col) !== 1) {
      setPendingCoupleSeatId(null)
      setSelectedSeatId(null)
      return
    }

    const pairId = `couple-${pending.code}-${seat.code}`
    setSeats((current) => current.map((item) => (
      item.id === pending.id || item.id === seat.id
        ? { ...item, type: "COUPLE", status: selectedStatus, couplePairId: pairId }
        : item
    )))
    setSelectedSeatId(null)
    setPendingCoupleSeatId(null)
  }

  const handleSeatClick = (seat: SeatNode) => {
    if (selectedTool === "DELETE") {
      deleteSeat(seat)
      return
    }

    if (selectedTool === "COUPLE") {
      handleCoupleSeatClick(seat)
      return
    }

    setPendingCoupleSeatId(null)
    setSelectedSeatId(seat.id)
    setSeats((current) => current.map((item) => (
      item.id === seat.id
        ? { ...item, type: selectedTool, status: selectedStatus, couplePairId: null }
        : item
    )))
  }

  const handleCellClick = (row: number, col: number) => {
    const seat = seats.find((item) => item.row === row && item.col === col)
    if (seat) {
      handleSeatClick(seat)
      return
    }

    if (selectedTool === "DELETE") return

    const nextSeat = { ...buildSeatAt(row, col, selectedTool), status: selectedStatus }
    if (selectedTool === "COUPLE" && pendingCoupleSeatId) {
      const pending = seats.find((item) => item.id === pendingCoupleSeatId)
      if (!pending || pending.row !== row || Math.abs(pending.col - col) !== 1) return

      const pairId = `couple-${pending.code}-${nextSeat.code}`
      setSeats((current) => [
        ...current.map((item) => item.id === pending.id ? { ...item, couplePairId: pairId, type: "COUPLE" as SeatType } : item),
        { ...nextSeat, type: "COUPLE", couplePairId: pairId },
      ])
      setSelectedSeatId(null)
      setPendingCoupleSeatId(null)
      return
    }

    setSeats((current) => [...current, nextSeat])
    setSelectedSeatId(nextSeat.id)
    setPendingCoupleSeatId(selectedTool === "COUPLE" ? nextSeat.id : null)
  }

  const getCoupleSide = (seat: SeatNode) => {
    if (seat.type !== "COUPLE" || !seat.couplePairId) return null

    const pairSeat = seats.find((item) => item.id !== seat.id && item.couplePairId === seat.couplePairId)
    if (!pairSeat || pairSeat.row !== seat.row) return null

    return pairSeat.col > seat.col ? "left" : "right"
  }

  const handleDropOnCell = (row: number, col: number) => {
    if (!draggingSeatId) return

    const targetSeat = seats.find((seat) => seat.row === row && seat.col === col)
    const draggingSeat = seats.find((seat) => seat.id === draggingSeatId)
    if (!draggingSeat) {
      setDraggingSeatId(null)
      return
    }

    if (targetSeat && targetSeat.id !== draggingSeatId) {
      const sameRowAdjacent = draggingSeat.row === targetSeat.row && Math.abs(draggingSeat.col - targetSeat.col) === 1
      let nextDraggingRow = draggingSeat.row
      let nextDraggingCol = draggingSeat.col

      if (!sameRowAdjacent) {
        const leftCol = targetSeat.col - 1
        const rightCol = targetSeat.col + 1
        const isCellFree = (candidateCol: number) => (
          candidateCol >= 1 &&
          candidateCol <= colCount &&
          !seats.some((seat) => seat.id !== draggingSeat.id && seat.row === targetSeat.row && seat.col === candidateCol)
        )

        if (isCellFree(leftCol)) {
          nextDraggingRow = targetSeat.row
          nextDraggingCol = leftCol
        } else if (isCellFree(rightCol)) {
          nextDraggingRow = targetSeat.row
          nextDraggingCol = rightCol
        } else {
          setDraggingSeatId(null)
          return
        }
      }

      const canPair = nextDraggingRow === targetSeat.row && Math.abs(nextDraggingCol - targetSeat.col) === 1
      if (!canPair) {
        setDraggingSeatId(null)
        return
      }

      const nextDraggingLabel = rowLabels[nextDraggingRow] || String.fromCharCode(65 + nextDraggingRow)
      const nextDraggingCode = `${nextDraggingLabel}${nextDraggingCol}`
      const firstCode = nextDraggingCol < targetSeat.col ? nextDraggingCode : targetSeat.code
      const secondCode = nextDraggingCol < targetSeat.col ? targetSeat.code : nextDraggingCode
      const pairId = `couple-${firstCode}-${secondCode}`
      const oldPairIds = new Set([draggingSeat.couplePairId, targetSeat.couplePairId].filter(Boolean))

      setSeats((current) => current.map((seat) => {
        if (seat.id === draggingSeat.id) {
          return {
            ...seat,
            row: nextDraggingRow,
            col: nextDraggingCol,
            code: nextDraggingCode,
            type: "COUPLE",
            status: targetSeat.status,
            couplePairId: pairId,
          }
        }

        if (seat.id === targetSeat.id) {
          return { ...seat, type: "COUPLE", couplePairId: pairId }
        }

        if (seat.couplePairId && oldPairIds.has(seat.couplePairId)) {
          return { ...seat, type: "STANDARD", couplePairId: null }
        }

        return seat
      }))
      setSelectedSeatId(null)
      setPendingCoupleSeatId(null)
      setDraggingSeatId(null)
      return
    }

    const rowLabel = rowLabels[row] || String.fromCharCode(65 + row)
    setSeats((current) => current.map((seat) => (
      seat.id === draggingSeatId ? { ...seat, row, col, code: `${rowLabel}${col}` } : seat
    )))
    setDraggingSeatId(null)
  }

  const applyDimensions = () => {
    onSeatsChange(buildCustomSeats(rowCount, colCount))
    setSelectedSeatId(null)
    setPendingCoupleSeatId(null)
  }

  const applyTemplate = (template: RoomTemplate) => {
    onRowCountChange(template.rowCount)
    onColCountChange(template.colCount)
    onSeatsChange(buildSeatsFromTemplate(template))
    setSelectedSeatId(null)
    setPendingCoupleSeatId(null)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Cong cu ghe</h2>
            <MousePointer2 className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="auditorium-row-count" className="text-xs font-semibold text-slate-500 dark:text-slate-400">So hang</label>
              <Input id="auditorium-row-count" type="number" min={1} max={26} value={rowCount} onChange={(event) => onRowCountChange(Math.min(Math.max(Number(event.target.value) || 1, 1), 26))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="auditorium-col-count" className="text-xs font-semibold text-slate-500 dark:text-slate-400">So cot</label>
              <Input id="auditorium-col-count" type="number" min={1} max={30} value={colCount} onChange={(event) => onColCountChange(Math.min(Math.max(Number(event.target.value) || 1, 1), 30))} />
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={applyDimensions} className="mt-3 w-full">
            Tao so do
          </Button>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(Object.keys(seatTypeConfig) as SeatType[]).map((type) => {
              const Icon = seatTypeConfig[type].icon
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedTool(type)
                    if (type !== "COUPLE") setPendingCoupleSeatId(null)
                  }}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors",
                    selectedTool === type ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {seatTypeConfig[type].label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedTool("DELETE")
              setPendingCoupleSeatId(null)
            }}
            className={cn(
              "mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors",
              selectedTool === "DELETE"
                ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <Trash2 className="h-4 w-4" />
            Xoa ghe
          </button>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(Object.keys(seatStatusConfig) as SeatStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors",
                  selectedStatus === status ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                {seatStatusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Thong tin ghe</h2>
          {selectedSeat ? (
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ma ghe</span>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{selectedSeat.code}</span>
              </div>
              <select value={selectedSeat.type} onChange={(event) => updateSelectedSeat({ type: event.target.value as SeatType })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="STANDARD">Standard</option>
                <option value="VIP">VIP</option>
                <option value="COUPLE">Couple</option>
              </select>
              <select value={selectedSeat.status} onChange={(event) => updateSelectedSeat({ status: event.target.value as SeatStatus })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="ACTIVE">Dang ban</option>
                <option value="MAINTENANCE">Bao tri</option>
                <option value="INACTIVE">Khoa</option>
              </select>
              <Button type="button" variant="destructive" size="sm" onClick={() => deleteSeat(selectedSeat)} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Xoa ghe nay
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Chon mot ghe tren so do de sua nhanh.</p>
          )}
        </div>
      </aside>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{auditoriumName}</h2>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", isActive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>
                {isActive ? "Dang hoat dong" : "Tam dung"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{branchName} - {activeCount}/{seats.length} ghe san sang</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950">
              <Button type="button" variant="ghost" size="icon" onClick={() => setZoom((current) => Math.max(current - 4, 28))} className="h-8 w-8" title="Thu nho">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-xs font-semibold text-slate-500">{zoom}px</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => setZoom((current) => Math.min(current + 4, 58))} className="h-8 w-8" title="Phong to">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={applyDimensions}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Dat lai
            </Button>
            <Button size="sm" onClick={onSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Dang luu..." : "Luu cau hinh"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-200 p-4 dark:border-slate-800 md:grid-cols-4">
          {[
            ["Tong ghe", seats.length],
            ["VIP", vipCount],
            ["Couple", coupleCount],
            ["Bao tri", maintenanceCount],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
              <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-auto bg-slate-50 p-4 dark:bg-slate-950">
          <div className="min-w-[900px] rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-8 max-w-3xl">
              <div className="h-3 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.45em] text-slate-500 dark:text-slate-400">Man hinh chieu</p>
            </div>

            <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `${rowHeaderSize}px repeat(${colCount}, ${zoom}px)` }}>
              <div />
              {cols.map((col) => (
                <div key={col} className="text-center text-xs font-semibold text-slate-400" style={{ width: `${zoom}px` }}>{col}</div>
              ))}

              {rowLabels.map((rowLabel, rowIndex) => (
                <React.Fragment key={rowLabel}>
                  <div className="flex items-center justify-center text-xs font-bold text-rose-500" style={{ height: `${zoom}px` }}>{rowLabel}</div>
                  {cols.map((col) => {
                    const seat = seats.find((item) => item.row === rowIndex && item.col === col)
                    const SeatIcon = seat ? seatTypeConfig[seat.type].icon : null
                    const coupleSide = seat ? getCoupleSide(seat) : null

                    return (
                      <div
                        key={`${rowLabel}-${col}`}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleDropOnCell(rowIndex, col)}
                        onClick={() => handleCellClick(rowIndex, col)}
                        className="flex items-center justify-center rounded-md border border-dashed border-slate-200 transition-colors hover:border-indigo-300 dark:border-slate-800"
                        style={{ height: `${zoom}px`, width: `${zoom}px` }}
                      >
                        {seat && SeatIcon && (
                          <button
                            type="button"
                            draggable
                            onDragStart={() => setDraggingSeatId(seat.id)}
                            onDragEnd={() => setDraggingSeatId(null)}
                            onClick={(event) => {
                              event.stopPropagation()
                              handleSeatClick(seat)
                            }}
                            className={cn(
                              "flex items-center justify-center rounded-md border text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5",
                              seatTypeConfig[seat.type].className,
                              seatStatusConfig[seat.status].className,
                              coupleSide === "left" ? "rounded-r-none border-r-0" : "",
                              coupleSide === "right" ? "rounded-l-none border-l-0" : "",
                              selectedSeatId === seat.id ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900" : "",
                              pendingCoupleSeatId === seat.id ? "ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                            )}
                            style={{
                              height: `${seatSize}px`,
                              width: coupleSide ? `${zoom + 8}px` : `${Math.max(seatSize, zoom - 4)}px`,
                              transform: coupleSide === "left" ? "translateX(4px)" : coupleSide === "right" ? "translateX(-4px)" : undefined,
                            }}
                            title={`${seat.code} - ${seatTypeConfig[seat.type].label}`}
                          >
                            {seat.status === "INACTIVE" ? <XCircle className="h-3.5 w-3.5" /> : seat.type === "STANDARD" ? seat.code.replace(/[A-Z]/g, "") : <SeatIcon className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border bg-white" /> Standard</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-amber-300 bg-amber-100" /> VIP</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-rose-300 bg-rose-100" /> Couple</span>
              <span className="inline-flex items-center gap-2"><Grip className="h-3.5 w-3.5" /> Keo ghe de doi vi tri</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Mau phong chieu</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {roomTemplates.map((template) => {
              const Icon = seatTypeConfig[template.type].icon
              return (
                <button
                  key={template.title}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="group rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900"
                >
                  <div className="flex h-20 items-center justify-center rounded-md bg-white text-slate-400 dark:bg-slate-900">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-50">{template.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{template.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
