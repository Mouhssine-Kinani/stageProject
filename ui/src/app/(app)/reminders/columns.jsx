"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, // Import the trigger component
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/table/base-data-table";
import { useMemo } from "react";

const getColumns = (onDelete) => [
  {
    accessorKey: "client_reference",
    header: "Client Reference",
    cell: ({ row }) => `#CL0${row.original.client_reference}`,
  },
  {
    accessorKey: "clientLogo",
    header: "Client Logo",
    cell: ({ row }) => {
      const logo = row.original.clientLogo;
      const imageUrl =
        logo && logo !== "/user.png"
          ? `${process.env.NEXT_PUBLIC_URLAPI}/${logo}`
          : "/user.png";

      return (
        <img
          src={imageUrl}
          alt="Client Logo"
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      );
    },
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "providerLogo",
    header: "Provider Logo",
    cell: ({ row }) => (
      <img
        src={row.original.providerLogo}
        alt="Provider Logo"
        style={{ width: "30px", height: "30px", borderRadius: "50%" }}
      />
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
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
      } else if (status === "Expiring soon" || status === "Expiring") {
        statusClass += " bg-yellow-100 text-yellow-800";
      }

      return <span className={statusClass}>{status}</span>;
    },
  },
  {
    accessorKey: "nextRenewalDate",
    header: "Next Renewal Date",
    cell: ({ row }) => {
      const date = new Date(row.original.nextRenewalDate);
      return (
        <span>
          {row.original.nextRenewalDate ? date.toLocaleDateString() : "N/A"}
        </span>
      );
    },
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
            <DropdownMenuItem
              onClick={() => {
                console.log("Deleting product:", product);
                onDelete(product._id);
              }}
            >
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function RemindersTable({ data, onDelete }) {
  const columns = useMemo(() => getColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} />;
}
