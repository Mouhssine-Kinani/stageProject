"use client";
import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddClientDialog from "./components/add-client-dialog";
import EditClientDialog from "./components/edit-client-dialog";

export function DataTable({ columns, data, isLoading }) {
  const [sorting, setSorting] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    // Handle edit event from columns
    const handleEditEvent = (event) => {
      if (event.detail) {
        setSelectedClient(event.detail);
        setEditDialogOpen(true);
      }
    };

    // Add event listener for edit events
    window.addEventListener("editClient", handleEditEvent);
    
    return () => {
      window.removeEventListener("editClient", handleEditEvent);
    };
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSorting([{ id: "name", desc: sortOrder === "asc" }]);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Button variant="outline" onClick={toggleSortOrder}>
          Sort by Name {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
        <Button onClick={() => setAddDialogOpen(true)}>
          Add Client
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      
      <AddClientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
      
      {selectedClient && (
        <EditClientDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          clientData={selectedClient}
        />
      )}
    </div>
  );
} 