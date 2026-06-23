"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, ShieldCheck } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import toast from "react-hot-toast"

import apiClient from "@/lib/axios"
import { EmployeeModal } from "./components/employee-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EmployeesPage() {
  const { hasPermission } = usePermissions()
  const [data, setData] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize:3 })
  const [pageCount, setPageCount] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get(`/employees?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
      if (res.status === true) {
        const transformed = res.data.map((emp: any) => ({
          id: emp.id,
          code: emp.code,
          avatarUrl: emp.avatarUrl || null,
          fullName: emp.fullName,
          email: emp.user?.email || "N/A",
          phone: emp.user?.phone || "N/A",
          role: emp.role?.name || "Chưa cấp quyền",
          roleId: emp.roleId,
          branch: emp.branch?.name || "Chưa phân bổ",
          branchId: emp.branchId,
          status: emp.user?.status === 'ACTIVE' ? "Hoạt động" : emp.user?.status === 'LOCKED' ? "Khóa" : "Đã Ẩn",
        }))
        setData(transformed)
        setPageCount(res.meta?.pageCount || 0)
        setTotalItems(res.meta?.itemCount || 0)
      }
    } catch (error) {
      console.error("Failed to fetch employees", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchRolesAndBranches = async () => {
      try {
        const [rolesRes, branchesRes] = await Promise.all([
          apiClient.get("/roles"),
          apiClient.get("/branches")
        ])
        if (rolesRes.status === true) {
          setRoles(rolesRes.data)
        }
        if (branchesRes.status === true) {
          setBranches(branchesRes.data)
        }
      } catch (error) {
        console.error("Failed to fetch roles/branches", error)
      }
    }

    fetchRolesAndBranches()
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [pagination.pageIndex, pagination.pageSize])

  const canCreate = hasPermission("employee:create")
  const canUpdate = hasPermission("employee:update")
  const canDelete = hasPermission("employee:delete")

  const handleSave = async (formData: any) => {
    try {
      if (selectedEmployee) {
        await apiClient.put(`/employees/${selectedEmployee.id}`, formData)
        toast.success("Cập nhật nhân viên thành công!")
      } else {
        await apiClient.post("/employees", formData)
        toast.success("Thêm nhân viên thành công!")
      }
      setIsModalOpen(false)
      fetchEmployees() // Refresh table
    } catch (error: any) {
      console.error("Failed to save employee", error)
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi lưu nhân viên!"
      toast.error(typeof errorMsg === 'string' ? errorMsg : errorMsg[0] || "Có lỗi xảy ra!")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return
    try {
      await apiClient.delete(`/employees/${id}`)
      toast.success("Xóa nhân viên thành công!")
      fetchEmployees()
    } catch (error: any) {
      console.error("Failed to delete employee", error)
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi xóa nhân viên!"
      toast.error(typeof errorMsg === 'string' ? errorMsg : errorMsg[0] || "Có lỗi xảy ra!")
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "code",
      header: "Mã NV",
      cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("code")}</span>,
    },
    {
      accessorKey: "avatarUrl",
      header: "Avatar",
      cell: ({ row }) => {
        const url = row.getValue("avatarUrl") as string | null
        const name = row.getValue("fullName") as string
        return (
          <Avatar className="h-8 w-8 shadow-sm">
            <AvatarImage src={url || ""} alt={name} className="object-cover" />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 text-xs font-semibold">
              {name?.charAt(0)?.toUpperCase() || "NV"}
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      accessorKey: "fullName",
      header: "Họ Tên",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Vai Trò",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2.5 py-1 rounded-md w-max">
          <ShieldCheck className="w-3.5 h-3.5" />
          {row.getValue("role")}
        </div>
      ),
    },
    {
      accessorKey: "branch",
      header: "Chi Nhánh",
    },
    {
      accessorKey: "status",
      header: "Trạng Thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const isActive = status === "Hoạt động"
        const isLocked = status === "Khóa"
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
              : isLocked
                ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}>
            {status}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Hành Động</div>,
      cell: ({ row }) => {
        const employee = row.original
        return (
          <div className="flex justify-end gap-2">
            {canUpdate && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  setSelectedEmployee(employee)
                  setIsModalOpen(true)
                }}
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleDelete(employee.id)}
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Nhân Viên
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý danh sách nhân viên và quyền truy cập hệ thống.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canCreate && (
            <Button 
              onClick={() => {
                setSelectedEmployee(null)
                setIsModalOpen(true)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm Nhân Viên
            </Button>
          )}
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="fullName"
        searchPlaceholder="Tìm nhân viên theo tên..."
        manualPagination={true}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalItems={totalItems}
        isLoading={isLoading}
      />

      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        employee={selectedEmployee}
        roles={roles}
        branches={branches}
      />
    </div>
  )
}
