"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react"
import apiClient from "@/lib/axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.post('/auth/login', { email, password })
      
      if (response.data?.status === 'success') {
        const { accessToken, refreshToken, user } = response.data

        if (accessToken) {
          // Save tokens and user info
          Cookies.set('access_token', accessToken, { expires: 1 }) // 1 day
          if (refreshToken) {
            Cookies.set('refresh_token', refreshToken, { expires: 7 }) // 7 days
          }
          Cookies.set('user_info', JSON.stringify(user), { expires: 1 })
          
          // Navigate to dashboard
          router.push("/dashboard")
        }
      } else {
        setError(response.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative group">
      {/* Glow Effect Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
      
      <div className="relative bg-white/80 dark:bg-black/60 backdrop-blur-xl ring-1 ring-slate-900/5 dark:ring-red-900/30 rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 mb-4 shadow-inner shadow-red-900/50">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to your administrator account
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                id="email"
                placeholder="admin@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
                className="pl-10 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-red-600 hover:text-red-500 dark:text-red-500 font-medium transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                required
                className="pl-10 h-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            className="w-full h-11 group/btn" 
            variant="premium"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            )}
            Sign In
            {!isLoading && (
              <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
