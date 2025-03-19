"use client"

import { UserTable } from "./columns"
import { useCrud } from "@/hooks/useCrud"
import { useNotification } from "@/context/NotificationContext"
import { useEffect, useState, useRef } from "react"
// import PaginationComponent from "./pagination/pagination"

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const { showError, showSuccess, showInfo } = useNotification();
  const actionPerformedRef = useRef(null);
  
  const {
      error,
      isLoading,
      deleteItem,
    } = useCrud("users");
    
  // Handle custom events for user actions
  useEffect(() => {
    const handleUserAdded = () => {
      showSuccess("User added successfully");
      actionPerformedRef.current = "added";
    };
    
    const handleUserEdited = () => {
      showInfo("User updated successfully");
      actionPerformedRef.current = "edited";
    };
    
    const handleUserDeleted = () => {
      showError("User deleted");
      actionPerformedRef.current = "deleted";
    };
    
    // Add event listeners
    window.addEventListener('userAdded', handleUserAdded);
    window.addEventListener('userEdited', handleUserEdited);
    window.addEventListener('userDeleted', handleUserDeleted);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('userAdded', handleUserAdded);
      window.removeEventListener('userEdited', handleUserEdited);
      window.removeEventListener('userDeleted', handleUserDeleted);
    };
  }, [showSuccess, showInfo, showError]);
  
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
      const event = new CustomEvent('userDeleted');
      window.dispatchEvent(event);
    } catch (err) {
      showError(`Failed to delete user: ${err.message}`);
    }
  };
  
  return (<>
  
      <h1 className="text-3xl font-bold m-1.5 p-0.5">List of users</h1>
    <div className="container mx-auto py-10">

      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
      <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <UserTable onDelete={handleDelete} />
      )}
      </div>
    </div>
  </>
  )
} 