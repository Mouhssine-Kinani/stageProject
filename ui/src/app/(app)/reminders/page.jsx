"use client";
import SearchBar from "@/components/serchBar/Search";
import { useState, useEffect, useMemo } from "react";
import { useCrud } from "@/hooks/useCrud";
import { RemindersTable } from "./columns";
import { PaginationDemo } from "@/components/pagination/pagination";

// Helper function to calculate next renewal date
const calculateNextRenewal = (productAddedDate, billing_cycle) => {
  const created = new Date(productAddedDate);
  const renewal = new Date(created);
  switch (billing_cycle) {
    case "monthly":
      renewal.setMonth(renewal.getMonth() + 1);
      break;
    case "yearly":
      renewal.setFullYear(renewal.getFullYear() + 1);
      break;
    case "biennial":
      renewal.setFullYear(renewal.getFullYear() + 2);
      break;
    default:
      return null;
  }
  return renewal;
};

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const {
    data: reminders,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCrud("clients", searchQuery);

  // Flatten the clients data into product rows and calculate nextRenewalDate for each product
  const flattenedData = useMemo(() => {
    if (!reminders || reminders.length === 0) return [];
    return reminders.flatMap((client) =>
      client.products.map((product) => {
        const nextRenewalDate = calculateNextRenewal(
          product.productAddedDate,
          product.billing_cycle
        );
        return {
          client_reference: client.client_reference,
          clientLogo: client.logo || client.clientLogo || "default-client-logo.png",
          clientName: client.name,
          productName: product.productName,
          category: product.category,
          providerLogo:
            product.provider && product.provider.length > 0
              ? product.provider[0].logo
              : "default-provider-logo.png",
          price: product.price,
          renewal_status: client.renewal_status,
          nextRenewalDate: nextRenewalDate ? nextRenewalDate.toISOString() : null,
          _id: product._id, // use product id for delete operations if needed
        };
      })
    );
  }, [reminders]);

  // Optional: sort the flattened data
  const sortedData = useMemo(() => {
    const dataCopy = [...flattenedData];
    return dataCopy.sort((a, b) => {
      const refA = a.client_reference || 0;
      const refB = b.client_reference || 0;
      return sortOrder === "asc" ? refA - refB : refB - refA;
    });
  }, [flattenedData, sortOrder]);

  return (
    <div>
      <div className="w-full searchbar">
        <SearchBar onSearch={setSearchQuery} onSort={setSortOrder} />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <RemindersTable data={sortedData} onDelete={deleteItem} />
          {reminders.length >= 2 && (
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
    </div>
  );
}

export default Page;
