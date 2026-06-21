"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserCircle, Bell, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileDialog } from "./ProfileDialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import apiClient from "@/lib/axios"

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userInfoCookie = Cookies.get("user_info")
    if (userInfoCookie) {
      try {
        setUser(JSON.parse(userInfoCookie))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout")
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error("Logout error:", error)
      }
    } finally {
      Cookies.remove("access_token")
      Cookies.remove("refresh_token")
      Cookies.remove("user_info")
      router.push("/login")
      setIsDropdownOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl tracking-tight text-red-600 dark:text-red-500 hidden sm:block">
            Cinema Chain
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 rounded-full"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-slate-100 text-slate-500">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 dark:ring-slate-800 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3">
                  <p className="text-sm">Đăng nhập với tên</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user?.fullName || "Admin"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    className="group flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsProfileOpen(true)
                    }}
                  >
                    <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400" />
                    Hồ sơ (Profile)
                  </button>
                  <button
                    className="group flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400" />
                    Settings
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="group flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ProfileDialog 
        isOpen={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
        user={user} 
        onProfileUpdated={() => {
          const userInfoCookie = Cookies.get("user_info")
          if (userInfoCookie) {
            try {
              setUser(JSON.parse(userInfoCookie))
            } catch (e) {}
          }
        }}
      />
    </header>
  )
}
