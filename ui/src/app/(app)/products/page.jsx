"use client";
import SearchBar from "@/components/serchBar/Search";
import { useState, useEffect } from "react";
import { PaginationDemo } from "@/components/pagination/pagination";
import { ProductTable } from "./columns";
import { useCrud } from "@/hooks/useCrud";

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <div>
      <SearchBar onSearch={setSearchQuery} />
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductTable
            data={products}
            onDelete={deleteItem}
          />
          {
            products.length >=2 ? (<div className="mt-2 flex justify-center">
            <PaginationDemo
              currentPage={currentPage}
              setPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>) : ('')
          }

        </>
      )}
      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
    </div>
  );
}

export default ProductsPage;
