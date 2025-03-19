// components/Map.js
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  maxWidth: '190px',
  maxHeight: '115px',
};

export default function Map({ coordinates }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Check if the API key is provided
  if (!apiKey) {
    return <p>Google Maps API key is not set.</p>;
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  if (!isLoaded) return <p>Loading map...</p>;
  if (!coordinates) return <p>No location available</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={coordinates}
      zoom={15}
    >
      <Marker position={coordinates} />
    </GoogleMap>
  );
}

