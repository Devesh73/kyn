import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icons not displaying correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Predefined coordinates for locations
const locationCoordinates = {
  Aaronburgh: [52.52, 13.405], // Berlin
  Adamtown: [48.8566, 2.3522], // Paris
  Alanland: [40.7128, -74.006], // New York
  Alanmouth: [34.0522, -118.2437], // Los Angeles
  Alexanderville: [35.6895, 139.6917], // Tokyo
  Alexandriaport: [51.5074, -0.1278], // London
  Allenberg: [55.7558, 37.6173], // Moscow
  Alvarezfurt: [28.6139, 77.209], // New Delhi
};

const WorldMap = () => {
  const [locationGroups, setLocationGroups] = useState({});

  useEffect(() => {
    // Fetch geographic insights from the API
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/geographic-insights");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setLocationGroups(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[20, 0]} // Approximate center of the world
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(locationGroups).map(([name, users]) => {
          const coords = locationCoordinates[name];
          if (!coords) return null; // Skip if no coordinates for the location
          return (
            <Marker key={name} position={coords}>
              <Popup>
                <strong>{name}</strong>
                <br />
                Users: {users.join(", ")}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
