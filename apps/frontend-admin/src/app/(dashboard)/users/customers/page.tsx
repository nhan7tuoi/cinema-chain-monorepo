"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, Star } from "lucide-react"
import Cookies from "js-cookie"

import apiClient from "@/lib/axios"

export default function CustomersPage() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 3 })
  const [pageCount, setPageCount] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    try {
      const userInfoStr = Cookies.get("user_info")
      if (userInfoStr) {
        const user = JSON.parse(userInfoStr)
        if (user && user.permissions) setPermissions(user.permissions)
      }
    } catch (e) {
      console.error(e)
    }

    const fetchCustomers = async () => {
      try {
        const res = await apiClient.get(`/customers?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
        if (res.data?.status === 'success') {
          const transformed = res.data.data.map((cus: any) => ({
            id: cus.id,
            fullName: cus.fullName,
            email: cus.user?.email || "N/A",
            phone: cus.user?.phone || "N/A",
            points: cus.points,
            rank: cus.rank,
            status: cus.user?.status === 'ACTIVE' ? "Hoạt động" : cus.user?.status === 'LOCKED' ? "Khóa" : "Đã Ẩn",
          }))
          setData(transformed)
          setPageCount(res.data.meta.pageCount)
          setTotalItems(res.data.meta.itemCount)
        }
      } catch (error) {
        console.error("Failed to fetch customers", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [pagination.pageIndex, pagination.pageSize])

  const canCreate = permissions.includes("user:create")
  const canUpdate = permissions.includes("user:update")
  const canDelete = permissions.includes("user:delete")

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "fullName",
      header: "Họ Tên",
      cell: ({ row }) => <span className="font-medium text-slate-800 dark:text-slate-200">{row.getValue("fullName")}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "rank",
      header: "Hạng Thành Viên",
      cell: ({ row }) => {
        const rank = row.getValue("rank") as string
        return (
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md w-max border ${
            rank === "VVIP" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30" :
            rank === "VIP" ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30" :
            "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
          }`}>
            <Star className={`w-3.5 h-3.5 ${rank !== "MEMBER" ? "fill-current" : ""}`} />
            {rank}
          </div>
        )
      },
    },
    {
      accessorKey: "points",
      header: "Điểm Tích Lũy",
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("points")}</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng Thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const isActive = status === "Hoạt động"
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}>
            {status}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Hành Động</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            {canUpdate && (
              <Button variant="outline" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {canDelete && (
              <Button variant="outline" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Khách Hàng
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý thông tin và điểm tích lũy của khách hàng.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canCreate && (
            <Button className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white shadow-md shadow-cyan-600/20">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Khách Hàng
            </Button>
          )}
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="fullName"
        searchPlaceholder="Tìm khách hàng theo tên..."
        pageCount={pageCount}
        totalItems={totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  )
}
