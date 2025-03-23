"use client";

import { UserTable } from "./components/UserTable";
import { useCrud } from "@/hooks/useCrud";
import { useNotification } from "@/context/NotificationContext";
import { useEffect, useState, useRef } from "react";
import PaginationComponent from "@/components/pagination/pagination";
import SearchBar from "@/components/serchBar/Search";
import { Plus } from "lucide-react";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { showError, showSuccess, showInfo } = useNotification();
  const actionPerformedRef = useRef(null);

  const {
    data: users,
    error,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
  } = useCrud("users", searchQuery);

  // Filtrer les données selon la recherche
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Filtrer côté client si nécessaire
    let filtered =
      users?.filter(
        (user) =>
          (user.fullName &&
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || [];

    // Trier les données
    filtered.sort((a, b) => {
      const refA = a.user_reference || 0;
      const refB = b.user_reference || 0;

      return sortOrder === "asc" ? refA - refB : refB - refA;
    });

    setFilteredData(filtered);
  }, [users, searchQuery, sortOrder]);

  // Handle custom events for user actions
  useEffect(() => {
    const handleUserAdded = () => {
      showSuccess("User added successfully");
      actionPerformedRef.current = "added";
      fetchData();
    };

    const handleUserEdited = (event) => {
      showInfo("User updated successfully");
      actionPerformedRef.current = "edited";

      // Extraire les données de l'utilisateur mis à jour depuis l'événement
      const updatedUser = event.detail?.data;

      // Log pour débogage
      console.log("User edited event received:", updatedUser);

      // Force le rafraîchissement des données
      fetchData().then(() => {
        // Après le rafraîchissement des données, force le rafraîchissement des images
        if (updatedUser && updatedUser.logo) {
          // Ajouter un timestamp aux URLs d'images pour éviter le cache
          const timestamp = new Date().getTime();
          const imageUrl = `${process.env.NEXT_PUBLIC_URLAPI}/${updatedUser.logo}?t=${timestamp}`;

          // Précharger l'image pour forcer le navigateur à mettre à jour le cache
          const img = new Image();
          img.src = imageUrl;

          console.log("Refreshing image cache for:", imageUrl);
        }
      });
    };

    const handleUserDeleted = () => {
      showError("User deleted");
      actionPerformedRef.current = "deleted";
    };

    const handleEditEvent = (event) => {
      setSelectedUser(event.detail);
      setEditDialogOpen(true);
    };

    // Add event listeners
    window.addEventListener("userAdded", handleUserAdded);
    window.addEventListener("userEdited", handleUserEdited);
    window.addEventListener("userDeleted", handleUserDeleted);
    window.addEventListener("editUser", handleEditEvent);

    // Clean up event listeners
    return () => {
      window.removeEventListener("userAdded", handleUserAdded);
      window.removeEventListener("userEdited", handleUserEdited);
      window.removeEventListener("userDeleted", handleUserDeleted);
      window.removeEventListener("editUser", handleEditEvent);
    };
  }, [showSuccess, showInfo, showError, fetchData]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      showError(`Error: ${error.message}`);
    }
  }, [error, showError]);

  // Custom delete handler that dispatches an event
  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      // Dispatch custom event for deletion
      const event = new CustomEvent("userDeleted");
      window.dispatchEvent(event);
    } catch (err) {
      showError(`Failed to delete user: ${err.message}`);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold m-1.5 p-0.5">List of users</h1>
      <div className="w-full searchbar">
        <SearchBar
          onSearch={setSearchQuery}
          onSort={setSortOrder}
          Children={() => (
            <button
              onClick={() => setAddDialogOpen(true)}
              className="px-4 py-2 text-white rounded-md hover:bg-yellow-50 flex items-center gap-2"
            >
              <Plus size={20} color="black" className="bg-white" />
            </button>
          )}
        />
      </div>
      <br />
      <div className="container mx-auto py-5">
        {error && (
          <div className="text-red-500 mt-2">Error: {error.message}</div>
        )}
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <UserTable
                data={filteredData}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
              {totalPages > 0 && (
                <div className="mt-4 flex justify-center">
                  <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Import dialog components dynamically to avoid SSR issues */}
      {typeof window !== "undefined" && (
        <>
          {/* Dynamic import for AddUserDialog */}
          {addDialogOpen && (
            <div>
              {(() => {
                const AddUserDialog =
                  require("./components/add-user-dialog").default;
                return (
                  <AddUserDialog
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                  />
                );
              })()}
            </div>
          )}

          {/* Dynamic import for EditUserDialog */}
          {editDialogOpen && selectedUser && (
            <div>
              {(() => {
                const EditUserDialog =
                  require("./components/edit-user-dialog").default;
                return (
                  <EditUserDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    userData={selectedUser}
                  />
                );
              })()}
            </div>
          )}
        </>
      )}
    </>
  );
}
