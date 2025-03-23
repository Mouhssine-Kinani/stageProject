// lib/geocode.js
import axios from "axios";
axios.defaults.withCredentials = true;
export async function getCoordinates(address) {
  if (!address) return null;

  try {
    // Essayer d'abord sans clé API comme solution alternative
    console.log(
      "Sending request to Google Maps API without key with address:",
      address
    );
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: { address },
        withCredentials: false, // Désactiver withCredentials spécifiquement pour cette requête
      }
    );

    console.log("Google Maps API response status:", response.data.status);

    // Vérifier si la réponse est valide
    if (response.data.status === "OK") {
      const location = response.data.results[0]?.geometry?.location;
      return location
        ? { lat: location.lat, lng: location.lng }
        : getFallbackCoordinates(address);
    } else {
      console.error(
        "Geocoding API error:",
        response.data.status,
        response.data.error_message
      );
      return getFallbackCoordinates(address);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return getFallbackCoordinates(address);
  }
}

// Fonction pour obtenir des coordonnées de secours basées sur l'adresse
function getFallbackCoordinates(address) {
  console.log("Using fallback coordinates based on address:", address);

  // Coordonnées par défaut pour différentes villes marocaines
  const fallbackCoords = {
    "el jadida": { lat: 33.2316, lng: -8.5006 },
    casablanca: { lat: 33.5731, lng: -7.5898 },
    rabat: { lat: 34.0209, lng: -6.8416 },
    marrakech: { lat: 31.6295, lng: -7.9811 },
    tanger: { lat: 35.7673, lng: -5.7995 },
    agadir: { lat: 30.4278, lng: -9.5981 },
  };

  // Vérifier si l'adresse contient une ville connue
  const addressLower = address.toLowerCase();
  for (const city in fallbackCoords) {
    if (addressLower.includes(city)) {
      console.log(`Found fallback coordinates for ${city}`);
      return fallbackCoords[city];
    }
  }

  // Coordonnées par défaut du Maroc si aucune ville n'est trouvée
  console.log("No specific city found, using default Morocco coordinates");
  return { lat: 31.7917, lng: -7.0926 }; // Coordonnées centrales du Maroc
}
