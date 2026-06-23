"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useS3Upload } from "@/hooks/useS3Upload"
import { ImagePlus, Video, Loader2, Film, Calendar } from "lucide-react"
import apiClient from "@/lib/axios"
import toast from "react-hot-toast"

interface MovieFormProps {
  movieId?: string
}

export function MovieForm({ movieId }: MovieFormProps = {}) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    cast: "",
    genre: "",
    duration: "",
    releaseDate: "",
    endDate: "",
    format: "2D",
    synopsis: "",
  })

  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [trailerFile, setTrailerFile] = useState<File | null>(null)
  
  const [posterUrl, setPosterUrl] = useState("")
  const [trailerUrl, setTrailerUrl] = useState("")
  const [trailerUploadProgress, setTrailerUploadProgress] = useState(0)

  const { uploadFile: uploadPoster, isUploading: isUploadingPoster, progress: posterProgress } = useS3Upload({ uploadType: "poster" })
  const { uploadFile: uploadTrailer, isUploading: isUploadingTrailer } = useS3Upload({ uploadType: "trailer" })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (movieId) {
      setIsSubmitting(true)
      apiClient.get(`/movies/${movieId}`)
        .then((res) => {
          let data = null
          if (res.status) {
            data = res.data;
          }
          
          if (data) {
            setFormData({
              title: data.title || "",
              director: data.director || "",
              cast: data.cast || "",
              genre: data.genre || "",
              duration: data.duration?.toString() || "",
              releaseDate: data.releaseDate ? data.releaseDate.split("T")[0] : "",
              endDate: data.endDate ? data.endDate.split("T")[0] : "",
              format: data.format || "2D",
              synopsis: data.synopsis || "",
            })
            setPosterUrl(data.posterUrl || "")
            setTrailerUrl(data.trailerUrl || "")
            setPosterFile(null)
            setTrailerFile(null)
            setFormData(prev => ({
              ...prev,
              existingPosterUrl: data.posterUrl,
              existingTrailerUrl: data.trailerUrl
            } as any))
          } else {
            setError("Không thể tải thông tin phim (Định dạng dữ liệu không hợp lệ)")
          }
        })
        .catch((err) => {
          console.error(err)
          setError("Không thể tải thông tin phim")
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }, [movieId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "poster" | "trailer") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "poster") {
        setPosterFile(file)
        setPosterUrl(URL.createObjectURL(file))
      } else {
        setTrailerFile(file)
        setTrailerUrl(URL.createObjectURL(file))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      let uploadedPosterUrl = (formData as any).existingPosterUrl
      let uploadedTrailerUrl = (formData as any).existingTrailerUrl

      if (posterFile) {
        uploadedPosterUrl = await uploadPoster(posterFile)
      }
      
      if (trailerFile) {
        uploadedTrailerUrl = await uploadTrailer(trailerFile)
      }

      const payload: any = {
        ...formData,
        duration: parseInt(formData.duration) || 0,
      }

      if (uploadedPosterUrl) payload.posterUrl = uploadedPosterUrl
      if (uploadedTrailerUrl) payload.trailerUrl = uploadedTrailerUrl
      
      if (payload.releaseDate) {
        payload.releaseDate = new Date(payload.releaseDate).toISOString()
      }
      
      if (payload.endDate) {
        payload.endDate = new Date(payload.endDate).toISOString()
      } else {
        delete payload.endDate
      }
      
      if (!payload.director) delete payload.director
      if (!payload.cast) delete payload.cast
      if (!payload.genre) delete payload.genre
      if (!payload.synopsis) delete payload.synopsis
      delete payload.existingPosterUrl
      delete payload.existingTrailerUrl

      let res;
      if (movieId) {
        res = await apiClient.patch(`/movies/${movieId}`, payload)
        toast.success("Cập nhật phim thành công!")
      } else {
        res = await apiClient.post("/movies", payload)
        toast.success("Thêm phim thành công!")
      }
      console.log("Movie Saved:", res.data)

      router.push("/movies")
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Đã xảy ra lỗi khi lưu phim"
      setError(errorMsg)
      toast.error(typeof errorMsg === 'string' ? errorMsg : errorMsg[0] || "Lưu phim thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:gap-8 max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 w-full">
        {/* Cột trái: Thông tin chính */}
        <div className="flex-1 space-y-6 lg:space-y-8">
        
        {/* Card: Thông tin cơ bản */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Thông tin cơ bản</h2>
          </div>
          
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên Phim <span className="text-rose-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tên phim..."
                required
                className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="synopsis" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tóm tắt nội dung</Label>
              <Textarea
                id="synopsis"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                placeholder="Viết một đoạn tóm tắt ngắn về bộ phim..."
                className="min-h-[140px] resize-y bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 text-base p-4 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="director" className="text-sm font-medium text-slate-700 dark:text-slate-300">Đạo Diễn</Label>
                <Input
                  id="director"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="VD: Christopher Nolan"
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cast" className="text-sm font-medium text-slate-700 dark:text-slate-300">Diễn Viên</Label>
                <Input
                  id="cast"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  placeholder="VD: Tom Holland, Zendaya..."
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="genre" className="text-sm font-medium text-slate-700 dark:text-slate-300">Thể Loại</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="VD: Hành động, Viễn tưởng, Phiêu lưu..."
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Chi tiết công chiếu */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Lịch trình & Định dạng</h2>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-slate-700 dark:text-slate-300">Thời lượng (Phút) <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="120"
                    required
                    className="pl-4 pr-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-medium text-sm">
                    Phút
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format" className="text-sm font-medium text-slate-700 dark:text-slate-300">Định dạng</Label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 font-medium transition-colors cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '1rem auto' }}
                >
                  <option value="2D">Phim 2D Tiêu Chuẩn</option>
                  <option value="3D">Phim 3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">Ngày khởi chiếu <span className="text-rose-500">*</span></Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">Ngày kết thúc (Dự kiến)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2 animate-in fade-in duration-300">
            <span className="flex w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {error}
          </div>
        )}
      </div>

      {/* Cột phải: Media & Actions */}
      <div className="w-full xl:w-[380px] space-y-6 flex-shrink-0">
        


        {/* Card: Media - Poster */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Ảnh Poster</h2>
          </div>
          
          <div className="p-5">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500 transition-colors duration-200 min-h-[360px]">
              {posterUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={posterUrl} alt="Poster Preview" className="max-h-[340px] w-auto object-contain rounded-lg shadow-sm" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                      Thay đổi ảnh
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kéo thả hoặc nhấn để tải lên</span>
                  <span className="text-xs text-slate-500 mt-2">Định dạng khuyên dùng: 2:3 (Dọc)<br/>Hỗ trợ: JPG, PNG, WEBP (Max: 5MB)</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "poster")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            {isUploadingPoster && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${posterProgress}%` }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Card: Media - Trailer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Video Trailer</h2>
          </div>
          
          <div className="p-5">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500 transition-colors duration-200 min-h-[200px]">
              {trailerFile ? (
                <div className="py-8 flex flex-col items-center text-slate-800 dark:text-slate-200 z-10 relative w-full px-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                    <Video className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <span className="text-sm font-semibold line-clamp-2 text-center break-all">{trailerFile.name}</span>
                  <span className="text-xs text-slate-500 mt-1 mb-4 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Sẵn sàng tải lên</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("trailer-upload")?.click()} className="h-8">
                    Đổi video khác
                  </Button>
                </div>
              ) : trailerUrl ? (
                <div className="relative w-full flex flex-col items-center justify-center z-10">
                  <video src={trailerUrl} controls className="w-full aspect-video object-cover rounded-lg bg-black/5 dark:bg-black/40 mb-3 shadow-inner" />
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("trailer-upload")?.click()} className="h-8 w-full">
                    Đổi video khác
                  </Button>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center text-center px-4 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tải lên Trailer</span>
                  <span className="text-xs text-slate-500 mt-1">MP4, WEBM (Max: 50MB)</span>
                </div>
              )}
              <input
                id="trailer-upload"
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "trailer")}
                className={trailerFile || trailerUrl ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"}
              />
            </div>
            {isUploadingTrailer && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${trailerUploadProgress}%` }}></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-slate-200 dark:border-slate-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push("/movies")} 
          className="h-11 px-8 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Hủy Bỏ
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isUploadingPoster || isUploadingTrailer}
          className="h-11 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-600/20 font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang lưu dữ liệu...
            </>
          ) : (
            movieId ? "Lưu Thay Đổi" : "Xuất Bản Phim"
          )}
        </Button>
      </div>
    </form>
  )
}
