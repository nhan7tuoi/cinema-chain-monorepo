"use client"

import React, { use } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MovieForm } from "@/components/movies/MovieForm"

export default function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/movies" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa phim</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Cập nhật thông tin chi tiết của bộ phim</p>
        </div>
      </div>

      <MovieForm movieId={resolvedParams.id} />
    </div>
  )
}
