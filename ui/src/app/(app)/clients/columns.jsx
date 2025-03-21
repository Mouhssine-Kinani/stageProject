"use client";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CellContent from "@/components/table/CellContent";

export const columns = [
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
    accessorKey: "client_name",
    header: "Nom",
    cell: ({ row }) => {
      const value = row.getValue("client_name");
      return <CellContent value={value} type="text" />;
    },
  },
  {
    accessorKey: "client_email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue("client_email");
      return <CellContent value={value} type="text" />;
    },
  },
  {
    accessorKey: "client_phone",
    header: "Téléphone",
    cell: ({ row }) => {
      const value = row.getValue("client_phone");
      return <CellContent value={value} type="text" />;
    },
  },
  {
    accessorKey: "client_address",
    header: "Adresse",
    cell: ({ row }) => {
      const value = row.getValue("client_address");
      return <CellContent value={value} type="text" />;
    },
  },
  {
    accessorKey: "products_count",
    header: "Produits",
    cell: ({ row }) => {
      const value = row.getValue("products_count");
      return <CellContent value={value} type="number" />;
    },
  },
  {
    accessorKey: "total_value",
    header: "Valeur Totale",
    cell: ({ row }) => {
      const value = row.getValue("total_value");
      return <CellContent value={value} type="currency" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      const viewClient = () => {
        window.location.href = `/clients/${client.id}`;
      };

      const editClient = (e) => {
        e.stopPropagation();
        // Dispatch l'événement pour ouvrir la modale d'édition
        const event = new CustomEvent("editClient", {
          detail: client,
        });
        window.dispatchEvent(event);
      };

      const deleteClient = (e) => {
        e.stopPropagation();
        // Dispatch l'événement pour ouvrir la modale de suppression
        const event = new CustomEvent("deleteClient", {
          detail: client,
        });
        window.dispatchEvent(event);
      };

      return (
        <div className="flex justify-end gap-2 actions-cell">
          <Button
            variant="ghost"
            size="icon"
            onClick={viewClient}
            title="Voir les détails"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={editClient}
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={deleteClient}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default columns;
