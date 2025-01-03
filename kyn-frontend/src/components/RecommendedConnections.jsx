import React, { useState, useEffect } from "react";

const RecommendedConnections = ({ userId }) => {
  const [recommendedConnections, setRecommendedConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recommended connections data from the API
    fetch(`/api/recommended-connections/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.recommended_connections) {
          setRecommendedConnections(data.recommended_connections);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommended connections:", error);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="w-full max-w-3xl p-4 border border-gray-300">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Recommended Connections</h2>

      {/* Loading State */}
      {loading ? (
        <p>Loading recommended connections...</p>
      ) : (
        <div
          className="h-96 overflow-y-auto border border-gray-200 p-2"
          style={{ maxHeight: "400px", maxWidth: "600px" }}
        >
          {recommendedConnections.length > 0 ? (
            recommendedConnections.map(([user1, user2, score], index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b border-gray-200"
              >
                <span>
                  {user1} and {user2}
                </span>
                <span>Score: {score.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p>No recommended connections found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendedConnections;
