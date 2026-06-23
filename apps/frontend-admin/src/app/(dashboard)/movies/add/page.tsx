import React from "react"
import { MovieForm } from "@/components/movies/MovieForm"
import { ChevronRight, Film, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Thêm Phim Mới - Admin Dashboard",
  description: "Thêm một bộ phim mới vào hệ thống.",
}

export default function AddMoviePage() {
  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/movies" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Thêm Phim Mới</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 pl-9">Điền thông tin chi tiết, tải lên poster và trailer để ra mắt một bộ phim mới.</p>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MovieForm />
      </div>
    </div>
  )
}
