import { ShowtimeStatus } from "./types"

export const scheduleStartHour = 0
export const scheduleEndHour = 24
export const timeSlots = Array.from({ length: scheduleEndHour - scheduleStartHour }, (_, index) => scheduleStartHour + index)
export const rowHeight = 72

export const statusConfig: Record<ShowtimeStatus, { label: string; className: string; rail: string }> = {
  SCHEDULED: {
    label: "Da len lich",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20",
    rail: "bg-indigo-500",
  },
  SELLING: {
    label: "Dang ban",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    rail: "bg-emerald-500",
  },
  SOLD_OUT: {
    label: "Het ve",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
    rail: "bg-rose-500",
  },
  CANCELLED: {
    label: "Da huy",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    rail: "bg-slate-400",
  },
  FINISHED: {
    label: "Da chieu",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    rail: "bg-slate-400",
  },
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function toDateTimeLocalValue(value?: string | Date) {
  const date = value ? new Date(value) : new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  const hours = `${date.getHours()}`.padStart(2, "0")
  const minutes = `${date.getMinutes()}`.padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function getWeekRangeLabel(date: Date) {
  const { start, end } = getWeekRange(date)
  return `${start.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} - ${end.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}`
}

export function getWeekRange(date: Date) {
  const start = new Date(date)
  const day = start.getDay() || 7
  start.setDate(start.getDate() - day + 1)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  return { start, end }
}

export function getTimeLabel(value: string | Date) {
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function getVisibleEventRange(startsAt: string, endsAt: string, displayDate: Date) {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const dayStart = new Date(displayDate)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)
  const visibleStart = new Date(Math.max(start.getTime(), dayStart.getTime()))
  const visibleEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()))
  const continuesFromPreviousDay = start < dayStart
  const continuesToNextDay = end > dayEnd

  return {
    visibleStart,
    visibleEnd,
    durationMinutes: Math.max((visibleEnd.getTime() - visibleStart.getTime()) / 60000, 0),
    startLabel: continuesFromPreviousDay ? "00:00" : getTimeLabel(visibleStart),
    endLabel: continuesToNextDay ? "24:00" : getTimeLabel(visibleEnd),
    continuesFromPreviousDay,
    continuesToNextDay,
    dayStart,
  }
}

export function getEventStyle(startsAt: string, endsAt: string, displayDate: Date) {
  const { visibleStart, durationMinutes, dayStart } = getVisibleEventRange(startsAt, endsAt, displayDate)
  const startOffset = (visibleStart.getTime() - dayStart.getTime()) / 60000 - scheduleStartHour * 60

  return {
    top: `${Math.max((startOffset / 60) * rowHeight, 0)}px`,
    height: `${Math.max((durationMinutes / 60) * rowHeight - 4, 104)}px`,
  }
}

export function formatHour(hour: number) {
  const displayHour = hour % 24
  return `${displayHour.toString().padStart(2, "0")}:00`
}
