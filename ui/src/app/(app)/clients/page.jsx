"use client";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import SearchBar from "@/components/serchBar/Search";
import { ClientsTable } from "./components/ClientsTable";
import PaginationComponent from "@/components/pagination/pagination";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const {
    data: clients,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
  } = useCrud("clients", searchQuery);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Filtrer côté client si nécessaire
    let filtered = clients?.filter(
      (client) =>
        (client.name &&
          client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.email &&
          client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Trier les données
    filtered.sort((a, b) => {
      const refA = a.client_reference || 0; // Assurer une valeur par défaut
      const refB = b.client_reference || 0;

      return sortOrder === "asc" ? refA - refB : refB - refA;
    });

    console.log("Filtered clients data:", filtered); // Debug clients data
    setFilteredData(filtered);
  }, [clients, searchQuery, sortOrder]);

  useEffect(() => {
    // Event listeners for client operations
    const handleClientAdded = () => {
      fetchData();
    };

    const handleClientEdited = () => {
      fetchData();
    };

    const handleClientDeleted = () => {
      fetchData();
    };

    const handleEditEvent = (event) => {
      setSelectedClient(event.detail);
      setEditDialogOpen(true);
    };

    window.addEventListener("clientAdded", handleClientAdded);
    window.addEventListener("clientEdited", handleClientEdited);
    window.addEventListener("clientDeleted", handleClientDeleted);
    window.addEventListener("editClient", handleEditEvent);

    return () => {
      window.removeEventListener("clientAdded", handleClientAdded);
      window.removeEventListener("clientEdited", handleClientEdited);
      window.removeEventListener("clientDeleted", handleClientDeleted);
      window.removeEventListener("editClient", handleEditEvent);
    };
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteItem(id);

      // Vérifie si l'API a retourné un succès
      if (response && response.success) {
        toast.success("Client deleted successfully");

        // Dispatch custom event for deletion
        const event = new CustomEvent("clientDeleted");
        window.dispatchEvent(event);
      } else {
        // Si la suppression a échoué, afficher un message d'erreur
        toast.error("You do not have permission to delete this client.");
      }
    } catch (err) {
      // Si une erreur survient, l'afficher correctement
      toast.error(`Failed to delete client: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold m-1.5 p-0.5">List of clients</h1>
      <div className="w-full searchbar">
        <SearchBar
          onSearch={setSearchQuery}
          onSort={setSortOrder}
          Children={() => (
            <button
              onClick={() => setAddDialogOpen(true)}
              className="px-4 py-2  text-white rounded-md hover:bg-yellow-50 flex items-center gap-2"
            >
              <Plus size={20} color="black" className="bg-white" />
            </button>
          )}
        />
      </div>
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ClientsTable
            data={filteredData}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
          {totalPages > 0 && (
            <div className="mt-2 flex justify-center">
              <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}

      {/* Import dialog components dynamically to avoid SSR issues */}
      {typeof window !== "undefined" && (
        <>
          {/* Dynamic import for AddClientDialog */}
          {addDialogOpen && (
            <div>
              {(() => {
                const AddClientDialog =
                  require("./components/add-client-dialog").default;
                return (
                  <AddClientDialog
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                  />
                );
              })()}
            </div>
          )}

          {/* Dynamic import for EditClientDialog */}
          {editDialogOpen && selectedClient && (
            <div>
              {(() => {
                const EditClientDialog =
                  require("./components/edit-client-dialog").default;
                return (
                  <EditClientDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    clientData={selectedClient}
                  />
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
