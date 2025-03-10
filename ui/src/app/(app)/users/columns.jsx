"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/table/data-table";
import {useMemo} from "react";

// Define columns outside the component to prevent recreation on each render
const getColumns = (onDelete) => [
  {
    accessorKey: "user_reference",
    header: "Reference",
    cell: ({ row }) => `#US0${row.original.user_reference}`,
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "role.roleName",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "lastLogin_date",
    header: "Last Login",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => onDelete(user._id)}
            >
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

export function UserTable({ data, onDelete }) {
  const columns = useMemo(
    () => getColumns(onDelete),
    [onDelete]
  );

  return <DataTable columns={columns} data={data} />;
}
