import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Wand2 } from "lucide-react"

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  employee?: any
  roles: any[]
  branches: any[]
}

export function EmployeeModal({ isOpen, onClose, onSave, employee, roles, branches }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    code: "",
    password: "",
    roleId: "",
    branchId: "",
    status: "ACTIVE",
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        code: employee.code || "",
        password: "", // Don't show password on edit
        roleId: employee.roleId || "",
        branchId: employee.branchId || "",
        status: employee.status === "Hoạt động" ? "ACTIVE" : employee.status === "Khóa" ? "LOCKED" : "HIDDEN",
      })
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        code: "",
        password: "",
        roleId: "",
        branchId: "",
        status: "ACTIVE",
      })
    }
  }, [employee, isOpen])

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&*"
    let randomPassword = ""
    for (let i = 0; i < 8; i++) {
      randomPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password: randomPassword }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {employee ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {employee && (
              <div className="space-y-2">
                <Label htmlFor="code">Mã nhân viên</Label>
                <Input 
                  id="code" 
                  placeholder="Ví dụ: NV001" 
                  value={formData.code}
                  disabled
                  className="bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed"
                />
              </div>
            )}
            <div className={`space-y-2 ${!employee ? 'col-span-2' : ''}`}>
              <Label htmlFor="fullName">Họ tên</Label>
              <Input 
                id="fullName" 
                placeholder="Tên đầy đủ" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@cinema.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="0909123456" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          {!employee && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <button 
                  type="button"
                  onClick={generatePassword}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" />
                  Tạo ngẫu nhiên
                </button>
              </div>
              <Input 
                id="password" 
                type="text" 
                placeholder="Nhập hoặc tạo mật khẩu" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50 font-mono"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branchId">Chi nhánh</Label>
              <select 
                id="branchId"
                value={formData.branchId}
                onChange={e => setFormData({...formData, branchId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roleId">Vai trò</Label>
              <select 
                id="roleId"
                value={formData.roleId}
                onChange={e => setFormData({...formData, roleId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              >
                <option value="">-- Chọn vai trò --</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {employee && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="status">Trạng thái tài khoản</Label>
              <select 
                id="status"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              >
                <option value="ACTIVE">Hoạt động (Active)</option>
                <option value="LOCKED">Khóa (Locked)</option>
                <option value="HIDDEN">Đã ẩn (Hidden / Banned)</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <Button variant="outline" onClick={onClose} className="border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            Hủy
          </Button>
          <Button onClick={() => onSave(formData)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            {employee ? "Lưu Thay Đổi" : "Tạo Nhân Viên"}
          </Button>
        </div>
      </div>
    </div>
  )
}
