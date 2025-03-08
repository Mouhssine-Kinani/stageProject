"use client";

import { useEffect, useState } from "react";
import "./homepage.css";
import "./homeitems.css";
import "./statiques.css";
import Table from "@/components/table/table";

import { useProducts } from "@/components/getStatiques/getAllProducts";

function Page() {
  const [data, setData] = useState([]);

  const {products,loading, error }= useProducts();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  setData(products)


  const headers = [
    "Ref",
    "Product name",
    "Category",
    "Provider",
    "Billing Cycle",
    "Renewal Price",
    "Renewal Status",
  ];

  return (
    <div className="container">
      <div className="day">
        <h2>Today</h2>
      </div>
      <div className="statiques">
        <div className="activeProducts statiquesDisplay">
          <h1 className="statiquesHeader">Active Products</h1>
          <h2 className="nbrStatiques">120</h2>
          <p className="calc">11%</p>
        </div>
        <div className="expiringSoon statiquesDisplay">
          <h1 className="statiquesHeader">Expiring Soon</h1>
          <h2 className="nbrStatiques">120</h2>
          <p className="calc">11%</p>
        </div>
        <div className="expired statiquesDisplay">
          <h1 className="statiquesHeader">Expired</h1>
          <h2 className="nbrStatiques">120</h2>
          <p className="calc">11%</p>
        </div>
        <div className="clients statiquesDisplay">
          <h1 className="statiquesHeader">Clients</h1>
          <h2 className="nbrStatiques">120</h2>
          <p className="calc">11%</p>
        </div>
      </div>
      <div className="HomeItems">
      <Table data={data} headers={headers} />

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
