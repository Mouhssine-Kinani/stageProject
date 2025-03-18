"use client";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { DataTable } from "@/components/table/base-data-table";
import { useMemo } from "react";

// Define columns outside the component to prevent recreation on each render
const getColumns = (onDelete) => [
  {
    accessorKey: "client_reference",
    header: "Reference",
    cell: ({ row }) => `#CL0${row.original.client_reference}`,
  },
  {
    accessorKey: "logo",
    header: "Client",
    cell: ({ row }) => (
      <img
        src={`${process.env.NEXT_PUBLIC_URLAPI}/${row.original.logo}`}
        alt="Client Logo"
        style={{ width: 30, height: 30, borderRadius: "50%" }}
      />
    ),
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
    header: "Products",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Box className="h-4 w-4 " />
        <p>{row.original.products?.length || 0}</p>
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <p>
          {row.original.totalPrice
            ? `${row.original.totalPrice.toFixed(2)}`
            : "0.00"}{" "}
          MAD
        </p>
      </div>
    ),
  },
  {
    accessorKey: "renewal_status",
    header: "Renewal Status",
    cell: ({ row }) => {
      const status = row.original.renewal_status;
      let statusClass = "px-2 py-1 rounded text-xs font-medium";

      if (status === "ok") {
        statusClass += " bg-green-100 text-green-800";
      } else if (status === "Overdue") {
        statusClass += " bg-red-100 text-red-800";
      } else if (status === "Expiring") {
        statusClass += " bg-yellow-100 text-yellow-800";
      }

      return <span className={statusClass}>{status}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

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
            <DropdownMenuItem 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this client?")) {
                  onDelete(client._id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Dispatch custom event for editing
                const event = new CustomEvent("editClient", {
                  detail: client,
                });
                window.dispatchEvent(event);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href={`/clients/${client._id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ClientsTable({ data, onDelete, isLoading }) {
  const columns = useMemo(() => getColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
