"use client"

import * as React from "react"
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock3,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient from "@/lib/axios"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/usePermissions"
import { ShowtimeFormDialog } from "./ShowtimeFormDialog"
import { Auditorium, Branch, Movie, Showtime } from "./types"
import {
  formatHour,
  getEventStyle,
  getTimeLabel,
  getVisibleEventRange,
  getWeekRange,
  getWeekRangeLabel,
  rowHeight,
  scheduleEndHour,
  scheduleStartHour,
  statusConfig,
  timeSlots,
  toDateInputValue,
} from "./showtime-utils"

export function ShowtimesManager() {
  const { hasPermission } = usePermissions()
  const [viewMode, setViewMode] = React.useState<"day" | "week">("day")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [now, setNow] = React.useState(() => new Date())
  const [selectedDate, setSelectedDate] = React.useState(() => new Date())
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [auditoriums, setAuditoriums] = React.useState<Auditorium[]>([])
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [showtimes, setShowtimes] = React.useState<Showtime[]>([])
  const [selectedBranchId, setSelectedBranchId] = React.useState("")
  const [isCinemaMenuOpen, setIsCinemaMenuOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedShowtime, setSelectedShowtime] = React.useState<Showtime | null>(null)
  const [isLoadingBranches, setIsLoadingBranches] = React.useState(true)
  const [isLoadingSchedule, setIsLoadingSchedule] = React.useState(false)
  const [error, setError] = React.useState("")

  const canCreate = hasPermission("showtime:create")
  const canUpdate = hasPermission("showtime:update")
  const canDelete = hasPermission("showtime:delete")
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) || branches[0]
  const selectedDateValue = toDateInputValue(selectedDate)
  const scheduleQuery = React.useMemo(() => {
    if (viewMode === "week") {
      const { start, end } = getWeekRange(selectedDate)
      return `dateFrom=${toDateInputValue(start)}&dateTo=${toDateInputValue(end)}`
    }

    return `date=${selectedDateValue}`
  }, [selectedDate, selectedDateValue, viewMode])

  const fetchSchedule = React.useCallback(async () => {
    if (!selectedBranchId) return

    setIsLoadingSchedule(true)
    setError("")
    try {
      const [auditoriumsRes, showtimesRes] = await Promise.all([
        apiClient.get<Auditorium[]>(`/auditoriums?branchId=${selectedBranchId}`),
        apiClient.get<Showtime[]>(`/showtimes?branchId=${selectedBranchId}&${scheduleQuery}`),
      ])
      setAuditoriums(Array.isArray(auditoriumsRes.data) ? auditoriumsRes.data : [])
      setShowtimes(Array.isArray(showtimesRes.data) ? showtimesRes.data : [])
    } catch {
      setAuditoriums([])
      setShowtimes([])
      setError("Khong the tai lich chieu. Vui long kiem tra du lieu hoac thu lai.")
    } finally {
      setIsLoadingSchedule(false)
    }
  }, [scheduleQuery, selectedBranchId])

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  React.useEffect(() => {
    let ignore = false

    Promise.all([
      apiClient.get<Branch[]>("/branches"),
      apiClient.get<Movie[]>("/movies"),
    ])
      .then(([branchesRes, moviesRes]) => {
        if (ignore) return
        const branchData = Array.isArray(branchesRes.data) ? branchesRes.data : []
        setBranches(branchData)
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : [])
        setSelectedBranchId((current) => current || branchData[0]?.id || "")
      })
      .catch(() => {
        if (!ignore) setError("Khong the tai du lieu rap hoac phim.")
      })
      .finally(() => {
        if (!ignore) setIsLoadingBranches(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  React.useEffect(() => {
    if (!selectedBranchId) {
      Promise.resolve().then(() => {
        setAuditoriums([])
        setShowtimes([])
      })
      return
    }

    let ignore = false

    Promise.resolve()
      .then(() => {
        setIsLoadingSchedule(true)
        setError("")
      })
      .then(() => Promise.all([
        apiClient.get<Auditorium[]>(`/auditoriums?branchId=${selectedBranchId}`),
        apiClient.get<Showtime[]>(`/showtimes?branchId=${selectedBranchId}&${scheduleQuery}`),
      ]))
      .then(([auditoriumsRes, showtimesRes]) => {
        if (ignore) return
        setAuditoriums(Array.isArray(auditoriumsRes.data) ? auditoriumsRes.data : [])
        setShowtimes(Array.isArray(showtimesRes.data) ? showtimesRes.data : [])
      })
      .catch(() => {
        if (!ignore) {
          setAuditoriums([])
          setShowtimes([])
          setError("Khong the tai lich chieu. Vui long kiem tra du lieu hoac thu lai.")
        }
      })
      .finally(() => {
        if (!ignore) setIsLoadingSchedule(false)
      })

    return () => {
      ignore = true
    }
  }, [scheduleQuery, selectedBranchId])

  const filteredShowtimes = React.useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return showtimes
    return showtimes.filter((item) => item.movie?.title?.toLowerCase().includes(keyword))
  }, [searchTerm, showtimes])

  const currentTimeMarker = React.useMemo(() => {
    const today = toDateInputValue(new Date())
    if (selectedDateValue !== today) return null

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
    const scheduleStartMinutes = scheduleStartHour * 60
    const scheduleEndMinutes = scheduleEndHour * 60

    if (currentMinutes < scheduleStartMinutes || currentMinutes > scheduleEndMinutes) {
      return null
    }

    return {
      top: `${((currentMinutes - scheduleStartMinutes) / 60) * rowHeight}px`,
      label: now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    }
  }, [now, selectedDateValue])

  const moveDate = (amount: number) => {
    setSelectedDate((current) => {
      const next = new Date(current)
      next.setDate(current.getDate() + amount * (viewMode === "week" ? 7 : 1))
      return next
    })
  }

  const openCreateDialog = () => {
    setSelectedShowtime(null)
    setIsFormOpen(true)
  }

  const openEditDialog = (showtime: Showtime) => {
    setSelectedShowtime(showtime)
    setIsFormOpen(true)
  }

  const handleDelete = async (showtime: Showtime) => {
    if (new Date(showtime.startsAt) <= new Date()) {
      toast.error("Khong the xoa suat chieu da bat dau.")
      return
    }

    if (!window.confirm(`Xoa suat chieu "${showtime.movie?.title || "nay"}"?`)) return

    try {
      await apiClient.delete(`/showtimes/${showtime.id}`)
      toast.success("Da xoa suat chieu.")
      fetchSchedule()
    } catch (error: unknown) {
      const message = error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || "Khong the xoa suat chieu.")
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Lich Chieu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Sap xep suat chieu theo phong, khung gio va trang thai van hanh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "day"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              Ngay
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "week"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              Tuan
            </button>
          </div>

          {canCreate && (
            <Button
              onClick={openCreateDialog}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Them Suat Chieu
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCinemaMenuOpen((open) => !open)}
                disabled={isLoadingBranches || branches.length === 0}
                className="flex h-9 min-w-[220px] items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-red-500" />
                  <span className="truncate">
                    {isLoadingBranches ? "Dang tai rap..." : selectedBranch?.name || "Chua co rap"}
                  </span>
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
              </button>

              {isCinemaMenuOpen && (
                <div className="absolute left-0 top-11 z-40 w-72 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {branches.map((branch) => {
                    const isSelected = branch.id === selectedBranchId

                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => {
                          setSelectedBranchId(branch.id)
                          setIsCinemaMenuOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          isSelected
                            ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        )}
                      >
                        <MapPin className={cn("h-4 w-4 shrink-0", isSelected ? "text-red-500" : "text-slate-400")} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{branch.name}</span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{branch.address}</span>
                        </span>
                        {isSelected && <Check className="h-4 w-4 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => moveDate(-1)}
              className="h-9 w-9 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <label className="relative flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {selectedDate.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Tuan van hanh {getWeekRangeLabel(selectedDate)}
                </div>
              </div>
              <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="date"
                value={selectedDateValue}
                onChange={(event) => setSelectedDate(new Date(`${event.target.value}T00:00:00`))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Chon ngay chieu"
              />
            </label>
            <Button
              variant="outline"
              size="icon"
              onClick={() => moveDate(1)}
              className="h-9 w-9 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tim phim trong lich chieu..."
              className="pl-9 bg-slate-50 dark:bg-slate-950"
            />
          </div>
        </div>

        {error && (
          <div className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div
              className="grid border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70"
              style={{ gridTemplateColumns: `72px repeat(${Math.max(auditoriums.length, 1)}, minmax(170px, 1fr))` }}
            >
              <div className="flex items-center justify-center border-r border-slate-200 p-4 dark:border-slate-800">
                {isLoadingSchedule ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                ) : (
                  <Clock3 className="h-5 w-5 text-slate-400" />
                )}
              </div>

              {auditoriums.length > 0 ? (
                auditoriums.map((room) => (
                  <div key={room.id} className="border-r border-slate-200 p-4 last:border-r-0 dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">{room.name}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{room.format}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {room.capacity} ghe
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                  {isLoadingSchedule ? "Dang tai phong chieu..." : "Rap nay chua co phong chieu."}
                </div>
              )}
            </div>

            <div
              className="relative grid"
              style={{ gridTemplateColumns: `72px repeat(${Math.max(auditoriums.length, 1)}, minmax(170px, 1fr))` }}
            >
              <div className="border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70">
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-[72px] border-b border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    {formatHour(hour)}
                  </div>
                ))}
              </div>

              {currentTimeMarker && auditoriums.length > 0 && (
                <div
                  className="pointer-events-none absolute left-[72px] right-0 z-30"
                  style={{ top: currentTimeMarker.top }}
                >
                  <div className="absolute -left-[64px] top-1/2 flex -translate-y-1/2 items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/40" />
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm shadow-red-500/30">
                      {currentTimeMarker.label}
                    </span>
                  </div>
                  <div className="h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]" />
                </div>
              )}

              {auditoriums.length > 0 ? (
                auditoriums.map((room) => {
                  const roomShowtimes = filteredShowtimes.filter((item) => item.auditoriumId === room.id)

                  return (
                    <div
                      key={room.id}
                      className="relative border-r border-slate-200 bg-white last:border-r-0 dark:border-slate-800 dark:bg-slate-950/40"
                      style={{ height: `${timeSlots.length * rowHeight}px` }}
                    >
                      {timeSlots.map((hour) => (
                        <div
                          key={`${room.id}-${hour}`}
                          className="h-[72px] border-b border-dashed border-slate-200 dark:border-slate-800"
                        />
                      ))}

                      {roomShowtimes.map((item) => {
                        const status = statusConfig[item.status] || statusConfig.SCHEDULED
                        const capacity = item.auditorium?.capacity || room.capacity || 0
                        const eventDisplayDate = viewMode === "day" ? selectedDate : new Date(item.startsAt)
                        const visibleRange = getVisibleEventRange(item.startsAt, item.endsAt, eventDisplayDate)
                        const isCompact = visibleRange.durationMinutes < 120

                        return (
                          <div
                            key={item.id}
                            className="absolute left-3 right-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                            style={getEventStyle(item.startsAt, item.endsAt, eventDisplayDate)}
                          >
                            <div className={cn("absolute inset-y-0 left-0 w-1", status.rail)} />
                            <div className={cn("flex h-full flex-col justify-between pl-4", isCompact ? "p-2.5" : "p-3")}>
                              <div className={isCompact ? "space-y-1" : "space-y-2"}>
                                <div className="flex items-start justify-between gap-2">
                                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
                                    {item.movie?.title || "Chua ro phim"}
                                  </p>
                                  <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold", status.className)}>
                                    {status.label}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock3 className="h-3 w-3" />
                                    {getTimeLabel(item.startsAt)} - {getTimeLabel(item.endsAt)}
                                  </span>
                                  {!isCompact && <span>{item.auditorium?.format || room.format}</span>}
                                </div>
                                {visibleRange.continuesFromPreviousDay && (
                                  <p className="text-[11px] font-medium text-indigo-500 dark:text-indigo-300">Tiep tuc tu hom truoc</p>
                                )}
                                {visibleRange.continuesToNextDay && (
                                  <p className="text-[11px] font-medium text-indigo-500 dark:text-indigo-300">Tiep tuc sang hom sau</p>
                                )}
                                {!isCompact && item.note && (
                                  <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
                                )}
                              </div>
                              {!isCompact && <div className="flex items-end justify-between gap-2">
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                  0/{capacity} ghe
                                </p>
                                <div className="flex items-center gap-1">
                                  {canUpdate && (
                                    <button
                                      type="button"
                                      onClick={() => openEditDialog(item)}
                                      className="rounded p-1 text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"
                                      title="Sua"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {canDelete && new Date(item.startsAt) > now && (
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(item)}
                                      className="rounded p-1 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                      title="Xoa"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>}
                              {isCompact && (canUpdate || (canDelete && new Date(item.startsAt) > now)) && (
                                <div className="absolute bottom-1.5 right-2 flex items-center gap-1 rounded-md bg-white/90 pl-1 shadow-sm dark:bg-slate-900/90">
                                  {canUpdate && (
                                    <button
                                      type="button"
                                      onClick={() => openEditDialog(item)}
                                      className="rounded p-1 text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"
                                      title="Sua"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {canDelete && new Date(item.startsAt) > now && (
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(item)}
                                      className="rounded p-1 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                      title="Xoa"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              ) : (
                <div
                  className="flex items-center justify-center border-b border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400"
                  style={{ height: `${timeSlots.length * rowHeight}px` }}
                >
                  {isLoadingSchedule ? "Dang tai lich chieu..." : "Chua co du lieu phong chieu de hien thi lich."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShowtimeFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        showtime={selectedShowtime}
        branches={branches}
        auditoriums={auditoriums}
        movies={movies}
        selectedBranchId={selectedBranchId}
        onSuccess={fetchSchedule}
      />
    </div>
  )
}
