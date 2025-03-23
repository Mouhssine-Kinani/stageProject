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

/**
 * Composant de tableau pour l'affichage des produits
 *
 * @param {Object} props
 * @param {Array} props.data - Données des produits à afficher
 * @param {Function} props.onDelete - Fonction pour gérer la suppression
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 */
export function ProductsTable({ data = [], onDelete, isLoading = false }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete._id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Définir les colonnes du tableau directement ici
  const columns = useMemo(
    () => [
      {
        accessorKey: "product_reference",
        header: "ID",
        cell: ({ row }) => {
          const value = row.getValue("product_reference");
          return (
            <CellContent
              value={value ? `PR0${value}` : "—"}
              type="text"
              maxChars={8}
            />
          );
        },
      },
      {
        accessorKey: "productName",
        header: "Product Name",
        cell: ({ row }) => {
          const value = row.getValue("productName");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const value = row.getValue("category");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "billing_cycle",
        header: "Billing Cycle",
        cell: ({ row }) => {
          const value = row.getValue("billing_cycle");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const value = row.getValue("price");
          return <CellContent value={value} type="currency" />;
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const value = row.getValue("type");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "provider",
        header: "Provider",
        cell: ({ row }) => {
          const provider = row.original.provider;
          if (provider && provider.name) {
            return <CellContent value={provider.name} type="text" />;
          }
          return <CellContent value="—" type="text" />;
        },
      },
      {
        accessorKey: "website",
        header: "Website",
        cell: ({ row }) => {
          const value = row.getValue("website");
          if (!value) return <CellContent value="—" type="text" />;

          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              <CellContent value={value} type="text" maxChars={20} />
            </a>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original;

          const viewProduct = () => {
            window.location.href = `/products/${product._id}`;
          };

          const editProduct = (e) => {
            e.stopPropagation();
            // Dispatch l'événement pour ouvrir la modale d'édition
            const event = new CustomEvent("editProduct", {
              detail: product,
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
                <DropdownMenuItem onClick={() => handleDeleteClick(product)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={editProduct}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={viewProduct}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onDelete]
  );

  console.log("Products data in table:", data); // Debug data

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
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
