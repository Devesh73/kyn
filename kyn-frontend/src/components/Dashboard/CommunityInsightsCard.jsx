import React, { useEffect, useState } from "react";
import { getCommunityInsights } from "../../services/communityInsights";
import Loader from "../Shared/Loader";

const CommunityInsightsCard = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityInsights = async () => {
      try {
        const data = await getCommunityInsights();
        setInsights(data);
      } catch (error) {
        setError(error.message || "Failed to load community insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityInsights();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Community Insights</h2>
      <p><strong>Number of Communities:</strong> {insights.number_of_communities}</p>
      <p><strong>Modularity:</strong> {insights.modularity}</p>

      {/* Communities Section with Scroll */}
      <h3 className="text-xl font-semibold mt-4">Communities:</h3>
      <div className="max-h-48 overflow-y-auto">
        <ul>
          {insights.communities.map((community, index) => (
            <li key={community.join(", ")} className="mb-2">
              <strong>Community {index + 1}:</strong> {community.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {/* Centrality Analysis Section with Scroll */}
      <h3 className="text-xl font-semibold mt-4">Centrality Analysis:</h3>
      <div className="max-h-48 overflow-y-auto">
        <ul>
          {Object.entries(insights.centrality.betweenness_centrality).map(([node, centrality], index) => (
            <li key={node} className="mb-2">
              {node}: {centrality.toFixed(4)}  {/* Limiting decimal places for better readability */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunityInsightsCard;
