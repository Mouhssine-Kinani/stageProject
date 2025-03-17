"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "lucide-react";

// Define columns outside the component to prevent recreation on each render
const getColumns = (onDelete) => [
  {
    accessorKey: "product_reference",
    header: "Reference",
    cell: ({ row }) => `#DP0${row.original.product_reference}`,
  },
  {
    accessorKey: "productName",
    header: "product Name",
  },
  {
    accessorKey: "category",
    header: "category",
  },
  {
    accessorKey: "billing_cycle",
    header: "Billing cycle",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <p>
            {row.original.billing_cycle
              ? `${row.original.billing_cycle}`
              : "0.00"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "provider.logo",
    header: "Provider",
    cell: ({ row }) => {
      const providers = row.original.provider;

      if (Array.isArray(providers) && providers.length > 0) {
        return (
          <img
            src={providers[0].logo} // Affiche le logo du premier provider
            alt="Provider Logo"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
        );
      }

      return "No Logo";
    },
  },
  {
    accessorKey: "price",
    header: "Renewal Price",
    cell: ({ row }) =>
      row.original.price ? `${row.original.price} MAD` : "N/A",
  },
  {
    accessorKey: "productAddedDate",
    header: "Product added",
  },
  {
    accessorKey: "type",
    header: "Type",
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

export function ProductTable({ data, onDelete }) {
  const columns = useMemo(() => getColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} />;
}
