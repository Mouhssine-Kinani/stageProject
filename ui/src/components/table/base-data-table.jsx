"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useState, useEffect, useMemo } from "react";

/**
 * Reusable data table component with responsive design
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table columns configuration
 * @param {Array} props.data - Table data (already filtered if needed)
 * @param {boolean} props.showNoResults - Whether to show "No results" message when data is empty
 * @param {boolean} props.isLoading - Whether the data is loading
 * @param {boolean} props.maintainStructure - Whether to maintain the same column structure on all devices (default: true)
 * @returns {JSX.Element} - Table component
 */
export function DataTable({
  columns,
  data = [],
  showNoResults = true,
  isLoading = false,
  maintainStructure = true,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [tableWidth, setTableWidth] = useState(0);

  // Détecter si on est sur mobile et calculer la largeur disponible
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);

      // Trouver le conteneur de table et calculer la largeur disponible
      const tableContainer = document.querySelector(
        ".table-responsive-container"
      );
      if (tableContainer) {
        setTableWidth(tableContainer.offsetWidth);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Sélectionner les colonnes à afficher en fonction de la taille d'écran
  const visibleColumns = useMemo(() => {
    // Si maintainStructure est true, montrer toutes les colonnes sur tous les appareils
    if (maintainStructure) return columns;

    // Sinon, utiliser la logique précédente pour filtrer les colonnes sur mobile
    if (!isMobile) return columns;

    // Sur mobile, garder uniquement les colonnes importantes et les actions
    const primaryKeys = [
      "name",
      "email",
      "productName",
      "clientName",
      "client_reference",
      "product_reference",
    ];

    return columns.filter((col) => {
      // Toujours inclure la colonne d'actions
      if (col.id === "actions") return true;

      // Inclure les colonnes avec des clés primaires
      if (
        col.accessorKey &&
        primaryKeys.some((key) => col.accessorKey.includes(key))
      ) {
        return true;
      }

      return false;
    });
  }, [columns, isMobile, maintainStructure]);

  // Create the table with the provided data
  const table = useReactTable({
    data: data,
    columns: visibleColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Style dynamique pour les cellules de tableau selon la taille d'écran
  const getCellStyles = () => {
    if (!maintainStructure || !isMobile) return {};

    // Si on maintient la structure mais qu'on est sur mobile,
    // ajuster la largeur des cellules pour qu'elles tiennent dans l'écran
    const columnCount = visibleColumns.length;
    if (columnCount > 0 && tableWidth > 0) {
      const maxWidth = Math.floor(tableWidth / columnCount);
      return {
        maxWidth: `${maxWidth}px`,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      };
    }

    return {};
  };

  const cellStyles = getCellStyles();

  return (
    <div className="table-responsive-container">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={cellStyles}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={cellStyles}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : showNoResults ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls would go here - rendered by parent component */}
    </div>
  );
}
