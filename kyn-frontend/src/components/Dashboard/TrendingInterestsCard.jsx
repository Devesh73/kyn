import React, { useState, useEffect } from "react";
import axios from "axios";

const TrendingInterestsCard = () => {
  const [trendingInterests, setTrendingInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingInterests = async () => {
      try {
        const response = await axios.get("/api/trending-interests");
        setTrendingInterests(response.data.trending_interests);
      } catch (error) {
        setError("Failed to load trending interests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingInterests();
  }, []);

  if (loading) {
    return <div>Loading trending interests...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Trending Interests</h2>
      {trendingInterests.length ? (
        <ul className="space-y-2">
          {trendingInterests.map((item, index) => (
            <li key={index} className="border-b pb-2">
              <div>
                <strong>{item.interest}</strong>
              </div>
              <div>
                <strong>Count:</strong> {item.count}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trending interests available.</p>
      )}
    </div>
  );
};

export default TrendingInterestsCard;
