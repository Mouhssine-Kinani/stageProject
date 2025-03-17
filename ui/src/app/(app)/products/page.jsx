"use client";
import SearchBar from "@/components/serchBar/Search";
import { useState, useEffect } from "react";
import  PaginationComponent  from "@/components/pagination/pagination";
import { ProductTable } from "./columns";
import { useCrud } from "@/hooks/useCrud";

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // État pour le tri

  const {
    data: products,
    isLoading,
    error,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCrud("products", searchQuery);
  
  // Filtrer les données côté client si nécessaire
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = products?.filter(
      (product) =>
        (product.productName &&
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.category &&
          product.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [products, searchQuery]);

  // Fonction pour basculer l'ordre du tri
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Appliquer le tri sur product_reference
  const sortedProducts = filteredData
    ? [...filteredData].sort((a, b) => {
        const refA = Number(a.product_reference) || 0;
        const refB = Number(b.product_reference) || 0;
        return sortOrder === "asc" ? refA - refB : refB - refA;
      })
    : [];

  return (
    <div>
      <SearchBar onSearch={setSearchQuery} onSort={toggleSortOrder} />
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductTable data={sortedProducts} onDelete={deleteItem} />
          {products.length >= 2 && (
            <div className="mt-2 flex justify-center">
              <PaginationComponent
                currentPage={currentPage}
                setPageChange={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
    </div>
  );
}

export default ProductsPage;
