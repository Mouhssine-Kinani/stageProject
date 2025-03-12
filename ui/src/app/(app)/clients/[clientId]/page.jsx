"use client";
import "./style.css";
import Map from "@/components/map/map";
import { getCoordinates } from "@/lib/geocode";
import { useState, useEffect } from "react";
import { useClient } from "@/hooks/useOneClients";

function ClientPage({ params }) {
  const [coordinates, setCoordinates] = useState(null);
  const { client, clientLoading, clientError } = useClient(params.clientId);

  const [stats, setStats] = useState({
    activeProducts: 0,
    expiringSoon: 0,
    expired: 0,
    totalPrice: 0,
  });

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

  useEffect(() => {
    if (client?.products) {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(now.getDate() + 31);

      let active = 0;
      let expiring = 0;
      let expired = 0;
      let totalPrice = 0;

      client.products.forEach((product) => {
        const dateFin = new Date(product.date_fin);
        totalPrice += product.price;

        if (dateFin > nextMonth) {
          active++;
        } else if (dateFin > now && dateFin <= nextMonth) {
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

  if (clientLoading) return <p>Loading...</p>;
  if (clientError) return <p>Error: {clientError}</p>;

  return (
    <>
      <h1>Client #CL0{client.client_reference}</h1>
      <div className="container">
        <div className="mapContainer">
          <div className="logoContainer"></div>
          <div className="TheAddress">
            {client?.address || "No address available"}
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
            count={`$${stats.totalPrice.toFixed(2)}`}
            className="games"
          />
        </div>
      </div>
      <div className="data">{/* <DataTable data={client} columns={}/> */}</div>
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
