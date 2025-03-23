import { useState, useEffect } from "react";
import axios from "axios";

// Set the default to include credentials
axios.defaults.withCredentials = true;

const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

export function useCrud(Category, searchQuery = "") {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // useEffect(() => {
  //   console.log("data changed:", data);
  // }, [data]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch data when page, Category, or searchQuery changes
  useEffect(() => {
    fetchData();
  }, [currentPage, Category, searchQuery]);

  // Fonction pour obtenir les en-têtes d'autorisation
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    // S'assurer que le token est renvoyé tel quel (sans ajouter Bearer si déjà présent)
    if (!token) return {};

    if (token.startsWith("Bearer ")) {
      return { Authorization: token };
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const searchParam = searchQuery ? `&search=${searchQuery}` : "";
      const populateParam = Category === "clients" ? "&populate=true" : "";
      const requestUrl = `${URLAPI}/${Category}?page=${currentPage}&limit=${itemsPerPage}${searchParam}${populateParam}`;

      console.log(`Fetching data from: ${requestUrl}`);

      const resp = await axios.get(requestUrl, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      console.log(`${Category} API response:`, resp.data);

      if (!resp.data.data) {
        console.warn(
          `No data array found in ${Category} response. Full response:`,
          resp.data
        );
      }

      setData(resp.data.data || []);
      setTotalPages(resp.data.totalPages || 1);
      console.log(`${Category} data set to:`, resp.data.data);
      setError(null);
      return resp.data;
    } catch (err) {
      console.error(`Error fetching ${Category}:`, err);
      if (err.response) {
        console.error("Response error data:", err.response.data);
      }
      setError(err);
      setData([]);
      setTotalPages(1);
      return {
        success: false,
        error: err.message || "An error occurred while fetching data",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setIsLoading(true);

      // Vérifie si la route nécessite "/delete/"
      const needsDeletePath = ["products", "clients"].includes(Category);
      const url = needsDeletePath
        ? `${URLAPI}/${Category}/delete/${id}`
        : `${URLAPI}/${Category}/${id}`;

      console.log(`Deleting item from: ${url}`);

      const response = await axios.delete(url, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      console.log(`Delete response:`, response.data);

      // Recharger les données après suppression
      await fetchData();

      return {
        success: true,
        message: `${Category.slice(0, -1)} deleted successfully`,
        data: response.data,
      };
    } catch (err) {
      console.error(`Error deleting ${Category}:`, err);

      // Obtenir un message d'erreur détaillé si disponible
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to delete ${Category.slice(0, -1)}`;

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // File validation function
  const validateFile = (
    file,
    options = { maxSize: 1024000, type: "image" }
  ) => {
    if (!file) return { valid: false, error: "No file provided" };

    const fileSize = file.size;
    const fileType = file.type;

    if (fileSize > options.maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${options.maxSize / 1024} KB`,
      };
    }

    if (options.type === "image" && !fileType.includes("image/")) {
      return { valid: false, error: "File must be an image" };
    }

    return { valid: true };
  };

  // Create an item function
  const createItem = async (itemData) => {
    setIsLoading(true);
    try {
      let url = `${URLAPI}/${Category}`;
      let formData = null;
      let headers = getAuthHeaders(); // Utiliser les en-têtes d'autorisation

      // Check if we need to handle file uploads
      const hasFile = itemData instanceof FormData;

      if (hasFile) {
        formData = itemData;
        // For FormData, do not set Content-Type header
      } else {
        // For regular JSON data
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      console.log(`Creating ${Category} with URL: ${url}`);
      console.log("Data being sent:", hasFile ? "[FormData]" : itemData);

      const response = await axios.post(url, formData || itemData, {
        headers,
        withCredentials: true,
      });

      console.log(`${Category} created:`, response.data);

      // Reload data after creating new item
      await fetchData();

      return {
        success: true,
        message: `${Category.slice(0, -1)} created successfully`,
        data: response.data,
      };
    } catch (err) {
      console.error(`Error creating ${Category}:`, err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to create ${Category.slice(0, -1)}`;

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update an item function
  const updateItem = async (id, itemData) => {
    setIsLoading(true);
    try {
      let url = `${URLAPI}/${Category}/${id}`;
      let formData = null;
      let headers = getAuthHeaders(); // Utiliser les en-têtes d'autorisation

      // Check if we need to handle file uploads
      const hasFile = itemData instanceof FormData;

      if (hasFile) {
        formData = itemData;
        // Pour FormData, ne pas définir l'en-tête Content-Type
      } else {
        // Pour les données JSON standard
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      console.log(`Updating ${Category} with ID ${id} at URL: ${url}`);
      console.log("Update data:", hasFile ? "[FormData]" : itemData);

      const response = await axios.put(url, formData || itemData, {
        headers,
        withCredentials: true,
      });

      console.log(`${Category} updated:`, response.data);

      // Reload data after updating
      await fetchData();

      return {
        success: true,
        message: `${Category.slice(0, -1)} updated successfully`,
        data: response.data,
      };
    } catch (err) {
      console.error(`Error updating ${Category}:`, err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to update ${Category.slice(0, -1)}`;

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    error,
    isLoading,
    deleteItem,
    createItem,
    updateItem,
    validateFile,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
  };
}
