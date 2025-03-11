"use client";
import { useClients } from "@/components/getStatiques/getAllClients";
import SearchBar from "@/components/serchBar/Search";
import { useState ,useEffect} from "react";
import { ClientsTable } from "./columns";
import { useCrud } from "@/hooks/useCrud";
import { PaginationDemo } from "@/components/pagination/pagination";

function page() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading, deleteItem, currentPage, setCurrentPage, totalPages } =
    useCrud("clients", searchQuery);
  const { clients, clintsLoading, ClientError } = useClients();

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(clients);
  }, [clients]);

  const filteredData =
    data?.filter(
      (client) =>
        (client.name &&
          client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.email &&
          client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];
  return (
    <div>
      <div className="w-full searchbar">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      <br />
      {isLoading ? (
        clintsLoading
      ) : (
        <>
          <ClientsTable
            data={filteredData ? filteredData : data}
            onDelete={deleteItem}
          />
          <div className="mt-2 flex justify-center">
            <PaginationDemo
              currentPage={currentPage}
              setPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default page;

// "use client";
// import SearchBar from "@/components/serchBar/Search";
// import { useState } from "react";
// import { PaginationDemo } from "@/components/pagination/pagination";
// import { ClientsTable } from "./columns";
// import { useCrud } from "@/hooks/useCrud";

// function ClientsPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const {
//     data,
//     isLoading,
//     error,
//     deleteItem,
//     currentPage,
//     setCurrentPage,
//     totalPages,
//   } = useCrud("clients", searchQuery);
//   console.log("Fetched clients:", data);

//   const filteredData =
//     data?.filter(
//       (client) =>
//         (client.name &&
//           client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (client.email &&
//           client.email.toLowerCase().includes(searchQuery.toLowerCase()))
//     ) || [];

//   return (
//     <div>
//       <SearchBar onSearch={setSearchQuery} />
//       <br />
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <ClientsTable
//             data={filteredData.length ? filteredData : data}
//             onDelete={deleteItem}
//           />
//           <div className="mt-2 flex justify-center">
//             <PaginationDemo
//               currentPage={currentPage}
//               setPageChange={setCurrentPage}
//               totalPages={totalPages}
//             />
//           </div>
//         </>
//       )}
//       {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
//     </div>
//   );
// }

// export default ClientsPage;
