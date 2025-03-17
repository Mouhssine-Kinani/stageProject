"use client"

import { useState, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AddUserDialog } from "./add-user-dialog"
import { columns } from "../columns"

export function DataTable() {
  const [users, setUsers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    const newId = Math.max(...users.map(user => user.id), 0) + 1
    setUsers([{ ...newUser, id: newId }, ...users])
    setIsDialogOpen(false)
    table.setPageIndex(0)
  }

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 2,
      },
    },
  })

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Add User</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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
                  table.previousPage()
                }}
                aria-disabled={!table.getCanPreviousPage()}
                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from(
              { length: table.getPageCount() },
              (_, index) => index + 1
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    table.setPageIndex(page - 1)
                  }}
                  isActive={table.getState().pagination.pageIndex === page - 1}
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
                  table.nextPage()
                }}
                aria-disabled={!table.getCanNextPage()}
                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AddUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={addUser}
      />
    </div>
  )
} 