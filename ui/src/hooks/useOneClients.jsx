import { useState, useEffect } from "react";
import axios from "axios";

export function useClient(clientId) {
  const [client, setClient] = useState(null);
  const [clientLoading, setLoading] = useState(true);
  const [clientError, setError] = useState(null);

  // États pour la recherche et la pagination des produits du client
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!clientId) return; // Évite d'exécuter la requête si l'ID est invalide

    const fetchClient = async () => {
      setLoading(true);
      setError(null);
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
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

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
      const pages = Math.ceil(filtered.length / itemsPerPage) || 1;
      setTotalPages(pages);
      // Si le currentPage dépasse le nombre total de pages, on le réinitialise
      if (currentPage > pages) setCurrentPage(1);
      const start = (currentPage - 1) * itemsPerPage;
      const paginated = filtered.slice(start, start + itemsPerPage);
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
  };
}
