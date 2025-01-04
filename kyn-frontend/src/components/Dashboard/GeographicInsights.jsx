import React, { useEffect, useState } from "react";

const GeographicInsights = () => {
  const [locationGroups, setLocationGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGeographicInsights = async () => {
      try {
        const response = await fetch("/api/geographic-insights");
        const data = await response.json();
        if (response.ok) {
          setLocationGroups(data);  // Store geographic data
        } else {
          setError("Failed to fetch geographic insights.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGeographicInsights();
  }, []);

  return (
    <div className="w-full max-w-md h-96 overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
      {loading ? (
        <div className="text-center text-gray-500">Loading geographic insights...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {Object.keys(locationGroups).length > 0 ? (
            Object.entries(locationGroups).map(([location, users]) => (
              <div key={location} className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{location}</h3>
                <ul className="list-disc pl-5">
                  {users.map((userId) => (
                    <li key={userId} className="text-gray-700">{userId}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No data available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeographicInsights;
