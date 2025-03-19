import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export function useProductsStats() {
  // État pour les statistiques
  const [productsCount, setProductsCount] = useState({
    totalProducts: 0,
    activeProducts: 0,
    expiringSoonProducts: 0,
    expiredProducts: 0,
  });

  // État pour les produits
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_URLAPI;

  // Fetch statistics
  useEffect(() => {
    const fetchProductsStats = async () => {
      try {
        if (!API_URL)
          throw new Error("API URL is not defined in env variables");

        const response = await axios.get(`${API_URL}/products/stats`);

        // Vérifie que l'objet contient bien les clés attendues
        const {
          totalProducts,
          activeProducts,
          expiringSoonProducts,
          expiredProducts,
        } = response.data || {};

        setProductsCount({
          totalProducts: totalProducts ?? 0,
          activeProducts: activeProducts ?? 0,
          expiringSoonProducts: expiringSoonProducts ?? 0,
          expiredProducts: expiredProducts ?? 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      }
    };

    fetchProductsStats();
  }, [API_URL]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!API_URL)
          throw new Error("API URL is not defined in env variables");

        setLoading(true);
        const searchParam = searchQuery ? `&search=${searchQuery}` : "";
        const response = await axios.get(
          `${API_URL}/products?page=${currentPage}&limit=50${searchParam}`
        );

        if (response.data.success) {
          setProducts(response.data.data || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL, currentPage, searchQuery]);

  return {
    products,
    productsCount,
    isLoading: loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
