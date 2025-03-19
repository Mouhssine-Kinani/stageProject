"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import "./homepage.css";
import "./homeitems.css";
import "./statiques.css";

import { useProducts } from "@/components/getStatiques/getAllProducts";
import { useClientsCount } from "@/components/getStatiques/getAllClients";
import { useProductsStats } from "@/hooks/useProductsStats";
import { ProductHomeTable } from "./components/ProductHomeTable";
import { useCrud } from "@/hooks/useCrud";

function Page() {
  const [loadingToken, setLoadingToken] = useState(true); // État pour le chargement du token
  const router = useRouter();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const { clientsCount, clintsLoading, ClientError } = useClientsCount();
  const {
    productsCount,
    loading: loadingStats,
    error: errorStats,
  } = useProductsStats();
  const { deleteItem } = useCrud("users");

  // Filtrer les produits qui expirent bientôt
  const expiringSoonProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    // Obtenir la date actuelle
    const currentDate = new Date();

    // Filtrer les produits qui expirent dans les 30 prochains jours
    return products
      .filter((product) => {
        if (!product.nextRenewalDate) return false;

        const renewalDate = new Date(product.nextRenewalDate);
        const timeDiff = renewalDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Produits qui expirent dans les 30 prochains jours
        return daysDiff > 0 && daysDiff <= 30;
      })
      .map((product) => ({
        ...product,
        // Assurer un format de date cohérent
        nextRenewalDate: product.nextRenewalDate
          ? new Date(product.nextRenewalDate).toISOString()
          : null,
      }));
  }, [products]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
    } else {
      setLoadingToken(false); // Le token est vérifié, on arrête le chargement
    }
  }, [router]);

  // Afficher un écran de chargement tant que la vérification du token n'est pas terminée
  if (loadingToken) {
    return <p>Checking authentication...</p>;
  }

  if (productsLoading || clintsLoading || loadingStats)
    return <p>Loading...</p>;
  if (productsError || ClientError || errorStats)
    return (
      <p className="text-red-500">
        Error: {productsError || ClientError || errorStats}
      </p>
    );

  console.log("Expiring soon products for table:", expiringSoonProducts); // Debug expiring soon products

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
            {totalProducts > 0
              ? ((activeProducts / totalProducts) * 100).toFixed(2)
              : 0}
            %
          </p>
        </div>

        <div className="expiringSoon statiquesDisplay">
          <h1 className="statiquesHeader">Expiring Soon</h1>
          <h2 className="nbrStatiques">{expiringSoon}</h2>
          <p className="calc">
            {totalProducts > 0
              ? ((expiringSoon / totalProducts) * 100).toFixed(2)
              : 0}
            %
          </p>
        </div>

        <div className="expired statiquesDisplay">
          <h1 className="statiquesHeader">Expired</h1>
          <h2 className="nbrStatiques">{expiredProducts}</h2>
          <p className="calc">
            {totalProducts > 0
              ? ((expiredProducts / totalProducts) * 100).toFixed(2)
              : 0}
            %
          </p>
        </div>

        <div className="clients statiquesDisplay">
          <h1 className="statiquesHeader">Clients</h1>
          <h2 className="nbrStatiques">{clientsCount}</h2>
        </div>
      </div>
      <div className="HomeItems">
        <h3 className="text-lg font-semibold mb-4">Products Expiring Soon</h3>
        <div className="tableContainer">
          <ProductHomeTable
            data={expiringSoonProducts}
            isLoading={productsLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
