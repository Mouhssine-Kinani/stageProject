import { useState, useEffect } from "react";
import axios from "axios";

export function useClient(clientId) {
  const [client, setClient] = useState(null);
  const [clientLoading, setLoading] = useState(true);
  const [clientError, setError] = useState(null);

  useEffect(() => {
    if (!clientId) return; // Évite d'exécuter la requête si l'ID est invalide

    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_URL = process.env.NEXT_PUBLIC_URLAPI;
        if (!API_URL) throw new Error("API URL is not defined in env variables");

        const response = await axios.get(`${API_URL}/clients/${clientId}`);
        if (response.data.success && response.data.data) {
          setClient(response.data.data);
        } else {
          throw new Error(`Failed to fetch the client ${clientId}`);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  return { client, clientLoading, clientError };
}
