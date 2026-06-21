export interface RoutePermissionConfig {
  path: string
  permissions: string[]
}

export const ROUTE_PERMISSIONS: RoutePermissionConfig[] = [
  { path: "/dashboard", permissions: ["dashboard:read"] },
  { path: "/movies", permissions: ["movie:read"] },
  { path: "/cinemas", permissions: ["branch:read"] },
  { path: "/showtimes", permissions: ["showtime:read"] },
  { path: "/bookings", permissions: ["ticket:read"] },
  { path: "/users", permissions: ["employee:read", "role:read", "customer:read"] },
  { path: "/users/employees", permissions: ["employee:read"] },
  { path: "/users/customers", permissions: ["customer:read"] },
  { path: "/settings", permissions: [] },
]
