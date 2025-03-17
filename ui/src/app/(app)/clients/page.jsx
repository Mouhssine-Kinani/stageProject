"use client";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import SearchBar from "@/components/serchBar/Search";
import { ClientsTable } from "./columns";
import PaginationComponent from "@/components/pagination/pagination";

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const {
    data: clients,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
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
// Trier les données
filtered.sort((a, b) => {
  const refA = a.client_reference || 0; // Assurer une valeur par défaut
  const refB = b.client_reference || 0;

  return sortOrder === "asc" ? refA - refB : refB - refA;
});


    setFilteredData(filtered);
  }, [clients, searchQuery, sortOrder]);

  return (
    <div>
      <div className="w-full searchbar">
        <SearchBar onSearch={setSearchQuery} onSort={setSortOrder} />
      </div>
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ClientsTable data={filteredData} onDelete={deleteItem} />
          {clients.length >= 2 && (
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
    </div>
  );
}

export default Page;
