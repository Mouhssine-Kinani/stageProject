// "use client";
// import SearchBar from "@/components/serchBar/Search";
// import { useEffect, useState } from "react";
// import { PaginationDemo } from "@/components/pagination/pagination";
// import { ProductTable } from "./columns";
// import { useCrud } from "@/hooks/useCrud";
// import { useProducts } from "@/components/getStatiques/getAllProducts";

// function page() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const { isLoading, deleteItem, currentPage, setCurrentPage, totalPages } =
//     useCrud("products", searchQuery);

//   const { products, loading, error } = useProducts();

//   const [data, setData] = useState([]);
//   useEffect(() => {
//     setData(products);
//   }, [products]);
//   // Filtrage des produits en fonction de la recherche
//   const filteredData =
//     data?.filter(
//       (product) =>
//         (product.productName &&
//           product.productName
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())) ||
//         (product.category &&
//           product.category.toLowerCase().includes(searchQuery.toLowerCase()))
//     ) || [];

//   return (
//     <div>
//       <SearchBar onSearch={setSearchQuery} />
//       <br />
//       {isLoading ? (
//         loading
//       ) : (
//         <>
//           <ProductTable
//             data={filteredData ? filteredData : data}
//             onDelete={deleteItem}
//           />
//           {filteredData.length > 10 ? (
//             ""
//           ) : (
//             <div className="mt-2 flex justify-center">
//               <PaginationDemo
//                 currentPage={currentPage}
//                 setPageChange={setCurrentPage}
//                 totalPages={totalPages}
//               />
//             </div>
//           )}
//         </>
//       )}
//       {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
//     </div>
//   );
// }

// export default page;

"use client";
import SearchBar from "@/components/serchBar/Search";
import { useState } from "react";
import { PaginationDemo } from "@/components/pagination/pagination";
import { ProductTable } from "./columns";
import { useCrud } from "@/hooks/useCrud";

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading,
    error,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCrud("products", searchQuery);
  console.log("Fetched products:", data);

  const filteredData =
    data?.filter(
      (product) =>
        (product.productName &&
          product.productName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (product.category &&
          product.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  console.log(filteredData);
  return (
    <div>
      <SearchBar onSearch={setSearchQuery} />
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductTable
            data={filteredData.length ? filteredData : data}
            onDelete={deleteItem}
          />
          {filteredData.length > 10 ? (
            ""
          ) : (
            <div className="mt-2 flex justify-center">
              <PaginationDemo
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
