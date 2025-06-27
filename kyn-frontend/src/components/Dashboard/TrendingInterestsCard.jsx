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
        setTrendingInterests(response.data.trending_interests || []);
      } catch (error) {
        setError("Failed to load trending interests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingInterests();
  }, []);

  if (loading) {
    return (
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading trending interests...</p>
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
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg border border-slate-200/80 shadow-lg shadow-indigo-500/10 flex flex-col h-96">
      {/* Title */}
      <div className="p-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/80">
            {/* Icon for Trending Interests */}
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-slate-800">
            Trending Interests
          </h2>
        </div>
      </div>

      {/* Scrollable interests list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {trendingInterests.length ? (
          <ul className="space-y-2">
            {trendingInterests.map((item, index) => (
              <li key={index} className="rounded-md bg-white border border-slate-200/60 p-2.5 shadow-sm flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">
                  Interest: <span className="font-semibold text-slate-700">{item.interest}</span>
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Count:{" "}
                  <span className="font-semibold text-green-600">{item.count}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">No trending interests available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TrendingInterestsCard);
