import React, { useState, useEffect } from "react";

const InteractionTrends = () => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    // Fetch interaction trends data from the API
    fetch("/api/interaction-trends")
      .then((response) => response.json())
      .then((data) => {
        if (data.interaction_trends) {
          setTrends(data.interaction_trends);
        }
      })
      .catch((error) => console.error("Error fetching interaction trends:", error));
  }, []);

  return (
    <div className="w-full max-w-3xl h-96 overflow-y-scroll border border-gray-300 p-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Interaction Trends</h2>

      {trends.length > 0 ? (
        trends.map((trend, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-gray-200">
            <span>{trend.date}</span>
            <span>{trend.interaction_count}</span>
          </div>
        ))
      ) : (
        <p>Loading trends...</p>
      )}
    </div>
  );
};

export default InteractionTrends;
