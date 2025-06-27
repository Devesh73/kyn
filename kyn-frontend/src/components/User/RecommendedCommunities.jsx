import React, { useState, useEffect } from "react";

const RecommendedCommunities = ({ userId }) => {
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
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading recommended communities...</p>
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
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm flex flex-col h-96">
        <div className="p-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200/80">
                    <svg
                        className="h-4 w-4 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-5M3 4h5v5M12 12a5 5 0 100-10 5 5 0 000 10z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a5 5 0 100 10 5 5 0 000-10z" />
                    </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-800">
                    Recommended Communities
                </h2>
            </div>
        </div>

      {/* Scrollable communities list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {recommendedCommunities.length ? (
          <ul className="space-y-2">
            {recommendedCommunities.map(({ community_id, shared_interests }, index) => (
              <li key={index} className="rounded-md bg-white border border-slate-200/60 p-2.5 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Community ID:{" "}
                  <span className="font-semibold text-slate-700">{community_id}</span>
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Shared Interests:{" "}
                  <span className="font-semibold text-emerald-600">{shared_interests}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">No recommended communities available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedCommunities;
