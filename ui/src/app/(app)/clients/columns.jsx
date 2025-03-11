"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/table/data-table";
import { useMemo } from "react";

// Define columns outside the component to prevent recreation on each render
const getColumns = (onDelete) => [
  {
    accessorKey: "client_reference",
    header: "Reference",
    cell: ({ row }) => `#US0${row.original.client_reference}`,
  },
  {
    accessorKey: "logo",
    header: "Client",
  },
  {
    accessorKey: "name",
    header: "Client Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "products",
    header: "Number of products",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Box />
        <p> {row.original.products?.length || 0}</p>
      </div>
    ),
  },
  {
    accessorKey: "renewal_status",
    header: "Renewal Status",
    // cell:({getValue})=>{
    //     const 
    // }
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => `${row.original.totalPrice.toFixed(2)} $`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(product._id)}>
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ClientsTable({ data, onDelete }) {
  const columns = useMemo(() => getColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} />;
}
