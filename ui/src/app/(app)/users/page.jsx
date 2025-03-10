"use client";

import { useState } from "react";
import { UserTable } from "@/app/(app)/users/columns";
import { PaginationDemo } from "@/components/pagination/pagination";
import { useCrud } from "@/hooks/useCrud";
import { DialogDemo } from "@/components/popup/dialogDemo";
import SearchBar from "@/components/serchBar/Search";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    error,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCrud("users", searchQuery);

  return (
    <div>
      <h1>List of Users</h1>

      {/* Search bar */}
      <SearchBar onSearch={setSearchQuery} />
      <br />
      <br />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <UserTable data={data} onDelete={deleteItem} />
          <div className="mt-2 flex justify-center">
            <PaginationDemo
              currentPage={currentPage}
              setPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}

      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
    </div>
  );
}
