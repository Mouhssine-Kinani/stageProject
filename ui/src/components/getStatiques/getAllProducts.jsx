import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_URLAPI;
        console.log("[useProducts] URL API:", API_URL);

        if (!API_URL) {
          console.error(
            "[useProducts] API URL is not defined in env variables"
          );
          throw new Error("API URL is not defined in env variables");
        }

        // Récupérer le token d'authentification depuis localStorage
        const token = localStorage.getItem("authToken");
        const headers = token
          ? {
              Authorization: token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`,
            }
          : {};

        console.log(
          "[useProducts] Fetching products from:",
          `${API_URL}/products`
        );
        console.log("[useProducts] Headers:", headers);

        const response = await axios.get(`${API_URL}/products`, {
          headers,
          withCredentials: true,
        });
        console.log(
          "[useProducts] Response received:",
          response.status,
          response.data
        );

        if (response.data.success) {
          console.log(
            "[useProducts] Products fetched successfully:",
            response.data.data.length
          );
          setProducts(response.data.data);
        } else {
          console.error(
            "[useProducts] Failed to fetch products:",
            response.data
          );
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        console.error("[useProducts] Error:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    console.log("[useProducts] Component mounted, fetching products...");
    fetchProducts();
  }, []);

  return { products, loading, error };
}
