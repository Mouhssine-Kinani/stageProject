"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react';

export function AddUserDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: {
      roleName: "User"
    },
    status: "Active",
    user_reference: Math.floor(Math.random() * 1000), // This should be handled by backend
    lastLogin_date: "-",
    createdAt: new Date().toISOString()
  })

  const handleSelectChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // if (errors[field]) {
    //   setErrors(prev => ({ ...prev, [field]: undefined }))
    // }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    // setFormData({
    //   fullName: "",
    //   email: "",
    //   role: {
    //     roleName: "User"
    //   },
    //   status: "Active",
    //   user_reference: Math.floor(Math.random() * 1000),
    //   lastLogin_date: "-",
    //   createdAt: new Date().toISOString()
    // })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Plus className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, 'roleName')}
                value={formData.roleName}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, 'roleName')}
                value={formData.roleName}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 