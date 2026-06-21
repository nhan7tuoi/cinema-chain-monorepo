import { useState } from "react"
import apiClient from "@/lib/axios"

export type UploadType = "avatar" | "poster" | "trailer"

interface UseS3UploadOptions {
  uploadType: UploadType
  onUploadSuccess?: (fileUrl: string) => void
  onUploadError?: (error: Error) => void
}

export function useS3Upload({ uploadType, onUploadSuccess, onUploadError }: UseS3UploadOptions) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setIsUploading(true)
      setProgress(0)
      setError(null)

      const presignedRes = await apiClient.post(`/upload/presigned-url/${uploadType}`, {
        fileName: file.name,
        contentType: file.type,
      })
      
      const { url, fields, fileUrl } = presignedRes.data

      const formData = new FormData()
      Object.keys(fields).forEach((key) => {
        formData.append(key, fields[key])
      })
      formData.append("file", file)

      return await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setProgress(percentComplete)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100)
            setIsUploading(false)
            if (onUploadSuccess) onUploadSuccess(fileUrl)
            resolve(fileUrl)
          } else {
            const err = new Error(`S3 Upload failed with status: ${xhr.status} - ${xhr.responseText}`)
            setIsUploading(false)
            setError(err)
            if (onUploadError) onUploadError(err)
            reject(err)
          }
        }

        xhr.onerror = () => {
          const err = new Error("Network error occurred during S3 upload")
          setIsUploading(false)
          setError(err)
          if (onUploadError) onUploadError(err)
          reject(err)
        }

        xhr.open("POST", url, true)
        xhr.send(formData)
      })
    } catch (err) {
      setIsUploading(false)
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      if (onUploadError) onUploadError(errorObj)
      throw errorObj
    }
  }

  return {
    uploadFile,
    isUploading,
    progress,
    error,
  }
}
