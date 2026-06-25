"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  MapPin, 
  CalendarDays,
  Ticket,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useSidebar } from "@/components/layout/sidebar-provider"
import { NAVIGATION_CONFIG, NavItem } from "@/config/navigation"
import { usePermissions } from "@/hooks/usePermissions"

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const { permissions: userPermissions, userType } = usePermissions()
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({})
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

  }, [])

  const filteredNavItems = React.useMemo(() => {
    if (!mounted) return NAVIGATION_CONFIG // Tránh hydration mismatch bằng cách render full menu hoặc rỗng trên server
    return NAVIGATION_CONFIG.filter((item) => {
      if (item.title === "Cinemas" && userType !== "ADMIN" && userType !== "SUPER_ADMIN") {
        return false
      }
      if (!item.permissions || item.permissions.length === 0) return true
      return item.permissions.some(permission => userPermissions.includes(permission))
    })
  }, [userPermissions, userType])

  const toggleMenu = (title: string) => {
    if (isCollapsed) return
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  React.useEffect(() => {
    if (isCollapsed) return
    const newExpanded = { ...expandedMenus }
    let changed = false
    filteredNavItems.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`))
        if (isActive && !newExpanded[item.title]) {
          newExpanded[item.title] = true
          changed = true
        }
      }
    })
    if (changed) {
      setExpandedMenus(newExpanded)
    }
  }, [pathname, filteredNavItems, isCollapsed])

  return (
    <aside 
      className={cn(
        "border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedMenus[item.title]
            const isSubItemActive = hasSubItems && item.subItems!.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`))
            const isActive = !hasSubItems && (pathname === item.href || pathname.startsWith(`${item.href}/`))
            
            const ItemContent = (
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full",
                  isActive || isSubItemActive
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                  isCollapsed ? "justify-center px-0" : ""
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", (isActive || isSubItemActive) ? "text-red-500" : "")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    {hasSubItems && (
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform duration-200", 
                          isExpanded ? "rotate-180" : ""
                        )} 
                      />
                    )}
                  </>
                )}
              </span>
            )

            return (
              <div key={item.title} className="flex flex-col">
                {hasSubItems ? (
                  <button 
                    onClick={() => toggleMenu(item.title)}
                    className="w-full text-left focus:outline-none"
                  >
                    {ItemContent}
                  </button>
                ) : (
                  <Link href={item.href || "#"}>
                    {ItemContent}
                  </Link>
                )}
                
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div className="mt-1 ml-4 flex flex-col gap-1">
                    {item.subItems!.map(subItem => {
                      if (subItem.permissions && subItem.permissions.length > 0) {
                        const hasPerm = subItem.permissions.some(p => userPermissions.includes(p))
                        if (!hasPerm) return null
                      }
                      
                      const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                      return (
                        <Link key={subItem.href} href={subItem.href}>
                          <span className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isSubActive
                              ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800/50"
                          )}>
                            {subItem.icon && <subItem.icon className="h-4 w-4 flex-shrink-0" />}
                            {subItem.title}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={useSidebar().toggleSidebar} 
          className={cn("w-full flex text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50", isCollapsed ? "justify-center" : "justify-end")}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  )
}
