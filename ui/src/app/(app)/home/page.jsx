"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useProductsStats } from "@/hooks/useProductsStats";
import { ProductHomeTable } from "./components/ProductHomeTable";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

import "./homepage.css";
import "./homeitems.css";
import "./statiques.css";

import { useClientsCount } from "@/components/getStatiques/getAllClients";

function Page() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    expiringSoon: 0,
    expired: 0,
    totalPrice: 0,
    activePercentage: 0,
    expiringPercentage: 0,
    expiredPercentage: 0,
    clientsPercentage: 0,
  });

  const {
    products,
    productsCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useProductsStats();

  const { clientsCount, clintsLoading, ClientError } = useClientsCount();

  // Calculer les statistiques à partir des produits récupérés de la base de données
  useEffect(() => {
    if (products && products.length > 0) {
      const now = new Date();
      const in31Days = new Date();
      in31Days.setDate(now.getDate() + 31);

      let active = 0;
      let expiring = 0;
      let expired = 0;
      let totalPrice = 0;

      products.forEach((product) => {
        const { date_fin, price } = product;
        totalPrice += price || 0;

        if (!date_fin) {
          active++;
          return;
        }

        const renewalDate = new Date(date_fin);

        // Active Products: current_date + 31 days < end_date
        if (in31Days < renewalDate) {
          active++;
        }
        // Expiring Soon: current_date + 31 days >= end_date > current_date
        else if (in31Days >= renewalDate && renewalDate > now) {
          expiring++;
        }
        // Expired: current_date > end_date
        else if (now > renewalDate) {
          expired++;
        }
      });

      const total = products.length;

      // Calcul des pourcentages
      const activePercentage =
        total > 0 ? ((active / total) * 100).toFixed(2) : 0;
      const expiringPercentage =
        total > 0 ? ((expiring / total) * 100).toFixed(2) : 0;
      const expiredPercentage =
        total > 0 ? ((expired / total) * 100).toFixed(2) : 0;

      // Pour le pourcentage de clients, nous utilisons simplement une valeur de tendance
      const clientsPercentage = "+6.08";

      setStats({
        totalProducts: total,
        activeProducts: active,
        expiringSoon: expiring,
        expired,
        totalPrice,
        activePercentage,
        expiringPercentage,
        expiredPercentage,
        clientsPercentage,
      });
    } else if (productsCount) {
      // Si les produits détaillés ne sont pas disponibles, utiliser les statistiques globales
      setStats((prevState) => ({
        ...prevState,
        totalProducts: productsCount.totalProducts || 0,
        activeProducts: productsCount.activeProducts || 0,
        expiringSoon: productsCount.expiringSoonProducts || 0,
        expired: productsCount.expiredProducts || 0,
      }));
    }
  }, [products, productsCount]);

  const router = useRouter();
  const [loadingToken, setLoadingToken] = useState(true); // État pour le chargement du token

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

  if (isLoading || clintsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || ClientError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error || ClientError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="statiques">
        <div className={`statiquesDisplay activeProducts`}>
          <h1 className="statiquesHeader">Active Products</h1>
          <div className="flex justify-between items-end">
            <h2 className="nbrStatiques">{stats.activeProducts}</h2>
            <div className="flex items-center text-sm">
              <span className="mr-1">{stats.activePercentage}%</span>
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        <div className={`statiquesDisplay expiringSoon`}>
          <h1 className="statiquesHeader">Expiring Soon</h1>
          <div className="flex justify-between items-end">
            <h2 className="nbrStatiques">{stats.expiringSoon}</h2>
            <div className="flex items-center text-sm">
              <span className="mr-1">{stats.expiringPercentage}%</span>
              <TrendingDown size={16} />
            </div>
          </div>
        </div>

        <div className={`statiquesDisplay expired`}>
          <h1 className="statiquesHeader">Expired</h1>
          <div className="flex justify-between items-end">
            <h2 className="nbrStatiques">{stats.expired}</h2>
            <div className="flex items-center text-sm">
              <span className="mr-1">{stats.expiredPercentage}%</span>
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        <div className={`statiquesDisplay clients`}>
          <h1 className="statiquesHeader">Clients</h1>
          <div className="flex justify-between items-end">
            <h2 className="nbrStatiques">{clientsCount}</h2>
            <div className="flex items-center text-sm">
              <span className="mr-1">{stats.clientsPercentage}%</span>
              <TrendingUp size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg shadow-sm">
        <ProductHomeTable data={products} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Page;
