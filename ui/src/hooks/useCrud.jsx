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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const searchParam = searchQuery ? `&search=${searchQuery}` : "";
      const populateParam = Category === "clients" ? "&populate=true" : "";
      const requestUrl = `${URLAPI}/${Category}?page=${currentPage}&limit=${itemsPerPage}${searchParam}${populateParam}`;

      console.log(`Fetching data from: ${requestUrl}`);

      const resp = await axios.get(requestUrl, { withCredentials: true });
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

      const response = await axios.delete(url);
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
        `Failed to delete ${Category}`;

      setError({
        message: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
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
    if (!file) return { isValid: false, error: "No file provided" };

    // Check file type
    if (options.type === "image" && !file.type.startsWith("image/")) {
      return { isValid: false, error: "Please select an image file" };
    }

    // Check file size (default 1MB = 1024000 bytes)
    if (file.size > options.maxSize) {
      const sizeInMB = (options.maxSize / (1024 * 1024)).toFixed(1);
      return {
        isValid: false,
        error: `File must be less than ${sizeInMB}MB`,
      };
    }

    return { isValid: true, error: null };
  };

  // Create an item function
  const createItem = async (itemData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      // If itemData contains a file, we need to use FormData
      let containsFile = false;

      // Check if any value is a File
      Object.keys(itemData).forEach((key) => {
        if (itemData[key] instanceof File) {
          containsFile = true;
          formData.append(key, itemData[key]);
        } else if (itemData[key] !== null && itemData[key] !== undefined) {
          if (typeof itemData[key] === "object") {
            console.log(
              `createItem - Processing object field '${key}':`,
              itemData[key]
            );
            formData.append(key, JSON.stringify(itemData[key]));
          } else {
            formData.append(key, itemData[key]);
          }
        }
      });

      const config = {
        headers: {
          "Content-Type": containsFile
            ? "multipart/form-data"
            : "application/json",
        },
        withCredentials: true,
      };

      const url = `${URLAPI}/${Category}/create`;
      console.log(`Creating item at: ${url}`, itemData);

      // For debugging - log what's actually being sent
      if (containsFile) {
        console.log("Using FormData with these entries:");
        for (let pair of formData.entries()) {
          console.log(
            `- ${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`
          );
        }
      } else {
        console.log("Using JSON payload:", itemData);
      }

      const response = await axios.post(
        url,
        containsFile ? formData : itemData,
        config
      );

      console.log(`Create response:`, response.data);

      // Recharger les données après création
      await fetchData();

      setError(null);
      return {
        success: true,
        message: `${Category.slice(0, -1)} created successfully`,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error creating ${Category}:`, error);

      let errorMessage = "Server error";

      if (error.response?.data) {
        console.error("Server error response:", error.response.data);
        errorMessage =
          error.response.data.message ||
          "Server returned error: " + error.response.status;
      } else if (error.request) {
        console.error("No response received from server");
        errorMessage = "No response received from server";
      } else {
        console.error("Error in request setup:", error.message);
        errorMessage = error.message || "Error in request setup";
      }

      setError({ message: errorMessage });
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update an item function
  const updateItem = async (id, itemData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      let containsFile = false;

      console.log(`updateItem - Initial data:`, itemData);

      // Check if any value is a File
      Object.keys(itemData).forEach((key) => {
        if (itemData[key] instanceof File) {
          containsFile = true;
          console.log(
            `updateItem - File detected in field '${key}'`,
            itemData[key].name
          );
          formData.append(key, itemData[key]);
        } else if (itemData[key] !== null && itemData[key] !== undefined) {
          if (typeof itemData[key] === "object") {
            console.log(
              `updateItem - Stringify object for field '${key}'`,
              itemData[key]
            );
            formData.append(key, JSON.stringify(itemData[key]));
          } else {
            console.log(`updateItem - Adding field '${key}'`, itemData[key]);
            formData.append(key, itemData[key]);
          }
        }
      });

      const config = {
        headers: {
          "Content-Type": containsFile
            ? "multipart/form-data"
            : "application/json",
        },
        withCredentials: true,
      };

      // Assure that we are using the correct path
      const url = `${URLAPI}/${Category}/edit/${id}`;
      console.log(`Updating item at: ${url}`, itemData);
      console.log(
        `Request uses ${containsFile ? "FormData (multipart)" : "JSON"}`
      );

      if (containsFile) {
        // For debugging - show formData contents
        for (let pair of formData.entries()) {
          console.log(
            `FormData contains: ${pair[0]}: ${
              pair[1] instanceof File ? pair[1].name : pair[1]
            }`
          );
        }
      }

      const response = await axios.put(
        url,
        containsFile ? formData : itemData,
        config
      );

      console.log(`Update response:`, response.data);

      // Recharger les données après mise à jour
      await fetchData();

      setError(null);
      return {
        success: true,
        message: `${Category.slice(0, -1)} updated successfully`,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error updating ${Category}:`, error);

      let errorMessage = "Server error";

      if (error.response?.data) {
        console.error("Response error data:", error.response.data);
        errorMessage =
          error.response.data.message ||
          "Server returned error: " + error.response.status;
      } else if (error.request) {
        console.error("No response received from server");
        errorMessage = "No response received from server";
      } else {
        console.error("Error in request setup:", error.message);
        errorMessage = error.message || "Error in request setup";
      }

      setError({ message: errorMessage });
      return {
        success: false,
        error: errorMessage,
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
