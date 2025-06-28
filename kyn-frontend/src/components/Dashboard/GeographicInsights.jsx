import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const GeographicInsights = ({ isDarkTheme }) => {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const realisticCoordinates = [
    { name: "New York", coordinates: [40.7128, -74.006] },
    { name: "London", coordinates: [51.5074, -0.1278] },
    { name: "Paris", coordinates: [48.8566, 2.3522] },
    { name: "Tokyo", coordinates: [35.6895, 139.6917] },
    { name: "Sydney", coordinates: [-33.8688, 151.2093] },
    { name: "Mumbai", coordinates: [19.076, 72.8777] },
    { name: "Cape Town", coordinates: [-33.9249, 18.4241] },
    { name: "Moscow", coordinates: [55.7558, 37.6173] },
    { name: "Beijing", coordinates: [39.9042, 116.4074] },
    { name: "Rio de Janeiro", coordinates: [-22.9068, -43.1729] },
    { name: "Cairo", coordinates: [30.0444, 31.2357] },
    { name: "Berlin", coordinates: [52.52, 13.405] },
    { name: "Buenos Aires", coordinates: [-34.6037, -58.3816] },
    { name: "Toronto", coordinates: [43.65107, -79.347015] },
    { name: "Rome", coordinates: [41.9028, 12.4964] },
    { name: "Seoul", coordinates: [37.5665, 126.978] },
    { name: "Singapore", coordinates: [1.3521, 103.8198] },
    { name: "Bangkok", coordinates: [13.7563, 100.5018] },
    { name: "Dubai", coordinates: [25.276987, 55.296249] },
    { name: "San Francisco", coordinates: [37.7749, -122.4194] },
    { name: "Istanbul", coordinates: [41.0082, 28.9784] },
    { name: "Hong Kong", coordinates: [22.3193, 114.1694] },
    { name: "Mexico City", coordinates: [19.4326, -99.1332] },
    { name: "Madrid", coordinates: [40.4168, -3.7038] },
    { name: "Jakarta", coordinates: [-6.2088, 106.8456] },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/geographic-insights");
        if (!response.ok) throw new Error("API error");
        await response.json(); // We're ignoring the API data as per the requirement.
      } catch (error) {
        console.warn("Using realistic coordinates instead.");
      } finally {
        setLocationData(realisticCoordinates);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-[590px] flex items-center justify-center hover:shadow-lg transition-shadow duration-200`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading geographic insights...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-[590px] flex items-center justify-center hover:shadow-lg transition-shadow duration-200`}>
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  const tileLayerUrl = isDarkTheme 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";


  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-md hover:shadow-xl transition-shadow duration-200 h-[590px] flex flex-col`}>
        {/* Title */}
        <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800/80' : 'border-purple-100/80'}`}>
            <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-indigo-50 border-indigo-200/80'} border shadow-sm`}>
                    {/* Icon for Geographic Insights */}
                    <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>Geographic Insights</h2>
            </div>
        </div>
        {/* Map */}
        <div className="flex-1 p-3">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                className="w-full h-full rounded"
                maxBounds={[
                [-90, -180],
                [90, 180],
                ]} // Prevent infinite zoom
                maxBoundsViscosity={1.0} // Smooth bounding
                maxZoom={18} // Limit max zoom
                minZoom={2} // Limit min zoom to prevent over zoom out
            >
                <TileLayer
                    url={tileLayerUrl}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {locationData.map(({ name, coordinates }) => (
                <Marker key={name} position={coordinates}>
                    <Tooltip>{name}</Tooltip>
                    <Popup>
                    <div>
                        <h3>{name}</h3>
                    </div>
                    </Popup>
                </Marker>
                ))}
            </MapContainer>
        </div>
    </div>
  );
};

export default React.memo(GeographicInsights);
