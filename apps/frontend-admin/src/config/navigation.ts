import {
  LayoutDashboard,
  Users,
  Film,
  MapPin,
  CalendarDays,
  Ticket,
  Settings,
  ShieldAlert,
} from "lucide-react"
import { ROUTE_PERMISSIONS } from "./roles"

export interface NavItem {
  title: string
  href?: string
  icon: any
  permissions: string[]
  subItems?: {
    title: string
    href: string
    icon?: any
    permissions: string[]
  }[]
}


const getPermissionsForPath = (path: string) => {
  const route = ROUTE_PERMISSIONS.find(r => r.path === path)
  return route ? route.permissions : []
}

export const NAVIGATION_CONFIG: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permissions: getPermissionsForPath("/dashboard"),
  },
  {
    title: "Movies",
    href: "/movies",
    icon: Film,
    permissions: getPermissionsForPath("/movies"),
  },
  {
    title: "Cinemas",
    href: "/cinemas",
    icon: MapPin,
    permissions: getPermissionsForPath("/cinemas"),
  },
  {
    title: "Showtimes",
    href: "/showtimes",
    icon: CalendarDays,
    permissions: getPermissionsForPath("/showtimes"),
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: Ticket,
    permissions: getPermissionsForPath("/bookings"),
  },
  {
    title: "Users",
    icon: Users,
    permissions: getPermissionsForPath("/users"),
    subItems: [
      {
        title: "Nhân viên",
        href: "/users/employees",
        icon: Users,
        permissions: getPermissionsForPath("/users/employees"),
      },
      {
        title: "Khách hàng",
        href: "/users/customers",
        icon: Users,
        permissions: getPermissionsForPath("/users/customers"),
      }
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    permissions: getPermissionsForPath("/settings"),
    subItems: [
      {
        title: "Phân quyền",
        href: "/settings/roles",
        icon: ShieldAlert,
        permissions: getPermissionsForPath("/settings"),
      }
    ]
  }
]
