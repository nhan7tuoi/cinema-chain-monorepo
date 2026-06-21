import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Admin Dashboard",
  description: "Sign in to access the administrator dashboard.",
}

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  )
}
