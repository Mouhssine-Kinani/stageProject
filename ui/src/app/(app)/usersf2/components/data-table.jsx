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
import PaginationComponent from "./pagination"
// import { BaseDialog } from "@/components/popup/BaseDialog"
import { object, string } from 'yup'
import { useCrud } from "@/hooks/useCrud"
import AddUserDialog from "./add-user-dialog"

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

export function DataTable({columns}) {
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
    
    const {data, createItem, setCurrentPage, currentPage , totalPages} = useCrud("users")

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })

    const handleCancel = () => {
        setOpen(false)
        setErrors({})
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          status: '',
          roleName: '',
          logo: null
        })
        setSelectedFile(null)
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
        <AddUserDialog
          open={open}
          onOpenChange={setOpen}
        />
          <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
  )
}