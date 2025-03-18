"use client";
import "./style.css";
import Map from "@/components/map/map";
import { getCoordinates } from "@/lib/geocode";
import { useState, useEffect, use } from "react";
import { useClient } from "@/hooks/useOneClients";
import { MapPin } from "lucide-react";
import { ClientTable } from "./columns";
import SearchBar from "@/components/serchBar/Search";
import PaginationComponent from "@/components/pagination/pagination";
import { deleteProductFromClient } from "@/lib/api"; // Assurez-vous que cette fonction est exportée correctement
import { useTheme } from "@/contexts/ThemeContext";

function ClientPage({ params }) {
  const { clientId } = use(params); // Déstructuration avec `use()`
  const { theme } = useTheme(); // Accès au thème actuel

  // Utilisation du hook personnalisé qui gère la recherche et la pagination des produits
  const {
    client,
    clientLoading,
    clientError,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    paginatedProducts,
    totalPages,
  } = useClient(clientId);

  const [coordinates, setCoordinates] = useState(null);
  const [stats, setStats] = useState({
    activeProducts: 0,
    expiringSoon: 0,
    expired: 0,
    totalPrice: 0,
  });
  const [sortOrder, setSortOrder] = useState("asc"); // État pour le tri

  // Récupération des coordonnées à partir de l'adresse du client
  useEffect(() => {
    async function fetchCoordinates() {
      if (client?.address) {
        try {
          const coords = await getCoordinates(client.address);
          setCoordinates(coords);
        } catch (err) {
          console.error("Error fetching coordinates:", err);
        }
      }
    }
    fetchCoordinates();
  }, [client]);

  // Mise à jour des statistiques en se basant sur l'ensemble des produits du client
  // Fonction pour convertir "monthly", "yearly", "biennial" en mois
  const billingCycleToMonths = (billingCycle) => {
    switch (billingCycle) {
      case "monthly":
        return 1;
      case "yearly":
        return 12;
      case "biennial":
        return 24;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (client?.products && client.products.length > 0) {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(now.getDate() + 31);

      let active = 0;
      let expiring = 0;
      let expired = 0;
      let totalPrice = 0;

      client.products.forEach((product) => {
        const { createdAt, billing_cycle, price } = product;
        totalPrice += price;

        if (!createdAt || !billing_cycle) return;

        // Calculer la renewalDate
        const monthsToAdd = billingCycleToMonths(billing_cycle);
        const renewalDate = new Date(createdAt);
        renewalDate.setMonth(renewalDate.getMonth() + monthsToAdd);
        renewalDate.setDate(renewalDate.getDate() - 1); // Soustraire un jour

        if (renewalDate > nextMonth) {
          active++;
        } else if (renewalDate > now && renewalDate <= nextMonth) {
          expiring++;
        } else {
          expired++;
        }
      });

      setStats({
        activeProducts: active,
        expiringSoon: expiring,
        expired,
        totalPrice,
      });
    }
  }, [client]);

  // Fonction pour supprimer un produit d'un client
  const deleteItem = async (productId) => {
    try {
      await deleteProductFromClient(clientId, productId);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      alert("Une erreur est survenue lors de la suppression du produit.");
    }
  };

  // Fonction pour basculer l'ordre du tri
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Appliquer le tri sur product_reference
  const sortedProducts = [...paginatedProducts].sort((a, b) => {
    const refA = Number(a.product_reference) || 0;
    const refB = Number(b.product_reference) || 0;
    return sortOrder === "asc" ? refA - refB : refB - refA;
  });

  if (clientLoading) return <p>Loading...</p>;
  if (clientError) return <p>Error: {clientError}</p>;

  return (
    <>
      <h1 className="text-3xl font-bold m-1.5 p-0.5 client-title">
        Client #CL0{client.client_reference}
      </h1>
      <div className="OneClientContainer">
        <div className="mapContainer">
          <div className="logoContainer">
            <img
              src={`${process.env.NEXT_PUBLIC_URLAPI}\\${client?.logo}`}
              alt={`Logo de ${client.name}`}
              className="client-logo"
            />
          </div>
          <div className="TheAddress">
            <h1>{client.name}</h1>
            <p className="flex">
              <MapPin style={{ color: theme === "dark" ? "#fff" : "#333" }} />{" "}
              {client?.address || "No address available"}
            </p>
          </div>
          <div className="TheAddressInMap">
            <Map coordinates={coordinates} />
          </div>
        </div>
        <div className="statiqueContainer">
          <StatCard
            title="Active Products"
            count={stats.activeProducts}
            className="activeProducts"
          />
          <StatCard
            title="Expiring Soon"
            count={stats.expiringSoon}
            className="expiringSoon"
          />
          <StatCard title="Expired" count={stats.expired} className="expired" />
          <StatCard
            title="Games Played"
            count={`${stats.totalPrice.toFixed(2)}MAD`}
            className="games"
          />
        </div>
      </div>
      <br />
      <div>
        {/* Barre de recherche pour filtrer les produits et gérer le tri */}
        <SearchBar onSearch={setSearchQuery} onSort={toggleSortOrder} />
      </div>
      <br />
      <div className="data">
        {/* Affichage des produits paginés triés */}
        <ClientTable data={sortedProducts} onDelete={deleteItem} />
        {totalPages > 1 && (
          <div className="mt-2 flex justify-center">
            <PaginationComponent
              currentPage={currentPage}
              setPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ClientPage;

function StatCard({ title, count, className }) {
  return (
    <div className={`statiquesDisplay ${className}`}>
      <h1 className="statiquesHeader">{title}</h1>
      <h2 className="nbrStatiques">{count}</h2>
    </div>
  );
}
