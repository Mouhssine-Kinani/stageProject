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
import { DataTable } from "@/components/table/data-table";
import { useMemo } from "react";

const getColumns = (onDelete) => [
  { accessorKey: "product_reference", header: "Ref" ,cell: ({ row }) => `#PR0${row.original.product_reference}`,},
  { accessorKey: "productName", header: "Product Name" },
  { accessorKey: "category", header: "Category" },
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
    accessorKey: "billing_cycle",
    header: "Billing Cycle",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <img
          src="/tableIcons/iconCalender.svg"
          alt="Calendar Icon"
          className="w-5 h-5"
        />
        <span className="font-medium">{getValue()}</span>
      </div>
    ),
  },
  { accessorKey: "price", header: "Renewal Price" },
  {
    accessorKey: "date_fin",
    header: "Renewal Status",
    cell: ({ getValue }) => {
      const dateFin = getValue() ? new Date(getValue()) : null;
      if (!dateFin) return <span className="text-green-500">OK</span>;

      const today = new Date();
      const diffInDays = Math.ceil((dateFin - today) / (1000 * 60 * 60 * 24));

      if (diffInDays < 0) return <span className="text-red-500">Expired</span>;
      if (diffInDays <= 31)
        return <span className="text-yellow-500">Expiring Soon</span>;
      return <span className="text-green-500">OK</span>;
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

export function ProductHomeTable({ data, onDelete }) {
  const columns = useMemo(() => getColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} />;
}
