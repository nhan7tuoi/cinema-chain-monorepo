import * as React from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-black px-4 sm:px-6 lg:px-8">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob dark:bg-red-900 dark:opacity-20 dark:mix-blend-screen" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000 dark:bg-red-800 dark:opacity-20 dark:mix-blend-screen" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000 dark:bg-rose-900 dark:opacity-20 dark:mix-blend-screen" />
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Content wrapper */}
      <div className="z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
