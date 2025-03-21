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
        if (!API_URL) throw new Error("API URL is not defined in env variables");

        const response = await axios.get(`${API_URL}/products`);
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error };
}
