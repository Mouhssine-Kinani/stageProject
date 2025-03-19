"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/table/base-data-table";
import CellContent from "@/components/table/CellContent";

/**
 * Composant de tableau pour l'affichage des produits sur la page d'accueil
 *
 * @param {Object} props
 * @param {Array} props.data - Données des produits à afficher
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 */
export function ProductHomeTable({ data = [], isLoading = false }) {
  // Définir les colonnes du tableau
  const columns = useMemo(
    () => [
      {
        accessorKey: "client_reference",
        header: "Client ID",
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
        accessorKey: "clientName",
        header: "Client",
        cell: ({ row }) => {
          const value = row.getValue("clientName");
          return <CellContent value={value} type="text" />;
        },
      },
      {
        accessorKey: "product_reference",
        header: "Product ID",
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
        header: "Product",
        cell: ({ row }) => {
          const value = row.getValue("productName");
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
        accessorKey: "renewal_status",
        header: "Status",
        cell: ({ row }) => {
          const value = row.getValue("renewal_status");
          return <CellContent value={value} type="status" />;
        },
      },
      {
        accessorKey: "nextRenewalDate",
        header: "Next Renewal",
        cell: ({ row }) => {
          const value = row.getValue("nextRenewalDate");
          return <CellContent value={value} type="date" />;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original;

          const viewProduct = () => {
            window.location.href = `/clients/${product.clientId}/product/${product._id}`;
          };

          return (
            <div className="flex justify-end gap-2 actions-cell">
              <button
                onClick={viewProduct}
                className="p-1 rounded hover:bg-gray-100"
                title="View details"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      maintainStructure={true} // Maintenir la même structure sur tous les appareils
    />
  );
}
