import React, { useState, useEffect } from "react";

const RecommendedCommunities = ({ userId, isDarkTheme }) => {
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); // Reset loading state when userId changes
    setError(null);   // Reset error state when userId changes

    // Fetch recommended communities data from the API
    fetch(`/api/recommended-communities/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.recommended_communities) {
          setRecommendedCommunities(data.recommended_communities);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommended communities:", error);
        setError("Failed to load recommended communities.");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-slate-50/60'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/40'} shadow-sm p-4 h-96 flex items-center justify-center`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading recommended communities...</p>
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

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'} shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-96`}>
        <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'}`}>
            <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-indigo-50 border-indigo-200/80'} border shadow-sm`}>
                    <svg
                        className={`h-4 w-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-5M3 4h5v5M12 12a5 5 0 100-10 5 5 0 000 10z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a5 5 0 100 10 5 5 0 000-10z" />
                    </svg>
                </div>
                <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
                    Recommended Communities
                </h2>
            </div>
        </div>

      {/* Scrollable communities list */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isDarkTheme ? 'bg-neutral-900/50 scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600' : 'bg-slate-50/50 scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300'} scrollbar-thin`}>
        {recommendedCommunities.length ? (
          <ul className="space-y-2">
            {recommendedCommunities.map(({ community_id, shared_interests }, index) => (
              <li key={index} className={`${isDarkTheme ? 'bg-neutral-800/50 hover:bg-neutral-700/60 border-neutral-700/60' : 'bg-white hover:bg-slate-100 border-slate-200/60'} rounded-md border p-2.5 shadow-sm hover:shadow-md transition-all duration-200`}>
                <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-300' : 'text-slate-500'}`}>
                  Community ID:{" "}
                  <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-700'}`}>{community_id}</span>
                </p>
                <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Shared Interests:{" "}
                  <span className="font-semibold text-emerald-500">{shared_interests}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>No recommended communities available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedCommunities;
