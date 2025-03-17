"use client";

import { MoreHorizontal, Calendar } from "lucide-react";
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

// Fonction utilitaire pour convertir la chaîne billing_cycle en nombre de mois
const billingCycleToMonths = (billingCycle) => {
  switch (billingCycle) {
    case "monthly":
      return 1;
    case "yearly":
      return 12;
    case "biennial":
      return 24;
    default:
      return 0;
  }
};

const getColumns = (onDelete) => [
  {
    accessorKey: "product_reference",
    header: "Reference",
    cell: ({ row }) => `#PR0${row.original.product_reference}`,
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
    accessorKey: "products.provider.logo",
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
    accessorKey: "createdAt",
    header: "Date Deployed",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <p>
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "billing_cycle",
    header: "Billing Cycle",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <p>{row.original.billing_cycle || "N/A"}</p>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Renewal Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <p>
          {row.original.price
            ? `${row.original.price.toFixed(2)} MAD`
            : "0.00 MAD"}
        </p>
      </div>
    ),
  },
  {
    id: "renewalDate", // Calculé
    header: "Renewal Date",
    cell: ({ row }) => {
      const { createdAt, billing_cycle } = row.original;
      if (!createdAt || !billing_cycle) return "N/A";

      const monthsToAdd = billingCycleToMonths(billing_cycle);
      const renewalDate = new Date(createdAt);
      renewalDate.setMonth(renewalDate.getMonth() + monthsToAdd);
      // Soustraire un jour à la date de renouvellement
      renewalDate.setDate(renewalDate.getDate() - 1);

      return renewalDate.toLocaleDateString();
    },
  },
  {
    id: "renewalStatus", // Calculé
    header: "Renewal Status",
    cell: ({ row }) => {
      const { createdAt, billing_cycle } = row.original;
      if (!createdAt || !billing_cycle) return "N/A";

      const monthsToAdd = billingCycleToMonths(billing_cycle);
      const renewalDate = new Date(createdAt);
      renewalDate.setMonth(renewalDate.getMonth() + monthsToAdd);

      const today = new Date();
      const warningDate = new Date();
      warningDate.setDate(today.getDate() + 31); // Aujourd'hui + 31 jours

      let status = "Expired";
      let statusClass =
        "px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800";

      if (renewalDate > warningDate) {
        status = "OK";
        statusClass =
          "px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800";
      } else if (renewalDate > today && renewalDate <= warningDate) {
        status = "Expiring Soon";
        statusClass =
          "px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800";
      }

      return <span className={statusClass}>{status}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Ici row.original représente directement le produit
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
            <DropdownMenuItem onClick={() => onDelete(row.original._id)}>
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ClientTable({ data, onDelete }) {
  const columns = useMemo(() => getColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} />;
}
