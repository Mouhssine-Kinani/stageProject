// useUser.js
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;
const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = Cookies.get("userId");
        const token = Cookies.get("token");
        console.log("Token from cookie:", token);
        console.log("UserId from cookie:", userId);
  
        if (!userId) {
          throw new Error("Authentication userId details not found");
        }
        if (!token) {
          throw new Error("Authentication token details not found");
        }

        const response = await axios.get(`${URLAPI}/users/${userId}`, {
          withCredentials: true,  // ✅ Important pour récupérer les cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("User response:", response.data);
        setUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user:", err.response || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  return { user, loading, error };
};

export default useUser;
