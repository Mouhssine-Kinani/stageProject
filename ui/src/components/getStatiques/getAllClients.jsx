import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export function useClientsCount() {
  const [clientsCount, setClientsCount] = useState(0);
  const [clintsLoading, setLoading] = useState(true);
  const [ClientError, setError] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_URLAPI;
        if (!API_URL) throw new Error("API URL is not defined in env variables");

        const response = await axios.get(`${API_URL}/clients/count`);
        if (response.data.success) {
          setClientsCount(response.data.count);
        } else {
          throw new Error("Failed to fetch clients count");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return { clientsCount, clintsLoading, ClientError };
}
