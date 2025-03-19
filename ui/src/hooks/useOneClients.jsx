import { useState, useEffect, useCallback } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export function useClient(clientId) {
  const [client, setClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientError, setClientError] = useState(null);

  // États pour la recherche et la pagination des produits du client
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Nombre de produits par page
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Fonction pour récupérer les données du client directement utilisable pour les mises à jour
  const fetchClient = useCallback(async () => {
    setClientLoading(true);
    setClientError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_URLAPI;
      if (!API_URL)
        throw new Error("API URL is not defined in env variables");

      const response = await axios.get(`${API_URL}/clients/${clientId}`);
      if (response.data.success && response.data.data) {
        setClient(response.data.data);
      } else {
        throw new Error(`Failed to fetch the client ${clientId}`);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      setClientError(error.message || "Failed to fetch client data");
    } finally {
      setClientLoading(false);
    }
  }, [clientId]);

  // Chargement initial des données du client
  useEffect(() => {
    fetchClient();
  }, [clientId, fetchClient]);

  // Filtrer et paginer les produits du client
  useEffect(() => {
    if (client?.products) {
      let filtered = client.products;
      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.productName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      const pages = Math.ceil(filtered.length / productsPerPage) || 1;
      setTotalPages(pages);
      // Si le currentPage dépasse le nombre total de pages, on le réinitialise
      if (currentPage > pages) setCurrentPage(1);
      const start = (currentPage - 1) * productsPerPage;
      const paginated = filtered.slice(start, start + productsPerPage);
      setPaginatedProducts(paginated);
    }
  }, [client, searchQuery, currentPage]);

  return {
    client,
    clientLoading,
    clientError,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    paginatedProducts,
    totalPages,
    fetchClient, // Exporter la fonction pour permettre le rechargement des données
  };
}
