import axios from "axios";
axios.defaults.withCredentials = true;
const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

// Configuration pour les en-têtes d'authentification
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return {};
  return {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};

// Configuration pour les requêtes avec credentials
const apiConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Vérifier l'état d'authentification de l'utilisateur
 * @returns {Promise} Promesse avec le statut d'authentification et les données utilisateur
 */
export const checkAuth = async () => {
  try {
    const config = {
      ...apiConfig,
      headers: {
        ...apiConfig.headers,
        ...getAuthHeader(),
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_URLAPI}/auth/check-auth`,
      config
    );

    // Si la requête réussit, l'utilisateur est authentifié
    if (response.data.success) {
      // Mettre à jour les données utilisateur dans localStorage
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      return {
        isAuthenticated: true,
        user: response.data.user,
      };
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error(
      "[API] Erreur lors de la vérification de l'authentification:",
      error
    );

    // En cas d'erreur d'authentification, nettoyer le localStorage
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    }

    return { isAuthenticated: false, user: null, error };
  }
};

/**
 * Se connecter à l'application
 * @param {Object} credentials - Identifiants de connexion (email, password)
 * @returns {Promise} Promesse avec le résultat de la connexion
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URLAPI}/auth/signin`,
      credentials,
      apiConfig
    );

    if (response.data.success) {
      // Stocker le token et les données utilisateur dans localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));

      return {
        success: true,
        user: response.data.user,
      };
    }

    return { success: false, message: "Échec de connexion" };
  } catch (error) {
    console.error("[API] Erreur lors de la connexion:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erreur de connexion",
    };
  }
};

/**
 * Se déconnecter de l'application
 * @returns {Promise} Promesse avec le résultat de la déconnexion
 */
export const logout = async () => {
  try {
    await axios.get(`${process.env.NEXT_PUBLIC_URLAPI}/auth/logout`, {
      ...apiConfig,
      headers: {
        ...apiConfig.headers,
        ...getAuthHeader(),
      },
    });

    // Nettoyer le localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    return { success: true };
  } catch (error) {
    console.error("[API] Erreur lors de la déconnexion:", error);

    // Nettoyer quand même le localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    return {
      success: false,
      message: error.response?.data?.message || "Erreur de déconnexion",
    };
  }
};

export async function deleteProductFromClient(clientId, productId) {
  try {
    console.log(
      `Tentative de suppression du produit - clientId: ${clientId}, productId: ${productId}`
    );
    console.log(`URL API: ${URLAPI}/clients/${clientId}/product/${productId}`);

    const response = await axios.delete(
      `${URLAPI}/clients/${clientId}/product/${productId}`
    );
    console.log("Produit supprimé avec succès:", response.data);
    // Ici, vous pouvez mettre à jour l'état de votre composant pour retirer le produit de la liste affichée
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    console.error("Status code:", error.response?.status);
    console.error("Message d'erreur:", error.response?.data);
    // Gérez l'erreur (affichage d'un message à l'utilisateur, etc.)
    throw error;
  }
}

export async function addProductToClient(clientId, productData) {
  try {
    const response = await axios.post(
      `${URLAPI}/clients/${clientId}/product`,
      productData
    );
    console.log("Produit ajouté avec succès:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    throw error;
  }
}

export async function updateClient(clientId, clientData) {
  try {
    console.log("API updateClient - ID:", clientId);

    if (!clientId) {
      console.error("Client ID is missing");
      throw new Error("Client ID is required for update");
    }

    // Pour les formulaires avec fichiers (comme le logo), il faut utiliser FormData
    let data;
    let headers = {
      "Content-Type": "application/json",
    };

    // Si clientData est déjà une instance de FormData, on l'utilise directement
    if (clientData instanceof FormData) {
      data = clientData;
      console.log("API updateClient - Envoi avec FormData");
      // Supprimer le Content-Type pour que le navigateur définisse automatiquement le boundary correct
      headers = {};
    } else {
      // Sinon, on envoie les données JSON normales
      data = clientData;
      console.log("API updateClient - Envoi avec JSON:", clientData);
    }

    const url = `${URLAPI}/clients/edit/${clientId}`;
    console.log("API updateClient - URL:", url);

    const response = await axios.put(url, data, {
      headers,
      withCredentials: true,
    });

    console.log("Client mis à jour avec succès:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
}
