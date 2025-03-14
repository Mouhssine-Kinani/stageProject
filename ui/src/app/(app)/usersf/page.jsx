"use client"

import { UserTable } from "../usersf/columns"
import { useCrud } from "@/hooks/useCrud"

export default function UsersPage() {
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
        <UserTable onDelete={deleteItem} />
      )}

    </div>
    </div>
  )
} 