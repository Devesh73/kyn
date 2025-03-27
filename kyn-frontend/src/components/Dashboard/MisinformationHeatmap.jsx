import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { AlertCircle } from "lucide-react";

// Create custom marker icon for regions
const createMarkerIcon = (urgency) => {
  const color = urgency === 'critical' ? '#ef4444' : 
                urgency === 'high' ? '#f59e0b' : 
                urgency === 'medium' ? '#22c55e' : '#3b82f6';
                
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color}; 
      width: 12px; 
      height: 12px; 
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.7);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);"
    ></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

// Heat Layer component to handle the heatmap
const HeatLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Make sure the Leaflet.heat library is properly loaded
    if (!L.heatLayer) {
      console.error("L.heatLayer is not available. Make sure leaflet.heat is properly imported.");
      return;
    }

    // Initialize the heat layer if it doesn't exist
    if (!heatLayerRef.current) {
      console.log("Initializing heat layer with", points.length, "points");
      try {
        heatLayerRef.current = L.heatLayer(points, {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          max: 1.0,
          minOpacity: 0.4,
          gradient: {
            0.2: '#3461A4', // Blue (low)
            0.4: '#FFFD84', // Yellow (moderate)
            0.6: '#FF9A00', // Orange (high)
            0.8: '#FF4900', // Orange-Red (very high)
            1.0: '#900C3F', // Dark Red (extreme)
          }
        }).addTo(map);

        // Force redraw
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

      } catch (error) {
        console.error("Error creating heat layer:", error);
      }
    } else {
      // Update the data if the layer already exists
      heatLayerRef.current.setLatLngs(points);
    }

    // Clean up
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, points]);

  return null; // This component doesn't render anything directly
};

