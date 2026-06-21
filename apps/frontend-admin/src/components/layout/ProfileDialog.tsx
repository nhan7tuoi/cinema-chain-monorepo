import * as React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCircle, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { useS3Upload } from "@/hooks/useS3Upload"
import apiClient from "@/lib/axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface ProfileDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onProfileUpdated: () => void
}

export function ProfileDialog({ isOpen, onOpenChange, user, onProfileUpdated }: ProfileDialogProps) {
  const [fullName, setFullName] = useState(user?.fullName || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(user?.avatarUrl || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { uploadFile, isUploading, progress } = useS3Upload({ uploadType: "avatar" })

  React.useEffect(() => {
    if (isOpen) {
      setFullName(user?.fullName || "")
      setPreviewUrl(user?.avatarUrl || "")
      setAvatarFile(null)
      setIsSuccess(false)
    }
  }, [isOpen, user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB")
        return
      }
      setAvatarFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      let finalAvatarUrl = user?.avatarUrl

      if (avatarFile) {
        finalAvatarUrl = await uploadFile(avatarFile)
      }

      await apiClient.patch("/users/me", {
        fullName,
        avatarUrl: finalAvatarUrl,
      })

      if (user) {
        const updatedUser = { ...user, fullName, avatarUrl: finalAvatarUrl }
        Cookies.set("user_info", JSON.stringify(updatedUser))
      }

      setIsSuccess(true)
      toast.success("Cập nhật hồ sơ thành công!")
      onProfileUpdated()
      
      setTimeout(() => {
        onOpenChange(false)
      }, 1000)

    } catch (error: any) {
      console.error("Failed to update profile", error)
      const errorMsg = error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!"
      toast.error(typeof errorMsg === 'string' ? errorMsg : errorMsg[0] || "Cập nhật thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tài khoản cá nhân</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân và ảnh đại diện của bạn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-24 w-24 ring-2 ring-slate-100 dark:ring-slate-800 transition-all group-hover:opacity-80">
                <AvatarImage src={previewUrl} className="object-cover" />
                <AvatarFallback className="bg-slate-100 text-slate-500 text-2xl">
                  {fullName ? fullName.charAt(0).toUpperCase() : <UserCircle className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp" 
              onChange={handleFileChange}
            />
            <div className="text-xs text-slate-500 text-center">
              Chấp nhận: JPG, PNG, WEBP.<br/>Tối đa 2MB.
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input 
              id="name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Nhập họ và tên..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={user?.email || ""} 
              disabled 
              className="bg-slate-50 dark:bg-slate-900/50"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isUploading}>
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải ảnh ({progress}%)...</>
            ) : isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
            ) : isSuccess ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Đã lưu</>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
