import React, { useState, useEffect } from "react";
import axios from "axios";

const TrendingInterestsCard = ({ isDarkTheme }) => {
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
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-96 flex items-center justify-center hover:shadow-md transition-shadow duration-200`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading trending interests...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-96 flex items-center justify-center hover:shadow-md transition-shadow duration-200`}>
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-96`}>
      {/* Title */}
      <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800/80' : 'border-purple-100/80'}`}>
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/80'} border shadow-sm`}>
            {/* Icon for Trending Interests */}
            <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
            Trending Interests
          </h2>
        </div>
      </div>

      {/* Scrollable interests list */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isDarkTheme ? 'bg-neutral-900/50' : 'bg-slate-50/50'} scrollbar-custom`}>
        {trendingInterests.length ? (
          <ul className="space-y-2">
            {trendingInterests.map((item, index) => (
              <li key={index} className={`${isDarkTheme ? 'bg-neutral-800/50 hover:bg-neutral-700/60' : 'bg-slate-50/50 hover:bg-slate-100'} rounded p-2.5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between`}>
                <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Interest: <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-700'}`}>{item.interest}</span>
                </p>
                <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Count:{" "}
                  <span className="font-semibold text-green-500">{item.count}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>No trending interests available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TrendingInterestsCard);
