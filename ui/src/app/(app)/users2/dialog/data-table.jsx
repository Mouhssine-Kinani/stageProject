"use client"
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
import { useCrud } from "@/hooks/useCrud"
// import { AddUserDialog } from "@/app/(app)/users/dialogs/AddUserDialog";
import { AddUserDialog } from "./add-user-dialog"


export function DataTable({ columns, data, currentPage, setCurrentPage, totalPages }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [users, setUsers] = useState([])
  // const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const usersPerPage = 2


  const table = useReactTable({
    data: data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
  });

  // Example initial data - in a real app, this would come from an API
  useEffect(() => {
    setUsers([
      { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
      { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
    ])
  }, [])

  const addUser = (newUser) => {
    // Add new user at the beginning with the highest ID
    const newId = Math.max(...users.map(user => user.id), 0) + 1
    setUsers([{ ...newUser, id: newId }, ...users])
    setIsDialogOpen(false)
    // Move to the first page when a new user is added
    setCurrentPage(1)
  }

  // Pagination logic
  // const totalPages = Math.ceil(users.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage)

  return (
    <div className="w-full">
      <div className=" mb-4">
        {/* <Button onClick={() => setIsDialogOpen(true)}>Add User</Button> */}
        {/* <AddUserDialog /> */}
        <AddUserDialog
      />
      </div>

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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
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

      <div className="py-4 flex items-center justify-end">
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
      </div>
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