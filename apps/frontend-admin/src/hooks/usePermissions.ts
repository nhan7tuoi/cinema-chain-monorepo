import { useState } from "react"
import Cookies from "js-cookie"

export function usePermissions() {
  const [userInfo] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const userInfoStr = Cookies.get("user_info")
      if (userInfoStr) {
        try {
          return JSON.parse(userInfoStr)
        } catch (e) {
          console.error("Failed to parse user cookie", e)
        }
      }
    }
    return null
  })

  const permissions: string[] = (userInfo && Array.isArray(userInfo.permissions)) ? userInfo.permissions : []
  const userType: string | null = userInfo?.userType || null

  const hasPermission = (permission: string) => permissions.includes(permission)

  return { permissions, hasPermission, userType, user: userInfo }
}
