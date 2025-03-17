"use client"
import { useState, useMemo, useEffect } from "react"
import PaginationComponent from "@/components/pagination/pagination"
import { useCrud } from "@/hooks/useCrud"
import AddUserDialog from "./components/add-user-dialog"
import EditUserDialog from "./components/edit-user-dialog"
import SearchBar from "@/components/serchBar/Search"
import { DataTable as ReusableDataTable } from "@/components/table/base-data-table"

export function DataTable({columns}) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState("asc")
    const [userToEdit, setUserToEdit] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    
    const {data, setCurrentPage, currentPage, totalPages, fetchData} = useCrud("users")
    
    // Listen for the editUser custom event
    useEffect(() => {
      const handleEditEvent = (event) => {
        const user = event.detail;
        handleEdit(user);
      };
      
      window.addEventListener('editUser', handleEditEvent);
      
      return () => {
        window.removeEventListener('editUser', handleEditEvent);
      };
    }, []);
    
    // Filter data based on search query using useMemo to prevent infinite loops
    const filteredData = useMemo(() => {
      return data?.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || []
    }, [data, searchQuery])
    
    const handleUserAdded = async () => {
        // Refresh data when a user is added
        await fetchData()
        setCurrentPage(1)
        
        // Dispatch custom event for user added
        const event = new CustomEvent('userAdded');
        window.dispatchEvent(event);
    }
    
    const handleUserEdited = async () => {
        // Refresh data when a user is edited
        await fetchData()
        
        // Dispatch custom event for user edited
        const event = new CustomEvent('userEdited');
        window.dispatchEvent(event);
    }
    
    const handleEdit = (user) => {
        setUserToEdit(user)
        setEditDialogOpen(true)
    }
  
    const toggleSortOrder = () => {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }
  
    return (
      <div className="w-full">
        <SearchBar 
          onSort={toggleSortOrder} 
          onSearch={setSearchQuery} 
          Children={AddUserDialog}
          ChildrenProps={{
            open: open,
            onOpenChange: setOpen,
            onUserAdded: handleUserAdded
          }}
        />
        <br />
        
        {/* Use the reusable DataTable component with filtered data */}
        <ReusableDataTable 
          columns={columns} 
          data={filteredData}
        />
        
        <PaginationComponent 
          currentPage={currentPage} 
          totalPages={totalPages} 
          setCurrentPage={setCurrentPage} 
        />
        
        {/* EditUserDialog component */}
        <EditUserDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          userData={userToEdit}
          onUserEdited={handleUserEdited}
        />
      </div>
  )
}