import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const useProductsStats = () => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fonction pour obtenir les en-têtes d'autorisation
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: token } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const searchParam = searchQuery ? `&search=${searchQuery}` : "";

        const requestUrl = `${process.env.NEXT_PUBLIC_URLAPI}/products?page=${currentPage}&limit=${itemsPerPage}${searchParam}`;

        console.log("[Products] Requête des produits:", requestUrl);

        const response = await axios.get(requestUrl, {
          withCredentials: true,
          headers: getAuthHeaders(),
        });

        console.log("[Products] Réponse:", response.data);

        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
          console.warn("[Products] Réponse sans données:", response.data);
        }

        // Fetch global stats
        const statsUrl = `${process.env.NEXT_PUBLIC_URLAPI}/products/stats`;
        console.log("[Products] Requête des statistiques:", statsUrl);

        const statsResponse = await axios.get(statsUrl, {
          withCredentials: true,
          headers: getAuthHeaders(),
        });

        console.log("[Products] Statistiques:", statsResponse.data);

        if (statsResponse.data && statsResponse.data.success) {
          setProductsCount(statsResponse.data.data);
        } else {
          console.warn(
            "[Products] Réponse des statistiques sans données:",
            statsResponse.data
          );
        }

        setError(null);
      } catch (error) {
        console.error("[Products] Erreur:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Erreur lors de la récupération des produits"
        );
        setProducts([]);
        setProductsCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Reset to page 1 when search query changes
    if (searchQuery !== "") {
      setCurrentPage(1);
    }

    fetchData();
  }, [currentPage, searchQuery, itemsPerPage]);

  return {
    products,
    productsCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
