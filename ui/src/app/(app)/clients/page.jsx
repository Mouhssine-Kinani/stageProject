"use client";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import SearchBar from "@/components/serchBar/Search";
import { ClientsTable } from "./columns";
import { PaginationDemo } from "@/components/pagination/pagination";

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
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
    const filtered = clients?.filter(
      (client) =>
        (client.name &&
          client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.email &&
          client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [clients, searchQuery]);

  return (
    <div>
      <div className="w-full searchbar">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ClientsTable data={clients} onDelete={deleteItem} />
          <div className="mt-2 flex justify-center">
            <PaginationDemo
              currentPage={currentPage}
              setPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
