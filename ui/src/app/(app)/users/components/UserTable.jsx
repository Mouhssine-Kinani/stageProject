"use client";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/table/base-data-table";
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
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/**
 * Composant de tableau pour l'affichage des utilisateurs
 *
 * @param {Object} props
 * @param {Array} props.data - Données des utilisateurs à afficher
 * @param {Function} props.onDelete - Fonction pour gérer la suppression
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 */
export function UserTable({ data = [], onDelete, isLoading = false }) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Définir les colonnes du tableau
  const columns = useMemo(
    () => [
      {
        accessorKey: "user_reference",
        header: "Reference",
        cell: ({ row }) => `#US0${row.original.user_reference}`,
      },
      {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => {
          const { fullName, logo } = row.original;

          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`${
                  logo
                    ? `${process.env.NEXT_PUBLIC_URLAPI}/${logo}`
                    : "/user.png"
                }`}
                alt="User Logo"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginRight: 10,
                }}
              />
              <span>{fullName}</span>
            </div>
          );
        },
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

          const handleEdit = () => {
            if (typeof window !== "undefined" && window.dispatchEvent) {
              // Create a custom event with the user data
              const editEvent = new CustomEvent("editUser", { detail: user });
              window.dispatchEvent(editEvent);
            }
          };

          const handleDelete = () => {
            setUserToDelete(user);
            setDeleteDialogOpen(true);
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-500"
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onDelete]
  );

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete._id);
      toast({
        description: "Utilisateur supprimé avec succès",
        variant: "success",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

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
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
