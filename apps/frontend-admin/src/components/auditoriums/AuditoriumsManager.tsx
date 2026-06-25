"use client"

import * as React from "react"
import { Edit3, Plus, Search, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auditoriumsApi } from "./api"
import { AuditoriumFormDialog } from "./AuditoriumFormDialog"
import { SeatMapEditor } from "./SeatMapEditor"
import { dbSeatsToNodes, defaultColCount, defaultRowCount, nodesToSavePayload } from "./seat-utils"
import { Auditorium, AuditoriumPayload, Branch, SeatNode } from "./types"

export function AuditoriumsManager() {
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [auditoriums, setAuditoriums] = React.useState<Auditorium[]>([])
  const [selectedBranchId, setSelectedBranchId] = React.useState("")
  const [selectedAuditoriumId, setSelectedAuditoriumId] = React.useState("")
  const [selectedAuditorium, setSelectedAuditorium] = React.useState<Auditorium | null>(null)
  const [search, setSearch] = React.useState("")
  const [rowCount, setRowCount] = React.useState(defaultRowCount)
  const [colCount, setColCount] = React.useState(defaultColCount)
  const [seats, setSeats] = React.useState<SeatNode[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = React.useState(true)
  const [isLoadingAuditoriums, setIsLoadingAuditoriums] = React.useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingAuditorium, setEditingAuditorium] = React.useState<Auditorium | null>(null)

  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId)
  const filteredAuditoriums = React.useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return auditoriums

    return auditoriums.filter((auditorium) =>
      `${auditorium.name} ${auditorium.format}`.toLowerCase().includes(keyword)
    )
  }, [auditoriums, search])

  const loadBranches = React.useCallback(async () => {
    setIsLoadingBranches(true)
    try {
      const data = await auditoriumsApi.getBranches()
      setBranches(data)
      setSelectedBranchId((current) => current || data[0]?.id || "")
    } catch (error) {
      console.error(error)
      toast.error("Khong tai duoc danh sach rap")
    } finally {
      setIsLoadingBranches(false)
    }
  }, [])

  const loadAuditoriums = React.useCallback(async (branchId: string) => {
    if (!branchId) {
      setAuditoriums([])
      setSelectedAuditoriumId("")
      return
    }

    setIsLoadingAuditoriums(true)
    try {
      const data = await auditoriumsApi.getAuditoriums(branchId)
      setAuditoriums(data)
      setSelectedAuditoriumId((current) => data.some((item) => item.id === current) ? current : data[0]?.id || "")
    } catch (error) {
      console.error(error)
      setAuditoriums([])
      toast.error("Khong tai duoc danh sach phong")
    } finally {
      setIsLoadingAuditoriums(false)
    }
  }, [])

  const loadAuditoriumDetail = React.useCallback(async (auditoriumId: string) => {
    if (!auditoriumId) {
      setSelectedAuditorium(null)
      setSeats([])
      return
    }

    setIsLoadingDetail(true)
    try {
      const detail = await auditoriumsApi.getAuditorium(auditoriumId)
      setSelectedAuditorium(detail)
      setRowCount(detail.layoutRows || defaultRowCount)
      setColCount(detail.layoutCols || defaultColCount)
      setSeats(dbSeatsToNodes(detail.seats))
    } catch (error) {
      console.error(error)
      setSelectedAuditorium(null)
      setSeats([])
      toast.error("Khong tai duoc layout phong")
    } finally {
      setIsLoadingDetail(false)
    }
  }, [])

  React.useEffect(() => {
    loadBranches()
  }, [loadBranches])

  React.useEffect(() => {
    loadAuditoriums(selectedBranchId)
  }, [loadAuditoriums, selectedBranchId])

  React.useEffect(() => {
    if (selectedAuditoriumId && filteredAuditoriums.length > 0 && !filteredAuditoriums.some((room) => room.id === selectedAuditoriumId)) {
      setSelectedAuditoriumId(filteredAuditoriums[0].id)
    }
  }, [filteredAuditoriums, selectedAuditoriumId])

  React.useEffect(() => {
    loadAuditoriumDetail(selectedAuditoriumId)
  }, [loadAuditoriumDetail, selectedAuditoriumId])

  const handleCreate = () => {
    setEditingAuditorium(null)
    setIsFormOpen(true)
  }

  const handleEdit = () => {
    if (!selectedAuditorium) return
    setEditingAuditorium(selectedAuditorium)
    setIsFormOpen(true)
  }

  const handleSubmitAuditorium = async (payload: AuditoriumPayload) => {
    setIsSaving(true)
    try {
      const saved = editingAuditorium
        ? await auditoriumsApi.updateAuditorium(editingAuditorium.id, payload)
        : await auditoriumsApi.createAuditorium(payload)

      toast.success(editingAuditorium ? "Da cap nhat phong" : "Da them phong")
      setIsFormOpen(false)
      setSelectedBranchId(saved.branchId)
      await loadAuditoriums(saved.branchId)
      setSelectedAuditoriumId(saved.id)
    } catch (error) {
      console.error(error)
      toast.error("Khong luu duoc phong")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAuditorium = async () => {
    if (!selectedAuditorium) return
    const agreed = window.confirm(`Xoa phong ${selectedAuditorium.name}?`)
    if (!agreed) return

    setIsSaving(true)
    try {
      await auditoriumsApi.deleteAuditorium(selectedAuditorium.id)
      toast.success("Da xoa phong")
      await loadAuditoriums(selectedBranchId)
    } catch (error) {
      console.error(error)
      toast.error("Khong xoa duoc phong")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLayout = async () => {
    if (!selectedAuditorium) return

    setIsSaving(true)
    try {
      const saved = await auditoriumsApi.saveSeatLayout(
        selectedAuditorium.id,
        nodesToSavePayload(rowCount, colCount, seats)
      )

      setSelectedAuditorium(saved)
      setSeats(dbSeatsToNodes(saved.seats))
      setRowCount(saved.layoutRows || rowCount)
      setColCount(saved.layoutCols || colCount)
      await loadAuditoriums(selectedBranchId)
      toast.success("Da luu layout ghe")
    } catch (error) {
      console.error(error)
      toast.error("Khong luu duoc layout ghe")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Quan Ly Phong Chieu</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Thiet lap phong, so do ghe va trang thai ghe ngoi trong tung rap.</p>
        </div>

        <Button onClick={handleCreate} disabled={branches.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Them phong
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,280px)_minmax(260px,1fr)_minmax(220px,280px)_auto] lg:items-end">
          <div>
            <label htmlFor="auditorium-branch-select" className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Rap
            </label>
            <select
              id="auditorium-branch-select"
              value={selectedBranchId}
              onChange={(event) => {
                setSearch("")
                setSelectedBranchId(event.target.value)
              }}
              disabled={isLoadingBranches}
              className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="auditorium-room-select" className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                Phong
              </label>
              <span className="text-xs text-slate-400">{filteredAuditoriums.length} phong</span>
            </div>
            <select
              id="auditorium-room-select"
              value={filteredAuditoriums.some((room) => room.id === selectedAuditoriumId) ? selectedAuditoriumId : ""}
              onChange={(event) => setSelectedAuditoriumId(event.target.value)}
              disabled={isLoadingAuditoriums || filteredAuditoriums.length === 0}
              className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              {isLoadingAuditoriums ? (
                <option value="">Dang tai phong...</option>
              ) : filteredAuditoriums.length > 0 ? (
                filteredAuditoriums.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {room.format} - {room.capacity} ghe
                  </option>
                ))
              ) : (
                <option value="">Chua co phong</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="auditorium-room-search" className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Tim phong
            </label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="auditorium-room-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ten phong, dinh dang..."
                className="pl-9 bg-white dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button type="button" variant="outline" size="sm" onClick={handleEdit} disabled={!selectedAuditorium}>
              <Edit3 className="mr-2 h-4 w-4" />
              Sua
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={handleDeleteAuditorium} disabled={!selectedAuditorium || isSaving}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xoa
            </Button>
          </div>
        </div>

        {selectedAuditorium ? (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
            <span className="text-slate-500">
              Dinh dang: <strong className="font-semibold text-slate-900 dark:text-slate-50">{selectedAuditorium.format}</strong>
            </span>
            <span className="text-slate-500">
              Suc chua: <strong className="font-semibold text-slate-900 dark:text-slate-50">{selectedAuditorium.capacity}</strong>
            </span>
            <span className="text-slate-500">
              Layout: <strong className="font-semibold text-slate-900 dark:text-slate-50">{rowCount} x {colCount}</strong>
            </span>
          </div>
        ) : (
          <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-slate-800">
            {isLoadingDetail ? "Dang tai layout..." : "Chon hoac them phong de bat dau."}
          </p>
        )}
      </div>

      {selectedAuditorium ? (
        <SeatMapEditor
          auditoriumName={selectedAuditorium.name}
          branchName={selectedAuditorium.branch?.name || selectedBranch?.name || ""}
          isActive={selectedAuditorium.isActive}
          rowCount={rowCount}
          colCount={colCount}
          seats={seats}
          isSaving={isSaving}
          onRowCountChange={setRowCount}
          onColCountChange={setColCount}
          onSeatsChange={setSeats}
          onSave={handleSaveLayout}
        />
      ) : (
        <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          {isLoadingDetail ? "Dang tai layout..." : "Chua co phong duoc chon"}
        </div>
      )}

      <AuditoriumFormDialog
        open={isFormOpen}
        branches={branches}
        auditorium={editingAuditorium}
        selectedBranchId={selectedBranchId}
        isSaving={isSaving}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitAuditorium}
      />
    </div>
  )
}
