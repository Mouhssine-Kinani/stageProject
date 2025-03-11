"use client";

import { useState, useEffect } from "react";
import "./homepage.css";
import "./homeitems.css";
import "./statiques.css";
import { DataTable } from "@/components/table/data-table";

import { useProducts } from "@/components/getStatiques/getAllProducts";
import { useClients } from "@/components/getStatiques/getAllClients";
import { useProductsStats } from "@/hooks/useProductsStats";

import { ProductHomeTable } from "./columns";
import { useCrud } from "@/hooks/useCrud";

function Page() {
  const [data, setData] = useState([]);
  const { products, loading, error } = useProducts();
  const { clients, clintsLoading, ClientError } = useClients();
  const { productsCount, loading: loadingStats, error: errorStats } = useProductsStats();
    const {
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCrud("users");

  useEffect(() => {
    const oneMonthInMillis = 31 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const productExpiringSoon = products.filter((product) => {
      const expirationDate = new Date(product.date_fin).getTime();
      return expirationDate - now <= oneMonthInMillis && expirationDate >= now;
    });

    setData(productExpiringSoon);
  }, [products]);

  if (loading || clintsLoading || loadingStats) return <p>Loading...</p>;
  if (error || ClientError || errorStats)
    return <p className="text-red-500">Error: {error || ClientError || errorStats}</p>;

  const totalProducts = productsCount.totalProducts || 0;
  const activeProducts = productsCount.activeProducts || 0;
  const expiringSoon = productsCount.expiringSoonProducts || 0;
  const expiredProducts = productsCount.expiredProducts || 0;
  const totalClients = clients.length || 0;

  return (
    <div className="container">
      <div className="day">
        <h2>Today</h2>
      </div>
      <div className="statiques">
        <div className="activeProducts statiquesDisplay">
          <h1 className="statiquesHeader">Active Products</h1>
          <h2 className="nbrStatiques">{activeProducts}</h2>
          <p className="calc">
            {totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(2) : 0}%
          </p>
        </div>

        <div className="expiringSoon statiquesDisplay">
          <h1 className="statiquesHeader">Expiring Soon</h1>
          <h2 className="nbrStatiques">{expiringSoon}</h2>
          <p className="calc">
            {totalProducts > 0 ? ((expiringSoon / totalProducts) * 100).toFixed(2) : 0}%
          </p>
        </div>

        <div className="expired statiquesDisplay">
          <h1 className="statiquesHeader">Expired</h1>
          <h2 className="nbrStatiques">{expiredProducts}</h2>
          <p className="calc">
            {totalProducts > 0 ? ((expiredProducts / totalProducts) * 100).toFixed(2) : 0}%
          </p>
        </div>

        <div className="clients statiquesDisplay">
          <h1 className="statiquesHeader">Clients</h1>
          <h2 className="nbrStatiques">{totalClients}</h2>
        </div>
      </div>
      <div className="HomeItems">
        <div className="tableContainer">
          {/* <DataTable
            columns={[
              { accessorKey: "product_reference", header: "Ref" },
              { accessorKey: "productName", header: "Product Name" },
              { accessorKey: "category", header: "Category" },
              { accessorKey: "provider", header: "Provider" },
              {
                accessorKey: "billing_cycle",
                header: "Billing Cycle",
                cell: ({ getValue }) => (
                  <div className="flex items-center gap-2">
                    <img src="/tableIcons/iconCalender.svg" alt="Calendar Icon" className="w-5 h-5" />
                    <span className="font-medium">{getValue()}</span>
                  </div>
                ),
              },
              { accessorKey: "price", header: "Renewal Price" },
              {
                accessorKey: "date_fin",
                header: "Renewal Status",
                cell: ({ getValue }) => {
                  const dateFin = getValue() ? new Date(getValue()) : null;
                  if (!dateFin) return <span className="text-green-500">OK</span>;

                  const today = new Date();
                  const diffInDays = Math.ceil((dateFin - today) / (1000 * 60 * 60 * 24));

                  if (diffInDays < 0) return <span className="text-red-500">Expired</span>;
                  if (diffInDays <= 31) return <span className="text-yellow-500">Expiring Soon</span>;
                  return <span className="text-green-500">OK</span>;
                },
              },
            ]}
            data={data}
          /> */}
          <ProductHomeTable data={data} onDelete={deleteItem}/>
        </div>

        <div className="graphes">
          <div className="graphe1">
            <h1 className="grapheTitle">Traffic by Device</h1>
          </div>
          <div className="graphe2">
            <h1 className="grapheTitle">Traffic by Location</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;