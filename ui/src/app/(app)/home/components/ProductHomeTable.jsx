"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/table/base-data-table";
import CellContent from "@/components/table/CellContent";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

/**
 * Composant de tableau pour l'affichage des produits expirant bientôt sur la page d'accueil
 *
 * @param {Object} props
 * @param {Array} props.data - Données des produits à afficher
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 */
export function ProductHomeTable({ data = [], isLoading = false }) {
  // Filtrer uniquement les produits expirant bientôt
  const expiringProducts = useMemo(() => {
    const now = new Date();
    const in31Days = new Date();
    in31Days.setDate(now.getDate() + 31);

    return data.filter((product) => {
      if (!product.date_fin) return false;
      const renewalDate = new Date(product.date_fin);
      return in31Days >= renewalDate && renewalDate > now;
    });
  }, [data]);

  // Définir les colonnes du tableau
  const columns = useMemo(
    () => [
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
        accessorKey: "date_fin",
        header: "Expiration Date",
        cell: ({ row }) => {
          const value = row.getValue("date_fin");
          if (!value) return <span>—</span>;
          
          const date = new Date(value);
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" /> 
              <span>{date.toLocaleDateString()}</span>
            </div>
          );
        },
      },
      {
        id: "daysRemaining",
        header: "Days Remaining",
        cell: ({ row }) => {
          const dateFin = row.original.date_fin;
          if (!dateFin) return <span>—</span>;
          
          const expirationDate = new Date(dateFin);
          const today = new Date();
          const diffInDays = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
          
          return (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-yellow-600">{diffInDays} days</span>
            </div>
          );
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
                className="p-1.5 rounded hover:bg-gray-100"
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

  // Afficher un message si aucun produit n'expire bientôt
  if (expiringProducts.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Products Expiring Soon (0)</h2>
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-3" />
          <p className="text-lg font-medium text-gray-700">No products expiring soon!</p>
          <p className="text-sm text-gray-500 mt-1">All your products are in good standing or have already expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Products Expiring Soon ({expiringProducts.length})</h2>
      <DataTable
        columns={columns}
        data={expiringProducts}
        isLoading={isLoading}
        maintainStructure={true}
      />
    </div>
  );
}
