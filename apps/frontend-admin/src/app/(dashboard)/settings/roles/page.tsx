"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Film,
  MapPin,
  CalendarDays,
  Ticket,
  Users,
  Shield,
  Settings,
  Check,
  Save,
  RotateCcw,
  Search,
  ShieldAlert,
  Loader2,
  FolderLock
} from "lucide-react"
import apiClient from "@/lib/axios"

// Types
interface Role {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
}

interface Permission {
  id: string
  name: string
  displayName: string
  module: string
  description: string | null
}

// Map Vietnamese/Dynamic module names to icons
const getModuleIcon = (moduleName: string) => {
  const name = moduleName.toLowerCase()
  if (name.includes("phim") || name.includes("movie")) return Film
  if (name.includes("chi nhánh") || name.includes("branch")) return MapPin
  if (name.includes("suất") || name.includes("showtime")) return CalendarDays
  if (name.includes("vé") || name.includes("booking") || name.includes("ticket")) return Ticket
  if (name.includes("nhân viên") || name.includes("user") || name.includes("employee")) return Users
  if (name.includes("quyền") || name.includes("role")) return Shield
  if (name.includes("dashboard") || name.includes("bảng")) return LayoutDashboard
  if (name.includes("hệ thống") || name.includes("system") || name.includes("setting")) return Settings
  return FolderLock
}

// Simple color assignment based on permission action
const getActionColor = (permName: string) => {
  const action = permName.split(":")[1]?.toLowerCase() || ""
  if (action === "read" || action === "view") return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30"
  if (action === "create" || action === "add") return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
  if (action === "update" || action === "edit") return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
  if (action === "delete" || action === "remove") return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30"
  return "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30"
}

