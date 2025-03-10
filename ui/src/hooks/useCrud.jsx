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

  // Fetch data when page changes
  useEffect(() => {
    fetchData();
  }, [currentPage, Category]);

  return {
    data,
    error,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData
  };
}