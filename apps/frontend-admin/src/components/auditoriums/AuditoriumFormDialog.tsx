"use client"

import * as React from "react"
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
import { Auditorium, AuditoriumPayload, Branch } from "./types"

interface AuditoriumFormDialogProps {
  open: boolean
  branches: Branch[]
  auditorium?: Auditorium | null
  selectedBranchId: string
  isSaving?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: AuditoriumPayload) => Promise<void>
}

export function AuditoriumFormDialog({
  open,
  branches,
  auditorium,
  selectedBranchId,
  isSaving = false,
  onOpenChange,
  onSubmit,
}: AuditoriumFormDialogProps) {
  const [form, setForm] = React.useState<AuditoriumPayload>({
    branchId: selectedBranchId,
    name: "",
    format: "2D",
    layoutRows: 7,
    layoutCols: 14,
    isActive: true,
  })

  React.useEffect(() => {
    if (!open) return

    setForm({
      branchId: auditorium?.branchId || selectedBranchId,
      name: auditorium?.name || "",
      format: auditorium?.format || "2D",
      layoutRows: auditorium?.layoutRows || 7,
      layoutCols: auditorium?.layoutCols || 14,
      isActive: auditorium?.isActive ?? true,
    })
  }, [auditorium, open, selectedBranchId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{auditorium ? "Sua phong chieu" : "Them phong chieu"}</DialogTitle>
          <DialogDescription>Thong tin phong se duoc luu vao database va dung lai cho so do ghe.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="auditorium-branch">Rap</Label>
            <select
              id="auditorium-branch"
              value={form.branchId}
              onChange={(event) => setForm((current) => ({ ...current, branchId: event.target.value }))}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              required
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auditorium-name">Ten phong</Label>
            <Input
              id="auditorium-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auditorium-format">Dinh dang</Label>
            <Input
              id="auditorium-format"
              value={form.format}
              onChange={(event) => setForm((current) => ({ ...current, format: event.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="auditorium-layout-rows">So hang</Label>
              <Input
                id="auditorium-layout-rows"
                type="number"
                min={1}
                max={26}
                value={form.layoutRows}
                onChange={(event) => setForm((current) => ({ ...current, layoutRows: Number(event.target.value) || 1 }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="auditorium-layout-cols">So cot</Label>
              <Input
                id="auditorium-layout-cols"
                type="number"
                min={1}
                max={30}
                value={form.layoutCols}
                onChange={(event) => setForm((current) => ({ ...current, layoutCols: Number(event.target.value) || 1 }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huy
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Dang luu..." : "Luu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
