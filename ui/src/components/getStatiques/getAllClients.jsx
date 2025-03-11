import { useState, useEffect } from "react";
import axios from "axios";

export function useClients() {
  const [clients, setClients] = useState([]);
  const [clintsLoading, setClientLoading] = useState(true);
  const [ClientError, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_URLAPI;
        if (!API_URL)
          throw new Error("API URL is not defined in env variables");

        const response = await axios.get(`${API_URL}/clients`);
        if (response.data.success) {
          console.log("Clients reçus :", response.data.data); // ✅ Vérification
          // Ajouter totalPrice à chaque client
          const clientsWithTotalPrice = response.data.data.map(client => ({
            ...client,
            totalPrice: client.products?.reduce((sum, product) => sum + (product.price || 0), 0) || 0
          }));

          setClients(clientsWithTotalPrice);
          console.log("client with price : ", clientsWithTotalPrice)
        } else {
          throw new Error("Failed to fetch clients");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setClientLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, clintsLoading, ClientError };
}