// Clickable city markers component
const RegionMarkers = ({ regions, onRegionSelect }) => {
  const map = useMap();
  
  useEffect(() => {
    // Ensure map is properly sized
    map.invalidateSize();
  }, [map]);

  return (
    <>
      {regions.map((region, index) => (
        <Marker
          key={index}
          position={[region.lat, region.lng]}
          icon={createMarkerIcon(region.urgency)}
          eventHandlers={{
            click: () => {
              console.log("Region clicked:", region.name);
              onRegionSelect && onRegionSelect(region);
              
              // Optional: pan the map to center on clicked region
              map.setView([region.lat, region.lng], 6, {
                animate: true,
                duration: 0.5
              });
            }
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div className="p-1">
              <div className="font-bold text-slate-900">{region.name}</div>
              <div className="text-xs text-slate-600">Click for insights</div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};

const MisinformationHeatmap = ({ onRegionSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [regions, setRegions] = useState([]);
  const mapRef = useRef(null);

  // India's center coordinates
  const indiaCenter = [20.5937, 78.9629];
  
  // India bounding box
  const indiaBounds = [
    [8.0883, 68.7],  // Southwest corner
    [37.0902, 97.4]  // Northeast corner
  ];

  // Sample data with higher intensity values for better visibility
  const sampleMisinformationData = [
    // Delhi cluster (very high)
    [28.7041, 77.1025, 1.0],
    [28.6542, 77.2373, 0.95],
    [28.5273, 77.1389, 0.9],
    [28.6139, 77.2090, 0.85],
    [28.7128, 77.1855, 0.9],
    
    // Mumbai cluster (high)
    [19.0760, 72.8777, 0.85],
    [19.1136, 72.9053, 0.8],
    [18.9548, 72.8236, 0.75],
    [19.0330, 72.8342, 0.8],
    [19.0178, 72.8478, 0.75],
    
    // Bangalore cluster (moderate to high)
    [12.9716, 77.5946, 0.7],
    [13.0298, 77.5697, 0.65],
    [12.9352, 77.6245, 0.6],
    [12.9592, 77.6974, 0.65],
    
    // Kolkata cluster (moderate to high)
    [22.5726, 88.3639, 0.75],
    [22.6173, 88.4107, 0.7],
    [22.5958, 88.3698, 0.65],
    
    // Chennai cluster (moderate)
    [13.0827, 80.2707, 0.6],
    [13.1067, 80.2847, 0.55],
    [13.0473, 80.2756, 0.5],
    
    // Hyderabad cluster (moderate to high)
    [17.3850, 78.4867, 0.7],
    [17.4399, 78.4983, 0.65],
    [17.3616, 78.4747, 0.6],
    
    // Other major cities 
    [23.0225, 72.5714, 0.6],  // Ahmedabad
    [18.5204, 73.8567, 0.55], // Pune
    [26.8467, 80.9462, 0.9],  // Lucknow (high - UP elections)
    [26.9124, 75.7873, 0.6],  // Jaipur
    [25.5941, 85.1376, 0.75], // Patna
    [23.2599, 77.4126, 0.5],  // Bhopal
    [34.0837, 74.7973, 0.85], // Srinagar (high - sensitive region)
    [26.1445, 91.7362, 0.6],  // Guwahati
    
    // Rural areas with localized hotspots
    [25.3176, 82.9739, 0.8],  // Near Varanasi
    [29.9457, 78.1642, 0.7],  // Near Dehradun
    [15.4989, 73.8278, 0.5],  // Goa region
    [11.9416, 79.8083, 0.55], // Pondicherry
  ];

  // Define major regions with metadata for markers
  const majorRegions = [
    { 
      name: "Delhi",
      lat: 28.7041,
      lng: 77.1025,
      urgency: "critical",
      description: "High misinformation about elections and vaccines"
    },
    { 
      name: "Mumbai",
      lat: 19.0760,
      lng: 72.8777,
      urgency: "high",
      description: "Financial scams and housing market rumors"
    },
    { 
      name: "Bangalore",
      lat: 12.9716,
      lng: 77.5946,
      urgency: "medium",
      description: "Tech-related misinformation"
    },
    { 
      name: "Kolkata",
      lat: 22.5726,
      lng: 88.3639,
      urgency: "medium",
      description: "Political news manipulation"
    },
    { 
      name: "Chennai",
      lat: 13.0827,
      lng: 80.2707,
      urgency: "medium",
      description: "Film industry rumors"
    },
    { 
      name: "Hyderabad",
      lat: 17.3850,
      lng: 78.4867,
      urgency: "medium",
      description: "Tech and political rumors"
    },
    { 
      name: "Lucknow",
      lat: 26.8467,
      lng: 80.9462,
      urgency: "high",
      description: "Maha Kumbh Mela misinformation"
    },
    { 
      name: "Srinagar",
      lat: 34.0837,
      lng: 74.7973,
      urgency: "critical",
      description: "False claims during diplomatic tensions"
    }
  ];

  useEffect(() => {
    // Import leaflet.heat dynamically to ensure it's available
    const loadHeatPlugin = async () => {
      try {
        // Check if leaflet.heat is already available
        if (!L.heatLayer) {
          await import('leaflet.heat');
        }
        
        // Using sample data for now
        setHeatmapPoints(sampleMisinformationData);
        setRegions(majorRegions);
      } catch (error) {
        console.error("Error loading heat plugin:", error);
        setError("Failed to load heatmap plugin");
      } finally {
        setLoading(false);
      }
    };

    loadHeatPlugin();
  }, []);

  useEffect(() => {
    // Fix for map container display issues
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial fix for map rendering
    setTimeout(handleResize, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div className="relative flex flex-col rounded-xl bg-transparent p-4 shadow-2xl z-0 h-[500px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading misinformation heatmap...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col rounded-xl bg-transparent p-4 shadow-2xl z-0 h-[500px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col rounded-xl bg-transparent p-4 shadow-2xl z-0 h-[500px]">
      <h3 className="text-xl font-bold text-white mb-4">Misinformation Spread Heatmap</h3>
      <div className="text-sm text-gray-400 mb-2 flex items-center">
        <AlertCircle size={14} className="text-purple-500 mr-1" />
        <span>Click on city markers to view detailed misinformation insights</span>
      </div>
      
      <MapContainer
        center={indiaCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
        maxBoundsViscosity={1.0}
        minZoom={4}
        maxZoom={10}
        bounds={indiaBounds}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <HeatLayer points={heatmapPoints} />
        <RegionMarkers regions={regions} onRegionSelect={onRegionSelect} />
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 bg-black/70 p-2 rounded-md z-10">
        <div className="flex items-center text-xs">
          <div className="flex space-x-1">
            <span className="w-3 h-3 inline-block rounded-full bg-blue-600"></span>
            <span className="text-white mr-2">Low</span>
            
            <span className="w-3 h-3 inline-block rounded-full bg-yellow-400"></span>
            <span className="text-white mr-2">Moderate</span>
            
            <span className="w-3 h-3 inline-block rounded-full bg-orange-500"></span>
            <span className="text-white mr-2">High</span>
            
            <span className="w-3 h-3 inline-block rounded-full bg-red-700"></span>
            <span className="text-white">Extreme</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisinformationHeatmap;
