"use client";

import { useState, useEffect } from "react";
import "./homepage.css";
import "./homeitems.css";
import "./statiques.css";

import { useProducts } from "@/components/getStatiques/getAllProducts";
import { useClientsCount } from "@/components/getStatiques/getAllClients";
import { useProductsStats } from "@/hooks/useProductsStats";

import { ProductHomeTable } from "./columns";
import { useCrud } from "@/hooks/useCrud";

function Page() {
  const [data, setData] = useState([]);
  const { products, loading, error } = useProducts();
  const { clientsCount, clintsLoading, ClientError } = useClientsCount();
  const { productsCount, loading: loadingStats, error: errorStats } = useProductsStats();
  const { deleteItem } = useCrud("users");

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
          <h2 className="nbrStatiques">{clientsCount}</h2>
        </div>
      </div>
      <div className="HomeItems">
        <div className="tableContainer">
          <ProductHomeTable data={data} onDelete={deleteItem} />
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
