"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const API_ENDPOINT = process.env.NEXT_PUBLIC_URLAPI;

export function useOneClients(clientId) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  // États pour la recherche et la pagination des produits du client
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Fonction pour obtenir les en-têtes d'autorisation
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: token } : {};
  };

  const triggerReload = () => setReload(!reload);

  useEffect(() => {
    // Ne pas exécuter la requête si clientId est undefined ou null
    if (!clientId) {
      console.log("[useOneClients] clientId non défini, requête annulée");
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_ENDPOINT}/clients/${clientId}`;
        console.log(`[useOneClients] Fetching client data from: ${url}`);

        const response = await axios.get(url, {
          withCredentials: true,
          headers: getAuthHeaders(),
        });

        if (!response.data || !response.data.success) {
          throw new Error(
            response.data?.message || "Failed to fetch client data"
          );
        }

        console.log(
          `[useOneClients] Client data received:`,
          response.data.data
        );
        setClient(response.data.data);
      } catch (err) {
        console.error(`[useOneClients] Error:`, err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch client"
        );
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, reload]);

  // Fonction pour mettre à jour un client
  const updateClient = async (clientData) => {
    // Vérification que clientId existe
    if (!clientId) {
      console.error("[useOneClients] Update error: Client ID is required");
      return {
        success: false,
        message: "Client ID is required",
      };
    }

    setLoading(true);
    try {
      console.log(`[useOneClients] Updating client ID: ${clientId}`);
      console.log(`[useOneClients] Update data:`, clientData);

      const response = await axios.put(
        `${API_ENDPOINT}/clients/${clientId}`,
        clientData,
        {
          withCredentials: true,
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`[useOneClients] Update response:`, response.data);

      if (!response.data || !response.data.success) {
        throw new Error(
          response.data?.message || "Failed to update client data"
        );
      }

      setClient(response.data.data);
      return {
        success: true,
        message: "Client updated successfully",
        data: response.data.data,
      };
    } catch (err) {
      console.error(`[useOneClients] Update error:`, err);
      setError(
        err.response?.data?.message || err.message || "Failed to update client"
      );
      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to update client",
      };
    } finally {
      setLoading(false);
    }
  };

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
    loading,
    error,
    updateClient,
    triggerReload,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    paginatedProducts,
    totalPages,
  };
}
