"use client"
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SquarePen, Image, Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BaseDialog } from "@/components/popup/BaseDialog"
import { object, string } from 'yup'
import { useCrud } from "@/hooks/useCrud"

// Yup validation schema
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

export function DataTable() {
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const usersPerPage = 2
    const [formData, setFormData] = useState({
        fullName: 'test test',
        email: 'example@email.com',
        phone: '0603039131',
        status: 'active',
        roleName: 'User',
        logo: null
      })
    
    // const addUser = (newUser) => {
    //   // Add new user at the beginning with the highest ID
    //   const newId = Math.max(...users.map(user => user.id), 0) + 1
    //   setUsers([{ ...newUser, id: newId }, ...users])
    //   setIsDialogOpen(false)
    //   // Move to the first page when a new user is added
    //   setCurrentPage(1)
    // }

    const {data, createItem} = useCrud("users")

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

    const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        const validation = validateFile(file)
        if (!validation.isValid) {
        setErrors(prev => ({ ...prev, logo: validation.error }))
        return
        }
        
        setSelectedFile(file)
        setFormDataData(prev => ({ ...prev, logo: file }))
        setErrors(prev => ({ ...prev, logo: undefined }))
    }
    }
    function handleChange(e){
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }
    
    const handleSelectChange = (value, field) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        
        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: undefined }))
        }
      }

    const handleSubmit = async (e) => {
    try {
        e.preventDefault()
        await userSchema.validate(formData, { abortEarly: false })
        
        const submitData = {
        ...formData, 
        role: {roleName: formData.roleName}
        }
        delete submitData.roleName
        
        const result = await createItem(submitData)
        
        if (result.success) {
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
  
    return (
      <div className="w-full">
        {/* <div className=" mb-4">
          <Button onClick={() => setIsDialogOpen(true)}>Add User</Button>
        </div> */}
        
        <Dialog open={open} setOpen={setOpen}>
        <DialogTrigger>
            {/* <Button>Add User</Button> */}
            <Plus className="h-4 w-4"  onClick={()=> setOpen(true)}/>
        </DialogTrigger >
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            {/* <formData onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input type="email" name='email' onChange={handleChange} className="border" value={formData.email} />
                <Button type="submit">add user</Button>
            </formData> */}
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6 py-4">
                {/* Left column - Main formData fields */}
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
                    <div className="mt-4 mb-4 bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <p className="text-sm font-medium">{errors.submit}</p>
                    </div>
                    )}
                </div>
                </div>
            </div>
            <DialogFooter>
                <Button className="bg-gray-100 text-black hover:bg-gray-200 px-6"  onClick={handleCancel}>Cancel</Button>
                <Button type="submit">Add User</Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Name</TableHead> */}
                <TableHead>Email</TableHead>
                {/* <TableHead>Role</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  {/* <TableCell>{user.name}</TableCell> */}
                  <TableCell>{user.email}</TableCell>
                  {/* <TableCell>{user.role}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        {/* <div className="py-4 flex items-center justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(prev => Math.max(1, prev - 1))
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
  
              {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
  
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div> */}
  
        {/* <AddUserDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={addUser}
        /> */}
      </div>
  )
}

// export function DataTable() {
//   const [users, setUsers] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const usersPerPage = 2

//   // Example initial data - in a real app, this would come from an API
//   useEffect(() => {
//     setUsers([
//       { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User" },
//       { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
//       { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
//       { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
//     ])
//   }, [])

//   const addUser = (newUser) => {
//     // Add new user at the beginning with the highest ID
//     const newId = Math.max(...users.map(user => user.id), 0) + 1
//     setUsers([{ ...newUser, id: newId }, ...users])
//     setIsDialogOpen(false)
//     // Move to the first page when a new user is added
//     setCurrentPage(1)
//   }

//   // Pagination logic
//   const totalPages = Math.ceil(users.length / usersPerPage)
//   const startIndex = (currentPage - 1) * usersPerPage
//   const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage)

//   return (
//     <div className="w-full">
//       <div className=" mb-4">
//         <Button onClick={() => setIsDialogOpen(true)}>Add User</Button>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Role</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedUsers.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell>{user.name}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.role}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="py-4 flex items-center justify-end">
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious 
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   setCurrentPage(prev => Math.max(1, prev - 1))
//                 }}
//                 aria-disabled={currentPage === 1}
//                 className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//               />
//             </PaginationItem>

//             {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
//               <PaginationItem key={page}>
//                 <PaginationLink
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     setCurrentPage(page)
//                   }}
//                   isActive={currentPage === page}
//                 >
//                   {page}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   setCurrentPage(prev => Math.min(totalPages, prev + 1))
//                 }}
//                 aria-disabled={currentPage === totalPages}
//                 className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>

//       <AddUserDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onSubmit={addUser}
//       />
//     </div>
//   )
// } 