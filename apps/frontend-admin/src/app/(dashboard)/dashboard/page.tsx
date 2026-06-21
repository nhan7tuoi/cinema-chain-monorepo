import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Admin",
  description: "Administrator Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="p-4 rounded-xl border bg-white shadow-sm dark:bg-black dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Welcome to the administrator dashboard. You have successfully logged in.
        </p>
      </div>
    </div>
  )
}
