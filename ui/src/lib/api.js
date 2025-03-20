import axios from "axios";
axios.defaults.withCredentials = true;
const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

export async function deleteProductFromClient(clientId, productId) {
  try {
    const response = await axios.delete(
      `${URLAPI}/clients/${clientId}/product/${productId}`
    );
    console.log("Produit supprimé avec succès:", response.data);
    // Ici, vous pouvez mettre à jour l'état de votre composant pour retirer le produit de la liste affichée
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
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
