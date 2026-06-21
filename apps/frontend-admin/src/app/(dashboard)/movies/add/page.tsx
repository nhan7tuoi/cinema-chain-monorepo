import React from "react"
import { MovieForm } from "@/components/movies/MovieForm"
import { ChevronRight, Film } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Thêm Phim Mới - Admin Dashboard",
  description: "Thêm một bộ phim mới vào hệ thống.",
}

export default function AddMoviePage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/movies" className="hover:text-red-600 transition-colors flex items-center gap-1">
            <Film className="w-4 h-4" />
            <span>Phim</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-slate-800 dark:text-slate-200 font-medium">Thêm mới</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Thêm Phim Mới
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Điền thông tin chi tiết, tải lên poster và trailer để ra mắt một bộ phim mới.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MovieForm />
      </div>

    </div>
  )
}
