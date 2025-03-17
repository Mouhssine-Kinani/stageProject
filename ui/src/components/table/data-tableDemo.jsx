"use client";

// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import {useState} from "react";
import { Input } from "@/components/ui/input"
import { AddUserDialog } from "@/app/(app)/users/dialogs/AddUserDialog";
import { PaginationDemo } from "@/components/pagination/paginationDemo";
import SearchBar from "@/components/serchBar/Search";

export function DataTable({ columns, data, currentPage, setCurrentPage, totalPages }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on search query
  const filteredData = data?.filter(
    (item) => {
      const searchFields = ['fullName', 'email']; // Add more fields as needed
      return searchFields.some(field => {
        const value = item[field];
        return value && value.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
  ) || [];

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

  return (
    <div>
      {/* Search bar */}
      {/* <SearchBar onSearch={setSearchQuery} /> */}
      
      <div className="border mt-4">
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

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <PaginationDemo
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
      <AddUserDialog />
    </div>
  );
}
