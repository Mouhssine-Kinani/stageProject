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

        if (!userId || !token) {
          console.log("Authentication credentials missing");
          setLoading(false);
          return;
        }

        // Afficher plus de détails pour déboguer
        console.log("Trying to fetch user with ID:", userId);
        console.log("API URL:", `${URLAPI}/users/${userId}`);
        console.log("Using token:", token.substring(0, 15) + "...");

        const response = await axios.get(`${URLAPI}/users/${userId}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User response:", response.data);
        setUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user:", err.response || err.message);
        setError(err);

        // Si l'erreur est liée à l'authentification, on peut essayer de rediriger
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          console.log("Authentication error, clearing cookies");
          Cookies.remove("token");
          Cookies.remove("userId");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useUser;
