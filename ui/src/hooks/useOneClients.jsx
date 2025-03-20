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
  const productsPerPage = 5;
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchClient = useCallback(async () => {
    setClientLoading(true);
    setClientError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_URLAPI;
      if (!API_URL) {
        throw new Error("API URL is not defined in env variables");
      }

      console.log("Fetching client with ID:", clientId);
      const response = await axios.get(`${API_URL}/clients/${clientId}`);

      if (!response.data) {
        throw new Error("No data received from the server");
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch client data");
      }

      if (!response.data.data) {
        throw new Error("Client data is missing from the response");
      }

      if (!response.data.data._id) {
        throw new Error("Client ID is missing from the response data");
      }

      console.log("Client data received:", response.data.data);
      setClient(response.data.data);
    } catch (error) {
      console.error("Error fetching client:", error);

      // Gestion spécifique des erreurs
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        switch (error.response.status) {
          case 404:
            setClientError("Client not found");
            break;
          case 401:
            setClientError("Unauthorized access");
            break;
          case 403:
            setClientError("Access forbidden");
            break;
          case 500:
            setClientError("Server error. Please try again later");
            break;
          default:
            setClientError(
              error.response.data?.message || "Failed to fetch client data"
            );
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        setClientError("No response from server. Please check your connection");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        setClientError(error.message || "Failed to fetch client data");
      }
    } finally {
      setClientLoading(false);
    }
  }, [clientId]);

  // Chargement initial des données du client
  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId, fetchClient]);

  // Filtrer et paginer les produits du client
  useEffect(() => {
    if (client?.products) {
      let filtered = client.products;
      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      const pages = Math.ceil(filtered.length / productsPerPage) || 1;
      setTotalPages(pages);
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
    fetchClient,
    setClient,
  };
}
