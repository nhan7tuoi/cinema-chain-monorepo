"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import apiClient from "@/lib/axios"
import { Auditorium, Branch, GenerateShowtimesPayload, Movie, Showtime, ShowtimePayload, ShowtimePreviewSlot, ShowtimeStatus } from "./types"
import { toDateInputValue, toDateTimeLocalValue } from "./showtime-utils"

interface ShowtimeFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  showtime?: Showtime | null
  branches: Branch[]
  auditoriums: Auditorium[]
  movies: Movie[]
  selectedBranchId: string
  onSuccess: () => void
}

const statuses: { value: ShowtimeStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Da len lich" },
  { value: "SELLING", label: "Dang ban" },
  { value: "SOLD_OUT", label: "Het ve" },
  { value: "CANCELLED", label: "Da huy" },
  { value: "FINISHED", label: "Da chieu" },
]

function getDefaultEndsAt(startsAt: string, movies: Movie[], movieId: string) {
  const start = new Date(startsAt)
  const movie = movies.find((item) => item.id === movieId)
  start.setMinutes(start.getMinutes() + (movie?.duration || 120))
  return toDateTimeLocalValue(start)
}

function isFiveMinuteBoundary(value: string) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.getMinutes() % 5 === 0
}

function isFiveMinuteTime(value: string) {
  const [, minute = ""] = value.split(":")
  return Number(minute) % 5 === 0
}

