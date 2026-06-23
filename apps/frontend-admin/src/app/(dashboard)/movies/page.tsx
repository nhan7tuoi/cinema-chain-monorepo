"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Film, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/hooks/usePermissions"
import apiClient from "@/lib/axios"
import { toast } from "react-hot-toast"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { hasPermission } = usePermissions()

  const fetchMovies = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get("/movies")
      if (res.status) {
        const moviesData = res.data;
        setMovies(Array.isArray(moviesData) ? moviesData : [])
      } else {
        if (Array.isArray(res)) setMovies(res)
        else if (Array.isArray(res.data)) setMovies(res.data)
      }
    } catch (error) {
      console.error("Failed to fetch movies", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const handleDelete = async (movieId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phim này không? Hành động này không thể hoàn tác.")) {
      return
    }
    
    try {
      const res = await apiClient.delete(`/movies/${movieId}`)
      if (res.status) {
        toast.success("Xóa phim thành công!")
        setMovies((prev) => prev.filter((m) => m.id !== movieId))
      } else {
        toast.error("Xóa phim thất bại, vui lòng thử lại.")
      }
    } catch (error: any) {
      console.error("Failed to delete movie", error)
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa phim.")
    }
  }

  const canCreate = hasPermission("movie:create")
  const canUpdate = hasPermission("movie:update")
  const canDelete = hasPermission("movie:delete")

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "posterUrl",
      header: "Poster",
      cell: ({ row }) => {
        const url = row.getValue("posterUrl") as string | null
        const title = row.getValue("title") as string
        return (
          <Avatar className="h-10 w-8 shadow-sm rounded-md">
            <AvatarImage src={url || ""} alt={title} className="object-cover" />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 text-xs font-semibold rounded-md">
              <Film className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Tên Phim",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "releaseDate",
      header: "Khởi Chiếu",
      cell: ({ row }) => {
        const dateStr = row.getValue("releaseDate") as string
        if (!dateStr) return <span>N/A</span>
        const date = new Date(dateStr)
        return <span>{date.toLocaleDateString("vi-VN")}</span>
      },
    },
    {
      accessorKey: "genre",
      header: "Thể Loại",
      cell: ({ row }) => <span className="truncate max-w-[150px] inline-block" title={row.getValue("genre") as string}>{row.getValue("genre") || "Chưa cập nhật"}</span>,
    },
    {
      accessorKey: "duration",
      header: "Thời Lượng",
      cell: ({ row }) => <span>{row.getValue("duration")} phút</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng Thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const isNowShowing = status === "NOW_SHOWING"
        const isComingSoon = status === "COMING_SOON"
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            isNowShowing 
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
              : isComingSoon
                ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}>
            {isNowShowing ? "Đang chiếu" : isComingSoon ? "Sắp chiếu" : "Đã kết thúc"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Hành Động</div>,
      cell: ({ row }) => {
        const movie = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            {canUpdate && (
              <Button 
                variant="outline" 
                size="icon" 
                asChild
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                title="Chỉnh sửa"
              >
                <Link href={`/movies/edit/${movie.id}`}>
                  <Pencil className="w-4 h-4" />
                </Link>
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete(movie.id)
                }}
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                title="Xóa phim"
              >
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Quản Lý Phim
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Danh sách các bộ phim đang được công chiếu
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canCreate && (
            <Link href="/movies/add">
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Phim Mới
              </Button>
            </Link>
          )}
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={movies} 
        searchKey="title"
        searchPlaceholder="Tìm kiếm phim theo tên..."
        isLoading={isLoading}
      />
    </div>
  )
}
