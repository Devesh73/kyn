import React, { useState, useEffect } from "react";
import axios from "axios";
import { FixedSizeList as List } from "react-window";

const InfluenceAnalysisCard = ({ isDarkTheme }) => {
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopInfluencers = async () => {
      try {
        const response = await axios.get("/api/influence-analysis");
        setTopInfluencers(response.data.top_influencers || []);
      } catch (error) {
        setError("Failed to load top influencers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopInfluencers();
  }, []);

  if (loading) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-96 flex items-center justify-center hover:shadow-lg transition-shadow duration-200`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading top influencers...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-96 flex items-center justify-center hover:shadow-lg transition-shadow duration-200`}>
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  const Row = ({ index, style }) => {
    const [userId, centrality] = topInfluencers[index];
    return (
      <div style={style} className={`px-3 py-1 flex items-center justify-between ${isDarkTheme ? 'hover:bg-neutral-800/50' : 'hover:bg-slate-100'} rounded transition-all duration-200 hover:shadow-sm`}>
        <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'} truncate`}>
          User ID: <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-700'}`}>{userId}</span>
        </p>
        <p className={`text-xs font-medium ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
          { (centrality*100).toFixed(2) }%
        </p>
      </div>
    );
  }

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-96`}>
        {/* Title */}
        <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800/80' : 'border-purple-100/80'}`}>
            <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-indigo-50 border-indigo-200/80'} border shadow-sm`}>
                    {/* Icon for Influence Analysis */}
                    <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>Top Influencers</h2>
            </div>
        </div>

        {/* Scrollable influencers list with virtualization */}
        <div className={`flex-1 overflow-y-auto ${isDarkTheme ? 'bg-neutral-900/50' : 'bg-slate-50/50'} scrollbar-custom`}>
            {topInfluencers.length ? (
              <List
                height={380}
                itemCount={topInfluencers.length}
                itemSize={55}
                width="100%"
              >
                {Row}
              </List>
            ) : (
              <div className="h-full flex items-center justify-center">
                  <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>No top influencers available.</p>
              </div>
            )}
        </div>
    </div>
  );
};

export default React.memo(InfluenceAnalysisCard);
