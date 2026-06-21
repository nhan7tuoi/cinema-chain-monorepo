"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useS3Upload } from "@/hooks/useS3Upload"
import { ImagePlus, Video, Loader2 } from "lucide-react"
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
          const data = res.data?.data || res.data
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 sm:p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Section */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tên Phim</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tên phim"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="director">Đạo Diễn</Label>
              <Input
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                placeholder="Nhập tên đạo diễn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cast">Diễn Viên</Label>
              <Input
                id="cast"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                placeholder="Ví dụ: Tom Holland, Zendaya..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Thể Loại</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Hành động, Viễn tưởng..."
              />
            </div>
          </div>
        </div>

        {/* Screening Details Section */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Chi tiết công chiếu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Thời lượng (Phút)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={handleChange}
                placeholder="120"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Định dạng</Label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-red-500 transition-colors"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Ngày khởi chiếu</Label>
              <Input
                id="releaseDate"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Synopsis Section */}
        <div className="space-y-2">
          <Label htmlFor="synopsis">Tóm tắt nội dung</Label>
          <Textarea
            id="synopsis"
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            placeholder="Viết một đoạn tóm tắt ngắn về bộ phim..."
            className="min-h-[120px]"
          />
        </div>

        {/* Media Section */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Media (Poster & Trailer)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Poster Upload */}
            <div className="space-y-3">
              <Label>Poster Phim</Label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-red-500 transition-colors duration-200">
                {posterUrl ? (
                  <div className="relative w-full h-64 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={posterUrl} alt="Poster Preview" className="max-h-full object-contain rounded-md shadow-sm" />
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center text-slate-500">
                    <ImagePlus className="w-12 h-12 mb-3 text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-medium">Nhấn để chọn ảnh poster</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP lên đến 5MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "poster")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {isUploadingPoster && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                  <div className="bg-red-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${posterProgress}%` }}></div>
                </div>
              )}
            </div>

            {/* Trailer Upload */}
            <div className="space-y-3">
              <Label>Video Trailer</Label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-red-500 transition-colors duration-200">
                {trailerFile ? (
                  <div className="py-12 flex flex-col items-center text-slate-800 dark:text-slate-200 z-10 relative w-full">
                    <Video className="w-12 h-12 mb-3 text-red-500" />
                    <span className="text-sm font-medium line-clamp-1 px-4 text-center">{trailerFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1 mb-4">Sẵn sàng để tải lên</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("trailer-upload")?.click()}>
                      Đổi video khác
                    </Button>
                  </div>
                ) : trailerUrl ? (
                  <div className="relative w-full flex flex-col items-center justify-center z-10">
                    <video src={trailerUrl} controls className="w-full max-h-64 object-contain rounded-md shadow-sm bg-black/5 mb-4" />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("trailer-upload")?.click()}>
                      Đổi video khác
                    </Button>
                  </div>
                ) : (
                  <div className="py-24 flex flex-col items-center text-slate-500 pointer-events-none">
                    <Video className="w-12 h-12 mb-3 text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-medium">Nhấn để chọn video trailer</span>
                    <span className="text-xs text-slate-400 mt-1">MP4, WEBM lên đến 50MB</span>
                  </div>
                )}
                <input
                  id="trailer-upload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "trailer")}
                  className={trailerFile || trailerUrl ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                />
              </div>
              {isUploadingTrailer && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                  <div className="bg-red-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${trailerUploadProgress}%` }}></div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => router.push("/movies")}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploadingPoster || isUploadingTrailer}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              movieId ? "Cập nhật phim" : "Lưu phim"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
