"use client";
import "./style.css";
import Map from "@/components/map/map";
import { getCoordinates } from "@/lib/geocode";
import { useState, useEffect, use } from "react";
import { useClient } from "@/hooks/useOneClients";
import { MapPin } from "lucide-react";
import { ClientTable } from "./columns";
import SearchBar from "@/components/serchBar/Search";
import { PaginationDemo } from "@/components/pagination/pagination";
import { deleteProductFromClient } from "@/lib/api"; // Assurez-vous que cette fonction est exportée correctement

function ClientPage({ params }) {
  const { clientId } = use(params); // Déstructuration avec `use()`
  
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

  if (clientLoading) return <p>Loading...</p>;
  if (clientError) return <p>Error: {clientError}</p>;

  return (
    <>
      <h1 className="clientTitle">Client #CL0{client.client_reference}</h1>
      <div className="container">
        <div className="mapContainer">
          <div className="logoContainer">
            {client?.logo || "No logo available"}
          </div>
          <div className="TheAddress">
            <h1>{client.name}</h1>
            <p className="flex">
              <MapPin /> {client?.address || "No address available"}
            </p>
          </div>
          <div className="TheAddressInMap">
            <Map coordinates={coordinates} />
          </div>
        </div>
        <div className="statiqueContainer">
          <StatCard title="Active Products" count={stats.activeProducts} className="activeProducts" />
          <StatCard title="Expiring Soon" count={stats.expiringSoon} className="expiringSoon" />
          <StatCard title="Expired" count={stats.expired} className="expired" />
          <StatCard title="Games Played" count={`${stats.totalPrice.toFixed(2)}MAD`} className="games" />
        </div>
      </div>
      <br />
      <div>
        {/* Barre de recherche pour filtrer les produits */}
        <SearchBar onSearch={setSearchQuery} onDelete={deleteItem} />
      </div>
      <br />
      <div className="data">
        {/* Affichage des produits paginés */}
        <ClientTable data={paginatedProducts} onDelete={deleteItem} />
        {totalPages > 1 && (
          <div className="mt-2 flex justify-center">
            <PaginationDemo
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
