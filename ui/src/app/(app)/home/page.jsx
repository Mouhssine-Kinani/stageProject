"use client";

import { useState, useEffect } from "react";
import "./homepage.css";
import "./homeitems.css";
import "./statiques.css";
import { DataTable } from "@/components/table/data-table";

import { useProducts } from "@/components/getStatiques/getAllProducts";

function Page() {
  const [data, setData] = useState([]);

  const { products, loading, error } = useProducts();

  useEffect(() => {
    const oneMonthInMillis = 31 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const productExpiringSoon = products.filter((product) => {
      const expirationDate = new Date(product.date_fin).getTime();
      return expirationDate - now <= oneMonthInMillis && expirationDate >= now;
    });

    setData(productExpiringSoon);
  }, [products]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const columns = [
    { accessorKey: "product_reference", header: "Ref" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "provider", header: "Provider" },
    {
      accessorKey: "billing_cycle",
      header: "Billing Cycle",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <img
            src="/tableIcons/iconCalender.svg"
            alt="Calendar Icon"
            className="w-5 h-5"
          />
          <span className=" font-medium">{getValue()}</span>
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

        if (diffInDays < 0) {
          return <span className="text-red-500">Expired</span>; // Rouge
        } else if (diffInDays <= 31) {
          return <span className="text-yellow-500">Expiring Soon</span>; // Jaune
        } else {
          return <span className="text-green-500">OK</span>; // Vert
        }
      },
    },
  ];

  const today = new Date();
  const limitDate = new Date();
  limitDate.setDate(today.getDate() + 31);

  const activeProducts = products.filter((product) => {
    const dateFin = new Date(product.date_fin);
    return today <= dateFin && dateFin > limitDate;
  });

  const expiringSoon = products.filter((product) => {
    const dateFin = new Date(product.date_fin);
    return today <= dateFin && dateFin <= limitDate;
  });

  const expiredProducts = products.filter((product) => {
    const dateFin = new Date(product.date_fin);
    return today > dateFin;
  });

  console.log(products);
  return (
    <div className="container">
      <div className="day">
        <h2>Today</h2>
      </div>
      <div className="statiques">
        <div className="activeProducts statiquesDisplay">
          <h1 className="statiquesHeader">Active Products</h1>
          <h2 className="nbrStatiques">{activeProducts.length}</h2>
          <p className="calc">
            {((activeProducts.length / products.length) * 100).toFixed(2)}%
          </p>
        </div>

        <div className="expiringSoon statiquesDisplay">
          <h1 className="statiquesHeader">Expiring Soon</h1>
          <h2 className="nbrStatiques">{expiringSoon.length}</h2>
          <p className="calc">
            {((expiringSoon.length / products.length) * 100).toFixed(2)}%
          </p>
        </div>

        <div className="expired statiquesDisplay">
          <h1 className="statiquesHeader">Expired</h1>
          <h2 className="nbrStatiques">{expiredProducts.length}</h2>
          <p className="calc">
            {((expiredProducts.length / products.length) * 100).toFixed(2)}%
          </p>
        </div>

        <div className="clients statiquesDisplay">
          <h1 className="statiquesHeader">Clients</h1>
          <h2 className="nbrStatiques">120</h2>
          <p className="calc">11%</p>
        </div>
      </div>
      <div className="HomeItems">
        <div className="tableContainer">
          <DataTable columns={columns} data={data} />
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
