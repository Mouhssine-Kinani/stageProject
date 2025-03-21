"use client";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import SearchBar from "@/components/serchBar/Search";
import { ClientsTable } from "./components/ClientsTable";
import PaginationComponent from "@/components/pagination/pagination";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AddClientDialog from "./components/add-client-dialog";
import EditClientDialog from "./components/edit-client-dialog";

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
    filtered?.sort((a, b) => {
      const refA = a.client_reference || 0; // Assurer une valeur par défaut
      const refB = b.client_reference || 0;

      return sortOrder === "asc" ? refA - refB : refB - refA;
    });

    console.log("Filtered clients data:", filtered); // Debug clients data
    setFilteredData(filtered || []);
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Clients</h1>
        </div>

        <div className="w-full searchbar mb-4">
          <SearchBar
            onSearch={setSearchQuery}
            onSort={setSortOrder}
            placeholder="Rechercher un client..."
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            <ClientsTable
              data={filteredData}
              onDelete={handleDelete}
              isLoading={isLoading}
            />

            {totalPages > 1 && (
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

        <AddClientDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

        <EditClientDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          clientData={selectedClient}
          onClientEdited={fetchData}
        />
      </div>
    </div>
  );
}

export default Page;
