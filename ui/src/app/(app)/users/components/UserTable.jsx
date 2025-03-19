"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/table/base-data-table";

/**
 * Composant de tableau pour l'affichage des utilisateurs
 *
 * @param {Object} props
 * @param {Array} props.data - Données des utilisateurs à afficher
 * @param {Function} props.onDelete - Fonction pour gérer la suppression
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 */
export function UserTable({ data = [], onDelete, isLoading = false }) {
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
            if (window.confirm("Are you sure you want to delete this user?")) {
              onDelete(user._id);
            }
          };

          return (
            <div className="flex justify-end gap-2 actions-cell">
              <button
                onClick={handleEdit}
                className="p-1 rounded hover:bg-gray-100"
                title="Edit user"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-gray-100 text-red-500"
                title="Delete user"
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          );
        },
      },
    ],
    [onDelete]
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
