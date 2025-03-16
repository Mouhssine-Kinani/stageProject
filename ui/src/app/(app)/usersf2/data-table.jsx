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
import PaginationComponent from "./components/pagination"
import { useCrud } from "@/hooks/useCrud"
import AddUserDialog from "./components/add-user-dialog"


export function DataTable({columns}) {
    const [open, setOpen] = useState(false)
    
    const {data, setCurrentPage, currentPage, totalPages, fetchData} = useCrud("users")
    
    // Add a useEffect to fetch data when component mounts
    // useEffect(() => {
    //     fetchData()
    // }, [])
    
    // Create the table with the current data
    const table = useReactTable({
      data: data || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })
    
    const handleUserAdded = async () => {
        // Refresh data when a user is added
        await fetchData()
        setCurrentPage(1)
    }
  
    return (
      <div className="w-full">
        {/* <div className=" mb-4">
          <Button onClick={() => setIsDialogOpen(true)}>Add User</Button>
        </div> */}
        <AddUserDialog
          open={open}
          onOpenChange={setOpen}
          onUserAdded={handleUserAdded}
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