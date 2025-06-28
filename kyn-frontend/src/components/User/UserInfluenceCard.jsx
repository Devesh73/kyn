import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInfluenceCard = ({ userId, isDarkTheme }) => {
  const [influence, setInfluence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfluence = async () => {
      setLoading(true); // Reset loading state when userId changes
      setError(null);   // Reset error state when userId changes

      try {
        const response = await axios.get(`/api/user-influence/${userId}`);
        setInfluence(response.data.influence); // Assuming the response contains influence data
      } catch (error) {
        console.error("Error fetching user influence:", error);
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
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-slate-50/60'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/40'} shadow-sm p-4 h-96 flex items-center justify-center`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading user influence...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  const influencePercentage = calculateInfluencePercentage(influence);

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'} shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-96`}>
        <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'}`}>
            <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-indigo-50 border-indigo-200/80'} border shadow-sm`}>
                    <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>User Influence</h2>
            </div>
        </div>
      
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            {influence ? (
                <>
                    <div className={`text-6xl font-bold ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>{influencePercentage}%</div>
                    <div className={`text-lg font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Overall Influence</div>
                </>
            ) : (
                <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>No influence data available for this user.</p>
            )}
        </div>
    </div>
  );
};

export default UserInfluenceCard;
