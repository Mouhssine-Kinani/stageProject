// lib/geocode.js
import axios from 'axios';
axios.defaults.withCredentials = true;
export async function getCoordinates(address) {
  if (!address) return null;

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    // const response = await axios.get(
    //   `https://maps.googleapis.com/maps/api/geocode/json`,
    //   {
    //     params: { address, key: apiKey },
    //   }
    // );

    // const location = response.data.results[0]?.geometry?.location;
    // return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}
