import React, { useState, useEffect } from "react";
import axios from "axios";

const InfluenceAnalysisCard = () => {
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopInfluencers = async () => {
      try {
        const response = await axios.get("/api/influence-analysis");
        setTopInfluencers(response.data.top_influencers);
      } catch (error) {
        setError("Failed to load top influencers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopInfluencers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Influencers</h2>
      {topInfluencers.length ? (
        <ul className="space-y-2">
          {topInfluencers.map(([userId, centrality], index) => (
            <li key={index} className="border-b pb-2">
              <div>
                <strong>User ID:</strong> {userId}
              </div>
              <div>
                <strong>Centrality:</strong> {centrality.toFixed(4)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No top influencers available.</p>
      )}
    </div>
  );
};

export default InfluenceAnalysisCard;
