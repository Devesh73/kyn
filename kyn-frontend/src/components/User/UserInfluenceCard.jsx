import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";  // Assuming you have a Loader component for loading states

const UserInfluenceCard = ({ userId }) => {
  const [influence, setInfluence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfluence = async () => {
      try {
        const response = await axios.get(`/api/user-influence/${userId}`);
        setInfluence(response.data.influence);  // Assuming the response contains influence data
      } catch (error) {
        setError("Failed to load user influence.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInfluence();
    }
  }, [userId]);

  const calculateInfluencePercentage = (influence) => {
    if (!influence) return 0;
    const { betweenness_centrality, closeness_centrality, degree_centrality } = influence;
    // Normalize and combine the metrics to get a percentage out of 100
    const normalizedBetweenness = betweenness_centrality * 100;
    const normalizedCloseness = closeness_centrality * 100;
    const normalizedDegree = degree_centrality * 100;
    const totalInfluence = (normalizedBetweenness + normalizedCloseness + normalizedDegree) / 3;
    return totalInfluence.toFixed(2);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  const influencePercentage = calculateInfluencePercentage(influence);

  return (
    <div className="relative flex flex-col rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 p-6 shadow-2xl h-[380px] w-full md:w-1/2 lg:w-1/3 mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-4">User Influence</h2>
      <h3 className="text-sm font-semibold text-white mb-4">Influence for User {userId}</h3>
      
      {influence ? (
        <div className="flex mt-10 flex-col items-center">
          <div className="text-6xl font-bold text-white mb-4">{influencePercentage}%</div>
          <div className="text-lg font-medium text-white">Overall Influence</div>
        </div>
      ) : (
        <p className="text-sm text-gray-200">No influence data available for this user.</p>
      )}
    </div>
  );
};

export default UserInfluenceCard;