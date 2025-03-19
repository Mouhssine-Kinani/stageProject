import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export function useProductsStats() {
  const [productsCount, setProductsCount] = useState({
    totalProducts: 0,
    activeProducts: 0,
    expiringSoonProducts: 0,
    expiredProducts: 0,
  });
  const [loadingProductsCount, setLoading] = useState(true);
  const [errorProductsCount, setError] = useState(null);

  useEffect(() => {
    const fetchProductsStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_URLAPI;
        if (!API_URL) throw new Error("API URL is not defined in env variables");

        const response = await axios.get(`${API_URL}/products/stats`);
        
        // Vérifie que l'objet contient bien les clés attendues
        const { totalProducts, activeProducts, expiringSoonProducts, expiredProducts } = response.data || {};

        setProductsCount({
          totalProducts: totalProducts ?? 0,
          activeProducts: activeProducts ?? 0,
          expiringSoonProducts: expiringSoonProducts ?? 0,
          expiredProducts: expiredProducts ?? 0,
        });

      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsStats();
  }, []);

  return { productsCount, loadingProductsCount, errorProductsCount };
}