import { useState, useEffect } from "react";
import axios from "axios";

const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

export function useCrud(Category) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${URLAPI}/${Category}?page=${currentPage}&limit=${itemsPerPage}`);
      setData(resp.data.users || []);
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
      await axios.delete(`${URLAPI}/${Category}/${id}`);
      // Refresh data after successful deletion
      await fetchData();
      setError(null);
    } catch (err) {
      console.error(`Error deleting ${Category}:`, err);
      setError(err);
    }
  };

  // New function to handle file validation
  const validateFile = (file, options = { maxSize: 102400, type: 'image' }) => {
    if (!file) return { isValid: false, error: 'No file provided' };

    // Check file type
    if (options.type === 'image' && !file.type.startsWith('image/')) {
      return { isValid: false, error: 'Please select an image file' };
    }

    // Check file size (default 100KB = 102400 bytes)
    if (file.size > options.maxSize) {
      return { 
        isValid: false, 
        error: `File must be less than ${Math.round(options.maxSize / 1024)}KB` 
      };
    }

    return { isValid: true, error: null };
  };

  // New function to create an item
  const createItem = async (itemData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${URLAPI}/${Category}/create`, itemData);
      
      // Get total count to determine the last page
      const countResponse = await axios.get(`${URLAPI}/${Category}?page=1&limit=${itemsPerPage}`);
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
        errorMessage = error.response.data.message || 
                      "Server returned error: " + error.response.status;
      } else if (error.request) {
        errorMessage = "No response received from server";
      } else {
        errorMessage = error.message || "Error in request setup";
      }
      
      setError({ message: errorMessage });
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    fetchData();
  }, [currentPage, Category]);

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
    fetchData
  };
}