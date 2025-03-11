import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SquarePen, Image, Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { object, string } from 'yup'
import { BaseDialog } from "@/components/popup/BaseDialog"
import { useCrud } from "@/hooks/useCrud"

// Define Yup validation schema
const userSchema = object({
  fullName: string()
    .required('Full name is required')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must be less than 50 characters'),
  
  email: string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10-15 digits')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  
  status: string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'pending'], 'Invalid status'),
  
  roleName: string()
    .required('Role is required')
    .oneOf(['User', 'Admin', 'Super Admin'], 'Invalid role')
})

export function AddUserDialog() {
  const { createItem, validateFile } = useCrud("users")
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: '',
    roleName: '',
    logo: null
  })
  
  const [errors, setErrors] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }))
    }
  }
  
  const handleSelectChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validation = validateFile(file)
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, logo: validation.error }))
        return
      }
      
      setSelectedFile(file)
      setFormData(prev => ({ ...prev, logo: file }))
      setErrors(prev => ({ ...prev, logo: undefined }))
    }
  }
  
  const handleCancel = () => {
    setOpen(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      status: '',
      roleName: '',
      logo: null
    })
    setSelectedFile(null)
    setErrors({})
  }

  const handleSubmit = async () => {
    try {
      await userSchema.validate(formData, { abortEarly: false })
      
      const submitData = {
        ...formData, 
        role: {roleName: formData.roleName}
      }
      delete submitData.roleName
      
      const result = await createItem(submitData)
      
      if (result.success) {
        setOpen(false)
        handleCancel()
      } else {
        setErrors(prev => ({ ...prev, submit: result.error }))
      }
      
    } catch (error) {
      if(error.inner) {
        const newErrors = {}
        error.inner.forEach(err => {
          newErrors[err.path] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const formContent = (
    <>
      <div className="flex flex-col md:flex-row gap-6 py-4">
        {/* Left column - Main form fields */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input 
                id="fullName" 
                placeholder="John Doe" 
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input 
                id="phone" 
                placeholder="212 661651425" 
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 w-full">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, 'status')}
                value={formData.status}
              >
                <SelectTrigger id="status" className={errors.status ? "border-red-500 w-full" : "w-full"}>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Email and role */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john.doe@example.com" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 w-full">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, 'roleName')}
                value={formData.roleName}
              >
                <SelectTrigger id="roleName" className={errors.roleName ? "border-red-500 w-full" : "w-full"}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.roleName && (
                <p className="text-xs text-red-500">{errors.roleName}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo section */}
      <div className="space-y-2 mt-6">
        <Label htmlFor="logo">Profile picture</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-slate-100 flex items-center justify-center rounded-full border">
            {selectedFile ? (
              <img 
                src={URL.createObjectURL(selectedFile)}
                alt="Preview" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Image size={30} />
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <label htmlFor="logoInput">
              <Button variant="outline" className="w-40" type="button" onClick={() => document.getElementById('logoInput').click()}>
                Choose a file
              </Button>
              <input
                type="file"
                id="logoInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">Please choose a square image, less than 100Kb</p>
            <p className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : "No file"}
            </p>
            {errors.logo && (
              <p className="text-xs text-red-500">{errors.logo}</p>
            )}
            {errors.submit && (
              <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <p className="text-sm font-medium">{errors.submit}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={setOpen}
      title="Add User"
      icon={SquarePen}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      triggerButton={
        <Button className="flex bg-transparent items-center gap-2">
          <Plus color="gray"/>
        </Button>
      }
    >
      {formContent}
    </BaseDialog>
  )
} 