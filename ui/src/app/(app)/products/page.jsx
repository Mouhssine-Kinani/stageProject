"use client";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import SearchBar from "@/components/serchBar/Search";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import PaginationComponent from "@/components/pagination/pagination";
import { ProductsTable } from "./components/ProductsTable";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: products,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
  } = useCrud("products", searchQuery);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Filtrer côté client si nécessaire
    let filtered =
      products?.filter(
        (product) =>
          (product.productName &&
            product.productName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (product.category &&
            product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (product.provider?.name &&
            product.provider.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ) || [];

    // Trier les données
    filtered.sort((a, b) => {
      const refA = a.product_reference || 0;
      const refB = b.product_reference || 0;

      return sortOrder === "asc" ? refA - refB : refB - refA;
    });

    console.log("Filtered products data:", filtered);
    setFilteredData(filtered);
  }, [products, searchQuery, sortOrder]);

  useEffect(() => {
    // Event listeners for product operations
    const handleProductAdded = () => {
      fetchData();
    };

    const handleProductEdited = () => {
      fetchData();
    };

    const handleProductDeleted = () => {
      fetchData();
    };

    const handleEditEvent = (event) => {
      setSelectedProduct(event.detail);
      setEditDialogOpen(true);
    };

    window.addEventListener("productAdded", handleProductAdded);
    window.addEventListener("productEdited", handleProductEdited);
    window.addEventListener("productDeleted", handleProductDeleted);
    window.addEventListener("editProduct", handleEditEvent);

    return () => {
      window.removeEventListener("productAdded", handleProductAdded);
      window.removeEventListener("productEdited", handleProductEdited);
      window.removeEventListener("productDeleted", handleProductDeleted);
      window.removeEventListener("editProduct", handleEditEvent);
    };
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteItem(id);

      // Vérifie si l'API a retourné un succès
      if (response && response.success) {
        toast.success("Product deleted successfully");

        // Dispatch custom event for deletion
        const event = new CustomEvent("productDeleted");
        window.dispatchEvent(event);
      } else {
        // Si la suppression a échoué, afficher un message d'erreur
        toast.error("You do not have permission to delete this product.");
      }
    } catch (err) {
      // Si une erreur survient, l'afficher correctement
      toast.error(`Failed to delete product: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold m-1.5 p-0.5">List of products</h1>
      <div className="w-full searchbar">
        <SearchBar
          onSearch={setSearchQuery}
          onSort={setSortOrder}
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
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductsTable
            data={filteredData}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
          {/* Afficher la pagination même avec un seul élément */}
          {totalPages > 0 && (
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

      {/* Import dialog components dynamically to avoid SSR issues */}
      {typeof window !== "undefined" && (
        <>
          {/* Dynamic import for AddProductDialog */}
          {addDialogOpen && (
            <div>
              {(() => {
                const AddProductDialog =
                  require("./components/add-product-dialog").default;
                return (
                  <AddProductDialog
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                  />
                );
              })()}
            </div>
          )}

          {/* Dynamic import for EditProductDialog */}
          {editDialogOpen && selectedProduct && (
            <div>
              {(() => {
                const EditProductDialog =
                  require("./components/edit-product-dialog").default;
                return (
                  <EditProductDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    productData={selectedProduct}
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