function buildFiveMinuteTimeOptions() {
  const options: string[] = []
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 5) {
      options.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`)
    }
  }
  return options
}

const fiveMinuteTimeOptions = buildFiveMinuteTimeOptions()

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function moveDateInputValue(dateValue: string, amount: number) {
  const date = new Date(`${dateValue}T00:00:00`)
  date.setDate(date.getDate() + amount)
  return toDateInputValue(date)
}

export function ShowtimeFormDialog({
  isOpen,
  onOpenChange,
  showtime,
  branches,
  auditoriums,
  movies,
  selectedBranchId,
  onSuccess,
}: ShowtimeFormDialogProps) {
  const [branchId, setBranchId] = React.useState(selectedBranchId)
  const [auditoriumId, setAuditoriumId] = React.useState("")
  const [movieId, setMovieId] = React.useState("")
  const [startsAt, setStartsAt] = React.useState(toDateTimeLocalValue())
  const [endsAt, setEndsAt] = React.useState(toDateTimeLocalValue())
  const [dateFrom, setDateFrom] = React.useState(toDateInputValue(new Date()))
  const [dateTo, setDateTo] = React.useState(toDateInputValue(new Date()))
  const [operatingStartTime, setOperatingStartTime] = React.useState("08:00")
  const [operatingEndTime, setOperatingEndTime] = React.useState("24:00")
  const [bufferMinutes, setBufferMinutes] = React.useState("15")
  const [mode, setMode] = React.useState<"single" | "auto">("single")
  const [autoStep, setAutoStep] = React.useState<"config" | "slots">("config")
  const [status, setStatus] = React.useState<ShowtimeStatus>("SCHEDULED")
  const [basePrice, setBasePrice] = React.useState("90000")
  const [note, setNote] = React.useState("")
  const [previewSlots, setPreviewSlots] = React.useState<ShowtimePreviewSlot[]>([])
  const [selectedPreviewSlots, setSelectedPreviewSlots] = React.useState<string[]>([])
  const [manualSchedule, setManualSchedule] = React.useState<Showtime[]>([])
  const [isLoadingManualTimes, setIsLoadingManualTimes] = React.useState(false)
  const [isPreviewing, setIsPreviewing] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isFinishedShowtime = Boolean(showtime && (showtime.status === "FINISHED" || new Date(showtime.endsAt) < new Date()))
  const selectedStartDate = startsAt.split("T")[0] || toDateInputValue(new Date())
  const selectedStartTime = (startsAt.split("T")[1] || "08:00").slice(0, 5)

  const branchAuditoriums = React.useMemo(
    () => auditoriums.filter((item) => item.branchId === branchId),
    [auditoriums, branchId]
  )
  const selectableSlotKeys = React.useMemo(
    () => previewSlots.filter((slot) => slot.selectable).map((slot) => new Date(slot.startsAt).toISOString()),
    [previewSlots]
  )
  const selectedSelectableCount = React.useMemo(() => {
    const selectableKeys = new Set(selectableSlotKeys)
    return selectedPreviewSlots.filter((key) => selectableKeys.has(key)).length
  }, [selectableSlotKeys, selectedPreviewSlots])
  const usableManualTimeOptions = React.useMemo(() => {
    const movie = movies.find((item) => item.id === movieId)
    const movieDuration = movie?.duration || 120
    const minGapMinutes = Math.max(Number(bufferMinutes) || 15, 15)
    const now = new Date()

    if (!selectedStartDate || !auditoriumId || !movieId) return []

    return fiveMinuteTimeOptions.filter((time) => {
      const candidateStart = new Date(`${selectedStartDate}T${time}:00`)
      const candidateEnd = addMinutes(candidateStart, movieDuration)
      const conflictStart = addMinutes(candidateStart, -minGapMinutes)
      const conflictEnd = addMinutes(candidateEnd, minGapMinutes)

      if (candidateStart <= now) return false

      return !manualSchedule.some((item) => {
        if (item.id === showtime?.id) return false
        if (item.auditoriumId !== auditoriumId) return false
        if (item.status === "CANCELLED") return false

        const existingStart = new Date(item.startsAt)
        const existingEnd = new Date(item.endsAt)
        return existingStart < conflictEnd && existingEnd > conflictStart
      })
    })
  }, [auditoriumId, bufferMinutes, manualSchedule, movieId, movies, selectedStartDate, showtime?.id])
  const usableManualHours = React.useMemo(
    () => Array.from(new Set(usableManualTimeOptions.map((time) => time.slice(0, 2)))),
    [usableManualTimeOptions]
  )
  const selectedStartHour = selectedStartTime.slice(0, 2)
  const selectedStartMinute = selectedStartTime.slice(3, 5)
  const selectedUsableHour = usableManualHours.includes(selectedStartHour) ? selectedStartHour : usableManualHours[0]
  const usableManualMinutes = selectedUsableHour
    ? usableManualTimeOptions.filter((time) => time.startsWith(`${selectedUsableHour}:`)).map((time) => time.slice(3, 5))
    : []

  const resetPreview = React.useCallback(() => {
    setPreviewSlots([])
    setSelectedPreviewSlots([])
    setAutoStep("config")
  }, [])

  React.useEffect(() => {
    if (!isOpen) return

    Promise.resolve().then(() => {
      if (showtime) {
        setBranchId(showtime.branchId)
        setAuditoriumId(showtime.auditoriumId)
        setMovieId(showtime.movieId)
        setStartsAt(toDateTimeLocalValue(showtime.startsAt))
        setEndsAt(toDateTimeLocalValue(showtime.endsAt))
        setDateFrom(toDateInputValue(new Date(showtime.startsAt)))
        setDateTo(toDateInputValue(new Date(showtime.startsAt)))
        setBufferMinutes("15")
        setMode("single")
        setStatus(showtime.status)
        setBasePrice(String(showtime.basePrice || "90000"))
        setNote(showtime.note || "")
        setAutoStep("config")
        setPreviewSlots([])
        setSelectedPreviewSlots([])
        return
      }

      const nextBranchId = selectedBranchId || branches[0]?.id || ""
      const nextAuditoriumId = auditoriums.find((item) => item.branchId === nextBranchId)?.id || ""
      const nextMovieId = movies[0]?.id || ""
      const nextStartsAt = toDateTimeLocalValue()
      const today = toDateInputValue(new Date())

      setBranchId(nextBranchId)
      setAuditoriumId(nextAuditoriumId)
      setMovieId(nextMovieId)
      setStartsAt(nextStartsAt)
      setEndsAt(getDefaultEndsAt(nextStartsAt, movies, nextMovieId))
      setDateFrom(today)
      setDateTo(today)
      setOperatingStartTime("08:00")
      setOperatingEndTime("24:00")
      setBufferMinutes("15")
      setPreviewSlots([])
      setSelectedPreviewSlots([])
      setAutoStep("config")
      setMode("single")
      setStatus("SCHEDULED")
      setBasePrice("90000")
      setNote("")
    })
  }, [auditoriums, branches, isOpen, movies, selectedBranchId, showtime])

  React.useEffect(() => {
    if (!isOpen || showtime) return
    const firstAuditorium = branchAuditoriums[0]?.id || ""
    Promise.resolve().then(() => {
      setAuditoriumId((current) => current && branchAuditoriums.some((item) => item.id === current) ? current : firstAuditorium)
    })
  }, [branchAuditoriums, isOpen, showtime])

  React.useEffect(() => {
    if (!isOpen || mode !== "single" || !branchId || !selectedStartDate) return

    let ignore = false
    Promise.resolve()
      .then(() => {
        if (!ignore) setIsLoadingManualTimes(true)
      })
      .then(() => apiClient.get<Showtime[]>(`/showtimes?branchId=${branchId}&dateFrom=${moveDateInputValue(selectedStartDate, -1)}&dateTo=${moveDateInputValue(selectedStartDate, 1)}`))
      .then((res) => {
        if (!ignore) setManualSchedule(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!ignore) setManualSchedule([])
      })
      .finally(() => {
        if (!ignore) setIsLoadingManualTimes(false)
      })

    return () => {
      ignore = true
    }
  }, [branchId, isOpen, mode, selectedStartDate])

  const handleMovieChange = (nextMovieId: string) => {
    setMovieId(nextMovieId)
    setEndsAt(getDefaultEndsAt(startsAt, movies, nextMovieId))
    resetPreview()
  }

  const handleStartsAtChange = React.useCallback((nextStartsAt: string) => {
    setStartsAt(nextStartsAt)
    setEndsAt(getDefaultEndsAt(nextStartsAt, movies, movieId))
  }, [movieId, movies])

  const handleStartDateChange = (nextDate: string) => {
    const currentTime = startsAt.split("T")[1] || "08:00"
    handleStartsAtChange(`${nextDate}T${currentTime}`)
  }

  const handleStartTimeChange = React.useCallback((nextTime: string) => {
    const currentDate = selectedStartDate || toDateInputValue(new Date())
    handleStartsAtChange(`${currentDate}T${nextTime}`)
  }, [handleStartsAtChange, selectedStartDate])

  const handleStartHourChange = (nextHour: string) => {
    const firstTimeInHour = usableManualTimeOptions.find((time) => time.startsWith(`${nextHour}:`))
    if (firstTimeInHour) handleStartTimeChange(firstTimeInHour)
  }

  const handleStartMinuteChange = (nextMinute: string) => {
    handleStartTimeChange(`${selectedStartHour}:${nextMinute}`)
  }

  const handleBufferChange = (nextBuffer: string) => {
    setBufferMinutes(nextBuffer)
    resetPreview()
  }

  React.useEffect(() => {
    if (!isOpen || mode !== "single" || isFinishedShowtime || usableManualTimeOptions.length === 0) return
    if (usableManualTimeOptions.includes(selectedStartTime)) return

    Promise.resolve().then(() => {
      handleStartTimeChange(usableManualTimeOptions[0])
    })
  }, [handleStartTimeChange, isFinishedShowtime, isOpen, mode, selectedStartTime, usableManualTimeOptions])

  const buildGeneratePayload = (): GenerateShowtimesPayload => ({
    branchId,
    auditoriumId,
    movieId,
    dateFrom,
    dateTo,
    operatingStartTime,
    operatingEndTime,
    bufferMinutes: Number(bufferMinutes),
    status,
    basePrice: Number(basePrice),
    note: note.trim() || undefined,
  })

  const validateAutoConfig = () => {
    if (!branchId || !auditoriumId || !movieId || !dateFrom || !dateTo || !operatingStartTime || !operatingEndTime) {
      toast.error("Vui long nhap day du thong tin de de xuat khung gio.")
      return false
    }

    if (dateTo < dateFrom) {
      toast.error("Den ngay khong duoc nho hon Tu ngay.")
      return false
    }

    if (!isFiveMinuteTime(operatingStartTime)) {
      toast.error("Gio bat dau phai nam tren moc 5 phut, vi du 08:00, 12:30 hoac 15:15.")
      return false
    }

    return true
  }

  const handlePreview = async () => {
    if (!validateAutoConfig()) {
      return false
    }

    setIsPreviewing(true)
    try {
      const res = await apiClient.post<{ slots: ShowtimePreviewSlot[] }>("/showtimes/preview", buildGeneratePayload())
      const slots = Array.isArray(res.data.slots) ? res.data.slots : []
      setPreviewSlots(slots)
      setSelectedPreviewSlots(slots.filter((slot) => slot.selectable).map((slot) => new Date(slot.startsAt).toISOString()))
      setAutoStep("slots")
      return true
    } catch (error: unknown) {
      const message = error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || "Khong the de xuat khung gio.")
      return false
    } finally {
      setIsPreviewing(false)
    }
  }

  const togglePreviewSlot = (slot: ShowtimePreviewSlot) => {
    const key = new Date(slot.startsAt).toISOString()
    setSelectedPreviewSlots((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFinishedShowtime && !showtime && mode === "auto" && autoStep === "config") {
      await handlePreview()
      return
    }

    if (!isFinishedShowtime && mode === "single" && (!branchId || !auditoriumId || !movieId || !startsAt)) {
      toast.error("Vui long nhap day du thong tin suat chieu.")
      return
    }

    if (!isFinishedShowtime && mode === "single" && !isFiveMinuteBoundary(startsAt)) {
      toast.error("Gio bat dau phai nam tren moc 5 phut, vi du 10:00, 12:30 hoac 15:15.")
      return
    }

    if (!isFinishedShowtime && mode === "single" && !usableManualTimeOptions.includes(selectedStartTime)) {
      toast.error("Khung gio nay khong con hop le. Vui long chon gio khac.")
      return
    }

    if (!isFinishedShowtime && mode === "auto" && !validateAutoConfig()) {
      return
    }

    if (!isFinishedShowtime && !showtime && mode === "auto" && selectedPreviewSlots.length === 0) {
      toast.error("Vui long de xuat va chon it nhat mot khung gio.")
      return
    }

    const payload: Partial<ShowtimePayload> = isFinishedShowtime
      ? { note: note.trim() || undefined }
      : {
          branchId,
          auditoriumId,
          movieId,
          startsAt: new Date(startsAt).toISOString(),
          status,
          basePrice: Number(basePrice),
          bufferMinutes: Number(bufferMinutes),
          note: note.trim() || undefined,
        }

    setIsSubmitting(true)
    try {
      if (!showtime && mode === "auto") {
        const generatePayload: GenerateShowtimesPayload = {
          ...buildGeneratePayload(),
          selectedStartsAt: selectedPreviewSlots,
        }
        const res = await apiClient.post<{ createdCount: number; skippedCount: number }>("/showtimes/generate", generatePayload)
        toast.success(`Da tao ${res.data.createdCount} suat chieu, bo qua ${res.data.skippedCount} slot trung.`)
      } else if (showtime) {
        await apiClient.put(`/showtimes/${showtime.id}`, payload)
        toast.success("Cap nhat suat chieu thanh cong.")
      } else {
        await apiClient.post("/showtimes", payload)
        toast.success("Them suat chieu thanh cong.")
      }
      onOpenChange(false)
      onSuccess()
    } catch (error: unknown) {
      const message = error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || "Khong the luu suat chieu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={mode === "auto" && autoStep === "slots" ? "max-w-4xl" : "max-w-2xl"}>
        <DialogHeader>
          <DialogTitle>{showtime ? "Sua Suat Chieu" : "Them Suat Chieu"}</DialogTitle>
          <DialogDescription>
            {isFinishedShowtime
              ? "Suat chieu da ket thuc. Ban chi co the cap nhat ghi chu."
              : "Backend se tu tinh gio ket thuc, kiem tra trung phong va luu lich hop le."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showtime && !isFinishedShowtime && (
            <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setMode("single")
                  resetPreview()
                }}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${mode === "single" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              >
                Mot suat
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("auto")
                  setAutoStep("config")
                }}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${mode === "auto" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              >
                Tu sinh lich
              </button>
            </div>
          )}

          {mode === "auto" && autoStep === "slots" && !showtime && !isFinishedShowtime ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="grid gap-3 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Rap</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                      {branches.find((branch) => branch.id === branchId)?.name || "Chua chon"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Phong</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                      {auditoriums.find((auditorium) => auditorium.id === auditoriumId)?.name || "Chua chon"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Phim</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                      {movies.find((movie) => movie.id === movieId)?.title || "Chua chon"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Da chon</p>
                    <p className="mt-1 font-semibold text-indigo-600 dark:text-indigo-300">
                      {selectedSelectableCount}/{selectableSlotKeys.length} khung gio
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Chon khung gio se tao</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bo tick slot khong can, slot bi trung hoac qua gio se bi khoa.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setSelectedPreviewSlots(selectableSlotKeys)} disabled={selectableSlotKeys.length === 0}>
                      Chon tat ca
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setSelectedPreviewSlots([])} disabled={selectedPreviewSlots.length === 0}>
                      Bo chon
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {previewSlots.map((slot) => {
                    const key = new Date(slot.startsAt).toISOString()
                    const checked = selectedPreviewSlots.includes(key)
                    const slotDateLabel = new Date(slot.startsAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                    const startsAtLabel = new Date(slot.startsAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                    const endsAtLabel = new Date(slot.endsAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

                    return (
                      <label
                        key={key}
                        className={`flex min-h-16 items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                          slot.selectable
                            ? "cursor-pointer border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70 dark:border-slate-800 dark:bg-slate-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!slot.selectable}
                          onChange={() => togglePreviewSlot(slot)}
                        />
                        <span className="flex-1">
                          <span className="block text-xs text-slate-500 dark:text-slate-400">{slotDateLabel}</span>
                          <span className="block font-medium text-slate-900 dark:text-slate-50">{startsAtLabel} - {endsAtLabel}</span>
                          {!slot.selectable && (
                            <span className="text-xs text-rose-500">{slot.reason === "CONFLICT" ? "Trung lich phong" : "Da qua gio"}</span>
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>

                {previewSlots.length === 0 && (
                  <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Chua co khung gio de xuat. Quay lai cau hinh de tao de xuat moi.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="showtime-branch">Rap</Label>
              <select
                id="showtime-branch"
                value={branchId}
                onChange={(event) => {
                  setBranchId(event.target.value)
                  resetPreview()
                }}
                disabled={isFinishedShowtime}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showtime-auditorium">Phong chieu</Label>
              <select
                id="showtime-auditorium"
                value={auditoriumId}
                onChange={(event) => {
                  setAuditoriumId(event.target.value)
                  resetPreview()
                }}
                disabled={isFinishedShowtime}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                {branchAuditoriums.map((auditorium) => (
                  <option key={auditorium.id} value={auditorium.id}>
                    {auditorium.name} - {auditorium.format}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showtime-movie">Phim</Label>
              <select
                id="showtime-movie"
                value={movieId}
                onChange={(event) => handleMovieChange(event.target.value)}
                disabled={isFinishedShowtime}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showtime-status">Trang thai</Label>
              <select
                id="showtime-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as ShowtimeStatus)}
                disabled={isFinishedShowtime}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                {statuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {mode === "single" || showtime ? (
              <>
                <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                  <div className="space-y-2">
                    <Label htmlFor="showtime-start-date">Ngay bat dau</Label>
                    <Input
                      id="showtime-start-date"
                      type="date"
                      value={startsAt.split("T")[0] || ""}
                      onChange={(event) => handleStartDateChange(event.target.value)}
                      disabled={isFinishedShowtime}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gio bat dau</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        id="showtime-start-hour"
                        value={usableManualHours.includes(selectedStartHour) ? selectedStartHour : ""}
                        onChange={(event) => handleStartHourChange(event.target.value)}
                        disabled={isFinishedShowtime || isLoadingManualTimes || usableManualHours.length === 0}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      >
                        {isLoadingManualTimes && <option value="">--</option>}
                        {!isLoadingManualTimes && usableManualHours.length === 0 && <option value="">--</option>}
                        {usableManualHours.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <select
                        id="showtime-start-minute"
                        value={usableManualMinutes.includes(selectedStartMinute) ? selectedStartMinute : ""}
                        onChange={(event) => handleStartMinuteChange(event.target.value)}
                        disabled={isFinishedShowtime || isLoadingManualTimes || usableManualMinutes.length === 0}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      >
                        {isLoadingManualTimes && <option value="">--</option>}
                        {!isLoadingManualTimes && usableManualMinutes.length === 0 && <option value="">--</option>}
                        {usableManualMinutes.map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!isLoadingManualTimes && usableManualTimeOptions.length === 0 && !isFinishedShowtime && (
                      <p className="text-xs text-rose-500">Ngay/phong nay khong con khung gio hop le.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="showtime-end">Ket thuc du kien</Label>
                  <Input id="showtime-end" type="datetime-local" value={endsAt} disabled />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="showtime-date-from">Tu ngay</Label>
                  <Input id="showtime-date-from" type="date" value={dateFrom} onChange={(event) => {
                    const nextDateFrom = event.target.value
                    setDateFrom(nextDateFrom)
                    if (dateTo < nextDateFrom) {
                      setDateTo(nextDateFrom)
                    }
                    resetPreview()
                  }} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="showtime-date-to">Den ngay</Label>
                  <Input id="showtime-date-to" type="date" min={dateFrom} value={dateTo} onChange={(event) => {
                    setDateTo(event.target.value)
                    resetPreview()
                  }} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operating-start">Gio hoat dong tu</Label>
                  <Input id="operating-start" type="time" value={operatingStartTime} onChange={(event) => {
                    setOperatingStartTime(event.target.value)
                    resetPreview()
                  }} step={300} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operating-end">Gio hoat dong den</Label>
                  <Input id="operating-end" type="text" value={operatingEndTime} onChange={(event) => {
                    setOperatingEndTime(event.target.value)
                    resetPreview()
                  }} placeholder="24:00" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="showtime-price">Gia ve co ban</Label>
              <Input id="showtime-price" type="number" min="0" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} disabled={isFinishedShowtime} />
            </div>

            {!isFinishedShowtime && (
              <div className="space-y-2">
                <Label htmlFor="showtime-buffer">Buffer / don phong (phut)</Label>
                <Input id="showtime-buffer" type="number" min="0" value={bufferMinutes} onChange={(event) => handleBufferChange(event.target.value)} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="showtime-note">Ghi chu</Label>
            <Textarea id="showtime-note" value={note} onChange={(event) => setNote(event.target.value)} />
          </div>
            </>
          )}

          <DialogFooter>
            {mode === "auto" && autoStep === "slots" && !showtime && !isFinishedShowtime ? (
              <>
                <Button type="button" variant="outline" onClick={() => setAutoStep("config")} disabled={isSubmitting}>
                  Quay lai
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting || selectedSelectableCount === 0}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tao {selectedSelectableCount} suat chieu
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting || isPreviewing}>
                  Huy
                </Button>
                {mode === "auto" && !showtime && !isFinishedShowtime ? (
                  <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handlePreview} disabled={isPreviewing}>
                    {isPreviewing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tiep tuc chon khung gio
                  </Button>
                ) : (
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isFinishedShowtime ? "Cap nhat ghi chu" : showtime ? "Cap nhat" : "Them moi"}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
