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
