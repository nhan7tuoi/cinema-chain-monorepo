"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import apiClient from "@/lib/axios"
import { CinemaFormDialog } from "@/components/cinemas/CinemaFormDialog"
import { ToggleCinemaStatusDialog } from "@/components/cinemas/ToggleCinemaStatusDialog"

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isToggleOpen, setIsToggleOpen] = useState(false)
  const [selectedCinema, setSelectedCinema] = useState<any | null>(null)

  const fetchCinemas = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get("/branches")
      console.log("FETCH CINEMAS RES:", response)
      if (response.status === true) {
        const branches = Array.isArray(response.data) ? response.data : (response.data?.data || response.data || response)
        console.log("branches data:", branches)
        setCinemas(Array.isArray(branches) ? branches : [])
      } else {
        if (Array.isArray(response)) setCinemas(response)
        else if (Array.isArray(response.data)) setCinemas(response.data)
        else setCinemas([])
      }
    } catch (error) {
      console.error("Failed to fetch cinemas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCinemas()
  }, [])

  const handleAdd = () => {
    setSelectedCinema(null)
    setIsFormOpen(true)
  }

  const handleEdit = (cinema: any) => {
    setSelectedCinema(cinema)
    setIsFormOpen(true)
  }

  const handleToggleStatus = (cinema: any) => {
    setSelectedCinema(cinema)
    setIsToggleOpen(true)
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Tên chi nhánh",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => <span className="text-slate-600 dark:text-slate-400">{row.getValue("address")}</span>,
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => <span className="text-slate-600 dark:text-slate-400">{row.getValue("phone") || "---"}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {isActive ? "Hoạt động" : "Tạm dừng"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Hành Động</div>,
      cell: ({ row }) => {
        const cinema = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEdit(cinema)}
              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
              title="Chỉnh sửa"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Chỉnh sửa</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleToggleStatus(cinema)}
              className={`h-8 w-8 border-slate-200 dark:border-slate-800 dark:bg-slate-900 ${
                cinema.isActive
                  ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
              }`}
              title={cinema.isActive ? "Dừng hoạt động" : "Mở lại"}
            >
              {cinema.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              <span className="sr-only">Toggle Status</span>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Chi Nhánh
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý danh sách các rạp phim trong hệ thống.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm Chi Nhánh
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={cinemas} 
        searchKey="name"
        searchPlaceholder="Tìm chi nhánh theo tên..."
        isLoading={loading}
      />

      <CinemaFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        cinemaToEdit={selectedCinema}
        onSuccess={fetchCinemas}
      />
      
      <ToggleCinemaStatusDialog
        isOpen={isToggleOpen}
        onOpenChange={setIsToggleOpen}
        cinema={selectedCinema}
        onSuccess={fetchCinemas}
      />
    </div>
  )
}