export default function RolePermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({})
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedRolePermIds, setSelectedRolePermIds] = useState<string[]>([])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoadingRole, setIsLoadingRole] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingData(true)
      try {
        const [rolesRes, permsRes] = await Promise.all([
          apiClient.get<any>('/roles'),
          apiClient.get<any>('/roles/permissions')
        ])

        if (rolesRes.data?.status === 'success' && permsRes.data?.status === 'success') {
          const rolesData = rolesRes.data.data;
          const permsData = permsRes.data.data;
          
          setRoles(rolesData)
          setPermissions(permsData)

          // Group permissions by module
          const grouped = permsData.reduce((acc: any, perm: any) => {
            if (!acc[perm.module]) acc[perm.module] = []
            acc[perm.module].push(perm)
            return acc
          }, {} as Record<string, Permission[]>)
          
          setGroupedPermissions(grouped)

          // Select first role by default if available
          if (rolesData.length > 0) {
            handleSelectRole(rolesData[0])
          }
        }
      } catch (error) {
        console.error("Failed to load roles or permissions", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleSelectRole = async (role: Role) => {
    setSelectedRole(role)
    setIsLoadingRole(true)
    try {
      const res = await apiClient.get(`/roles/${role.id}`)
      if (res.data?.status === 'success') {
        const roleData = res.data.data
        
        // Extract permission IDs from the role's permissions
        const permIds = roleData.permissions.map((rp: any) => rp.permissionId)
        setSelectedRolePermIds(permIds)
      }
    } catch (error) {
      console.error("Failed to load role details", error)
      setSelectedRolePermIds([])
    } finally {
      setIsLoadingRole(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setSelectedRolePermIds(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleModuleAll = (moduleName: string) => {
    const modulePerms = groupedPermissions[moduleName] || []
    const modulePermIds = modulePerms.map(p => p.id)
    
    // Check if all permissions in this module are currently selected
    const isAllSelected = modulePermIds.every(id => selectedRolePermIds.includes(id))
    
    if (isAllSelected) {
      // Remove all module perms
      setSelectedRolePermIds(prev => prev.filter(id => !modulePermIds.includes(id)))
    } else {
      // Add all module perms
      setSelectedRolePermIds(prev => {
        const newSet = new Set([...prev, ...modulePermIds])
        return Array.from(newSet)
      })
    }
  }

  const handleSave = async () => {
    if (!selectedRole) return
    setIsSaving(true)
    try {
      await apiClient.put(`/roles/${selectedRole.id}/permissions`, {
        permissionIds: selectedRolePermIds
      })
      // Could show a success toast here
    } catch (error) {
      console.error("Failed to save permissions", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (selectedRole) {
      handleSelectRole(selectedRole) // Re-fetch to reset
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 animate-pulse">Đang tải dữ liệu vai trò và quyền...</p>
      </div>
    )
  }

  const filteredModules = Object.entries(groupedPermissions).filter(([moduleName]) => 
    moduleName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Phân Quyền Vai Trò
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý quyền hạn và truy cập cho các vai trò trong hệ thống.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
            onClick={handleReset}
            disabled={isLoadingRole || isSaving}
          >
            <RotateCcw className="w-4 h-4" />
            Khôi phục
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-all text-sm font-medium shadow-md shadow-indigo-600/20 dark:shadow-indigo-500/20 disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving || !selectedRole}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu Cấu Hình
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Sidebar - Roles */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-xl shadow-sm flex-1">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <ShieldAlert className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Danh Sách Vai Trò
            </h2>
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    selectedRole?.id === role.id
                      ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30 shadow-inner"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:bg-slate-800/30 dark:border-slate-800 dark:hover:border-indigo-500/30 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="font-medium flex items-center justify-between">
                    <span className={selectedRole?.id === role.id ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}>
                      {role.name}
                    </span>
                    {selectedRole?.id === role.id && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {role.code} {role.isSystem && "(Hệ thống)"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Permissions */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-xl shadow-sm flex-1 flex flex-col min-h-[500px] relative">
            
            {isLoadingRole && (
              <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Quyền Của {selectedRole?.name || "Vai Trò"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {selectedRole?.description || "Quản lý chi tiết quyền hạn cho vai trò này"}
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm module..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredModules.map(([moduleName, modulePerms]) => {
                  const ModuleIcon = getModuleIcon(moduleName)
                  const modulePermIds = modulePerms.map(p => p.id)
                  const isAllSelected = modulePermIds.every(id => selectedRolePermIds.includes(id))

                  return (
                    <div 
                      key={moduleName} 
                      className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <ModuleIcon className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{moduleName}</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer select-none group/switch">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover/switch:text-slate-800 dark:group-hover/switch:text-slate-200 transition-colors">
                            {isAllSelected ? "Tất cả" : "Chọn tất cả"}
                          </span>
                          <div 
                            className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                              isAllSelected ? "bg-indigo-500 dark:bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"
                            }`}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleModuleAll(moduleName)
                            }}
                          >
                            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                              isAllSelected ? "translate-x-5" : "translate-x-0"
                            }`} />
                          </div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {modulePerms.map(action => {
                          const isChecked = selectedRolePermIds.includes(action.id)
                          const actionColor = getActionColor(action.name)
                          
                          return (
                            <label 
                              key={action.id} 
                              className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                isChecked 
                                  ? actionColor 
                                  : "border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  checked={isChecked}
                                  onChange={() => togglePermission(action.id)}
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                  isChecked 
                                    ? "bg-current border-current text-white dark:text-white" 
                                    : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800 peer-hover:border-indigo-400 dark:peer-hover:border-indigo-500/50"
                                }`}>
                                  <Check className={`w-3 h-3 ${isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"} transition-all duration-200`} />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-sm font-medium ${isChecked ? "text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}`}>
                                  {action.displayName}
                                </span>
                                <span className={`text-[10px] mt-0.5 font-mono ${isChecked ? "opacity-70" : "text-slate-400 dark:text-slate-500"}`}>
                                  {action.name}
                                </span>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {filteredModules.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                    Không tìm thấy module nào khớp với "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.5); /* slate-600 with opacity */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(71, 85, 105, 0.8);
        }
      `}} />
    </div>
  )
}
