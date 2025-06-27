import React, { useState, useEffect } from "react";
import axios from "axios";

const InfluenceAnalysisCard = () => {
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
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading top influencers...</p>
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
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200/80">
                    {/* Icon for Influence Analysis */}
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-800">Top Influencers</h2>
            </div>
        </div>

        {/* Scrollable influencers list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
            {topInfluencers.length ? (
            <ul className="space-y-2">
                {topInfluencers.map(([userId, centrality], index) => (
                <li key={index} className="rounded-md bg-white border border-slate-200/60 p-2.5 shadow-sm flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">
                        User ID: <span className="font-semibold text-slate-700">{userId}</span>
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                        Influence Score:{" "}
                        <span className="font-semibold text-green-600">
                            {(centrality*100).toFixed(2)}%
                        </span>
                    </p>
                </li>
                ))}
            </ul>
            ) : (
            <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-500">No top influencers available.</p>
            </div>
            )}
        </div>
    </div>
  );
};

export default React.memo(InfluenceAnalysisCard);
