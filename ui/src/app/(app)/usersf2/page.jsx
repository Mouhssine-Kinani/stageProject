"use client"

import { UserTable } from "./columns"
import { useCrud } from "@/hooks/useCrud"
// import PaginationComponent from "./pagination/pagination"
import AddUserDialog from "./components/add-user-dialog"  
import { useState } from "react"

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const {
      error,
      isLoading,
      deleteItem,
    } = useCrud("users");
  return (
    <div className="container mx-auto py-10">
      <h1>Users Page</h1>
      <br />
      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
      <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* <AddUserDialog open={open} onOpenChange={setOpen}/> */}
          
          <UserTable onDelete={deleteItem} />
          {/* <PaginationComponent currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} /> */}
        </>
      )}

    </div>
    </div>
  )
} 