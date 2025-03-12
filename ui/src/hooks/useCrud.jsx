import { useState, useEffect } from "react";
import axios from "axios";

const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

export function useCrud(Category, searchQuery = "") {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const searchParam = searchQuery ? `&search=${searchQuery}` : "";
  //     // Add populate=true parameter for clients to get their products
  //     const populateParam = Category === "clients" ? "&populate=true" : "";
      
  //     const resp = await axios.get(
  //       `${URLAPI}/${Category}?page=${currentPage}&limit=${itemsPerPage}${searchParam}${populateParam}`
  //     );
      
  //     let processedData = resp.data.data || [];
      
  //     // If we're working with clients, calculate the total price for each client
  //     if (Category === "clients" && processedData.length > 0) {
  //       processedData = processedData.map(client => {
  //         // Calculate the total price of all products if products are populated
  //         const totalPrice = client.products && client.products.length > 0
  //           ? client.products.reduce((sum, product) => sum + (product.price || 0), 0)
  //           : 0;
            
  //         return {
  //           ...client,
  //           totalPrice
  //         };
  //       });
  //     }
      
  //     setData(processedData);
  //     setTotalPages(resp.data.totalPages || 1);
  //     setError(null);
  //   } catch (err) {
  //     console.error(`Error fetching ${Category}:`, err);
  //     setError(err);
  //     setData([]);
  //     setTotalPages(1);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const searchParam = searchQuery ? `&search=${searchQuery}` : "";
      const populateParam = Category === "clients" ? "&populate=true" : "";
  
      const resp = await axios.get(
        `${URLAPI}/${Category}?page=${currentPage}&limit=${itemsPerPage}${searchParam}${populateParam}`
      );
  
      setData(resp.data.data || []); // Les données incluent déjà totalPrice si backend mis à jour
      setTotalPages(resp.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${Category}:`, err);
      setError(err);
      setData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteItem = async (id) => {
    try {
      console.log(`Trying to delete item with ID: ${id}`);

      // Vérifie si la route nécessite "/delete/"
      const needsDeletePath = ["products", "clients"].includes(Category);
      const url = needsDeletePath
        ? `${URLAPI}/${Category}/delete/${id}`
        : `${URLAPI}/${Category}/${id}`;

      const response = await axios.delete(url);

      console.log("Delete response:", response.data);
      await fetchData(); // Recharge les données après suppression
    } catch (err) {
      console.error(`Error deleting ${Category}:`, err);
      setError(err);
    }
  };

  // New function to handle file validation
  const validateFile = (file, options = { maxSize: 102400, type: "image" }) => {
    if (!file) return { isValid: false, error: "No file provided" };

    // Check file type
    if (options.type === "image" && !file.type.startsWith("image/")) {
      return { isValid: false, error: "Please select an image file" };
    }

    // Check file size (default 100KB = 102400 bytes)
    if (file.size > options.maxSize) {
      return {
        isValid: false,
        error: `File must be less than ${Math.round(options.maxSize / 1024)}KB`,
      };
    }

    return { isValid: true, error: null };
  };

  // Create an item function
  const createItem = async (itemData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${URLAPI}/${Category}/create`,
        itemData
      );

      // Get total count to determine the last page
      const countResponse = await axios.get(
        `${URLAPI}/${Category}?page=1&limit=${itemsPerPage}`
      );
      const newTotalPages = countResponse.data.totalPages || 1;

      // Set to the last page where the new item will be
      setCurrentPage(newTotalPages);

      // Refresh data after successful creation
      await fetchData();
      setError(null);

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Server error";

      if (error.response?.data) {
        errorMessage =
          error.response.data.message ||
          "Server returned error: " + error.response.status;
      } else if (error.request) {
        errorMessage = "No response received from server";
      } else {
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

  // Fetch data when page, Category, or searchQuery changes
  useEffect(() => {
    fetchData();
  }, [currentPage, Category, searchQuery]);

  return {
    data,
    error,
    isLoading,
    deleteItem,
    createItem,
    validateFile,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
  };
}