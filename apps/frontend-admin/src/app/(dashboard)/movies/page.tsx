"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Film, Loader2, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"
import apiClient from "@/lib/axios"
import { toast } from "react-hot-toast"

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [permissions, setPermissions] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const userInfo = Cookies.get("user_info")
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo)
          if (user && Array.isArray(user.permissions)) {
            return user.permissions
          }
        } catch (e) {
          console.error("Failed to parse user cookie", e)
        }
      }
    }
    return []
  })

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        const res = await apiClient.get("/movies")
        if (res.status === 200) {
          const moviesData = Array.isArray(res.data?.data) ? res.data.data : res.data
          setMovies(Array.isArray(moviesData) ? moviesData : [])
        }
      } catch (error) {
        console.error("Failed to fetch movies", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const handleDelete = async (movieId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phim này không? Hành động này không thể hoàn tác.")) {
      return
    }
    
    try {
      const res = await apiClient.delete(`/movies/${movieId}`)
      if (res.status === 200 || res.status === 204 || res.status === 201) {
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

  const filteredMovies = movies.filter((movie) => 
    movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const canCreate = permissions.includes("movie:create")
  const canUpdate = permissions.includes("movie:update")
  const canDelete = permissions.includes("movie:delete")

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản Lý Phim</h1>
          <p className="text-slate-500 dark:text-slate-400">Danh sách các bộ phim đang được công chiếu</p>
        </div>
        <div className="min-h-[40px] flex items-center">
          {canCreate && (
            <Link href="/movies/add">
              <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Phim Mới
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Tìm kiếm phim theo tên..." 
            className="pl-9 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative aspect-[2/3] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse mt-1"></div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Film className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Chưa có bộ phim nào</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Bắt đầu bằng cách thêm một bộ phim mới vào hệ thống của bạn để hiển thị trên ứng dụng của khách hàng.
          </p>
          {canCreate && (
            <Link href="/movies/add">
              <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Phim Đầu Tiên
              </Button>
            </Link>
          )}
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <Search className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Không tìm thấy phim nào</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Không có phim nào khớp với từ khóa "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[2/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm">
                  {movie.status === "NOW_SHOWING" ? "Đang chiếu" : movie.status === "COMING_SOON" ? "Sắp chiếu" : "Đã kết thúc"}
                </div>
                {movie.format && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded">
                    {movie.format}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  {canUpdate && (
                    <Link href={`/movies/edit/${movie.id}`} className="w-3/4">
                      <Button variant="outline" className="w-full bg-white/90 hover:bg-white text-slate-900 font-medium border-0">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    </Link>
                  )}
                  {canDelete && (
                    <Button 
                      variant="default" 
                      className="w-3/4 font-medium bg-red-600/90 hover:bg-red-600"
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(movie.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa phim
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1" title={movie.title}>
                  {movie.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="truncate pr-2">{movie.genre || "Chưa cập nhật"}</span>
                  <span className="font-medium whitespace-nowrap">{movie.duration} phút</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
