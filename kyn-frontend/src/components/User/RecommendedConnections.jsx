import React, { useState, useEffect } from "react";

const RecommendedConnections = ({ userId }) => {
  const [recommendedConnections, setRecommendedConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); // Reset loading state when userId changes
    setError(null);   // Reset error state when userId changes

    // Fetch recommended connections data from the API
    fetch(`/api/recommended-connections/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.recommended_connections) {
          const filteredConnections = data.recommended_connections.filter(
            ([, , score]) => score > 0
          );
          setRecommendedConnections(filteredConnections);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommended connections:", error);
        setError("Failed to load recommended connections.");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading recommended connections...</p>
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
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-800">
                    Recommended Connections
                </h2>
            </div>
        </div>
      
      {/* Scrollable connections list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {recommendedConnections.length ? (
          <ul className="space-y-2">
            {recommendedConnections.map(([user1, user2, score], index) => (
              <li key={index} className="rounded-md bg-white border border-slate-200/60 p-2.5 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  {user1} and {user2}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Score:{" "}
                  <span className="font-semibold text-emerald-600">{(score * 100).toFixed(2)}%</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">No recommended connections available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedConnections;
