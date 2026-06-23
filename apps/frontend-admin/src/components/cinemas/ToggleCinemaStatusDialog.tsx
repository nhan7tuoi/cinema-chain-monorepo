"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/axios"

interface ToggleCinemaStatusDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  cinema: any | null
  onSuccess: () => void
}

export function ToggleCinemaStatusDialog({
  isOpen,
  onOpenChange,
  cinema,
  onSuccess,
}: ToggleCinemaStatusDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!cinema) return null

  const isCurrentlyActive = cinema.isActive
  const actionText = isCurrentlyActive ? "Dừng hoạt động" : "Mở lại hoạt động"

  const handleToggle = async () => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.patch(`/branches/${cinema.id}/toggle-status`)
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || `Có lỗi xảy ra khi ${actionText.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận {actionText.toLowerCase()}</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn {actionText.toLowerCase()} chi nhánh <span className="font-semibold text-slate-900 dark:text-white">{cinema.name}</span> không?
            {isCurrentlyActive && (
              <span className="block mt-2 text-red-500">
                Lưu ý: Các hoạt động liên quan đến chi nhánh này có thể bị gián đoạn.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {error && <div className="text-sm font-medium text-red-500 py-2">{error}</div>}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Huỷ
          </Button>
          <Button 
            variant={isCurrentlyActive ? "destructive" : "default"} 
            onClick={handleToggle} 
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
