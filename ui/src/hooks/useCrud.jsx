import { useState } from "react";
import axios from "axios";

const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

export function useCrud(Category) {
  const [error, setError] = useState(null);
  
  const deleteItem = async (id) => {
    try {
      console.log(`${URLAPI}/${Category}/${id}`);
      const resp = await axios.delete(`${URLAPI}/${Category}/${id}`);
      console.log(resp);
      return resp.data;
    } catch (err) {
      console.log(err);
      setError(err);
      throw err;
    }
  }

  return {
    deleteItem,
    error
  };
}