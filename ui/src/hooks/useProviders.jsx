// useProviders.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

export function useProviders() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour obtenir les en-têtes d'autorisation
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: token } : {};
  };

  // Fonction pour récupérer les fournisseurs
  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("[useProviders] Récupération des fournisseurs");
      const response = await axios.get(`${URLAPI}/providers`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });

      console.log("[useProviders] Réponse reçue:", response.status);

      if (response.data && Array.isArray(response.data.data)) {
        setProviders(response.data.data);
      } else {
        console.warn(
          "[useProviders] Structure de données inattendue:",
          response.data
        );
        setProviders([]);
        setError("Unexpected data format received from server");
      }
    } catch (error) {
      console.error("[useProviders] Erreur:", error);
      setError(error.response?.data?.message || "Failed to fetch providers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les fournisseurs au montage du composant
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Fonction pour obtenir les détails d'un fournisseur spécifique
  const getProviderById = useCallback(
    (id) => {
      return providers.find((provider) => provider._id === id) || null;
    },
    [providers]
  );

  return {
    providers,
    isLoading,
    error,
    fetchProviders,
    getProviderById,
  };
}
