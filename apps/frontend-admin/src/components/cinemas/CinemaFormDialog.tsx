"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import apiClient from "@/lib/axios"

interface CinemaFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  cinemaToEdit: any | null
  onSuccess: () => void
}

export function CinemaFormDialog({
  isOpen,
  onOpenChange,
  cinemaToEdit,
  onSuccess,
}: CinemaFormDialogProps) {
  const isEditing = !!cinemaToEdit
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (isEditing && cinemaToEdit) {
        setFormData({
          name: cinemaToEdit.name || "",
          address: cinemaToEdit.address || "",
          phone: cinemaToEdit.phone || "",
        })
      } else {
        setFormData({ name: "", address: "", phone: "" })
      }
      setError(null)
    }
  }, [isOpen, isEditing, cinemaToEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEditing) {
        await apiClient.patch(`/branches/${cinemaToEdit.id}`, formData)
      } else {
        await apiClient.post("/branches", formData)
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Có lỗi xảy ra khi lưu chi nhánh")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {isEditing ? "Cập nhật chi nhánh" : "Thêm chi nhánh mới"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEditing
                ? "Chỉnh sửa thông tin chi tiết của chi nhánh này."
                : "Điền thông tin bên dưới để thêm một chi nhánh mới vào hệ thống."}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            {error && <div className="text-sm font-medium text-red-500">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="name">Tên chi nhánh</Label>
              <Input
                id="name"
                name="name"
                placeholder="VD: Cinema Quận 1"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-800/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                placeholder="VD: 123 Đường ABC..."
                value={formData.address}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-800/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="VD: 0123456789"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
