"use client";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/table/base-data-table";
import CellContent from "@/components/table/CellContent";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";

/**
 * Composant de tableau pour l'affichage des clients
 *
 * @param {Object} props
 * @param {Array} props.data - Données des clients à afficher
 * @param {Function} props.onDelete - Fonction pour gérer la suppression
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 */
export function ClientsTable({ data = [], onDelete, isLoading = false }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      onDelete(clientToDelete._id);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  // Définir les colonnes du tableau directement ici, sans importer depuis un autre fichier
  const columns = useMemo(
    () => [
      {
        accessorKey: "client_reference",
        header: "ID",
        cell: ({ row }) => {
          const value = row.getValue("client_reference");
          return (
            <CellContent
              value={value ? `CL0${value}` : "—"}
              type="text"
              maxChars={8}
            />
          );
        },
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
        cell: ({ row }) => {
          const value = row.getValue("name");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          const value = row.getValue("email");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => {
          const products = row.original.products || [];
          return <CellContent value={products.length} type="number" />;
        },
      },
      {
        accessorKey: "totalPrice",
        header: "Total Value",
        cell: ({ row }) => {
          const value = row.original.totalPrice;
          return <CellContent value={value} type="currency" />;
        },
      },
      {
        accessorKey: "renewal_status",
        header: "Renewal Status",
        cell: ({ row }) => {
          const value = row.getValue("renewal_status");
          return <CellContent value={value} type="status" />;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const client = row.original;

          const viewClient = () => {
            router.push(`/clients/${client._id}`);
          };

          const editClient = (e) => {
            e.stopPropagation();
            // Dispatch l'événement pour ouvrir la modale d'édition
            console.log("Client data sent to edit dialog:", client);
            const event = new CustomEvent("editClient", {
              detail: client,
            });
            window.dispatchEvent(event);
          };

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
                <DropdownMenuItem onClick={() => handleDeleteClick(client)}>
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={editClient}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={viewClient}>
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onDelete, router]
  );

  console.log("Clients data in table:", data); // Debug data

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        maintainStructure={true} // Maintenir la même structure sur tous les appareils
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
