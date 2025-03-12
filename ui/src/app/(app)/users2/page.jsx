"use client";

import { UserTable } from "@/app/(app)/users2/columns";
import { useCrud } from "@/hooks/useCrud";

export default function Page() {
  const {
    data,
    error,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCrud("users");

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <UserTable 
          data={data} 
          onDelete={deleteItem}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
    </div>
  );
}
