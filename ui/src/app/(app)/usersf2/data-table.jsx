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
import AddUserDialog  from "@/app/(app)/usersf2/components/add-user-dialog";
import SearchBar from "@/components/serchBar/Search";


export function DataTable({columns}) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    
    const {data, setCurrentPage, currentPage, totalPages, fetchData} = useCrud("users")
    
    // Add a useEffect to fetch data when component mounts
    // useEffect(() => {
      //     fetchData()
      // }, [])
      // Handle user added event
      const handleUserAdded = async () => {
          // Refresh data when a user is added
          await fetchData()
          setCurrentPage(1)
      }
    // Filtrage des utilisateurs en fonction de la recherche
 const filteredData =
   data?.filter(
     (user) =>
       (user.name &&
         user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
       (user.email &&
         user.email.toLowerCase().includes(searchQuery.toLowerCase()))
     ) || [];
    // Create the table with the current data
    const table = useReactTable({
      data: filteredData || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })

    return (
      <div className="w-full">
         <SearchBar 
           onSearch={setSearchQuery} 
           open={open} 
           setOpen={setOpen} 
           handleUserAdded={handleUserAdded}
         >
           <AddUserDialog
             open={open}
             onOpenChange={setOpen}
             onUserAdded={handleUserAdded}
           />
         </SearchBar>
          <br />
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