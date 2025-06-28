import React, { useState, useEffect } from "react";
import axios from "axios";

const ActiveCommunities = ({ isDarkTheme }) => {
  const [activeCommunities, setActiveCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveCommunities = async () => {
      try {
        const response = await axios.get("/api/active-communities");
        setActiveCommunities(response.data.active_communities || []);
      } catch (error) {
        setError("Failed to load active communities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCommunities();
  }, []);

  if (loading) {
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-sm p-4 h-96 flex items-center justify-center hover:shadow-lg transition-shadow duration-200`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading active communities...</p>
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

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-96`}>
      {/* Title */}
      <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800/80' : 'border-purple-100/80'}`}>
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/80'} border shadow-sm`}>
            {/* Icon for Active Communities */}
            <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-5M3 4h5v5M12 12a5 5 0 100-10 5 5 0 000 10z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          </div>
          <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
            Active Communities
          </h2>
        </div>
      </div>

      {/* Scrollable communities list */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isDarkTheme ? 'bg-neutral-900/50' : 'bg-slate-50/50'} scrollbar-custom`}>
        {activeCommunities.length ? (
          <ul className="space-y-2">
            {activeCommunities.map((community, index) => (
              <li
                key={index}
                className={`${isDarkTheme ? 'bg-neutral-800/50 hover:bg-neutral-700/60' : 'bg-slate-50/50 hover:bg-slate-100'} rounded p-2.5 shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Community ID:{" "}
                  <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-700'}`}>{community.community_id}</span>
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                    Activity Score:{" "}
                    <span className="font-semibold text-green-500">
                        {(community.activity_score) / 10}%
                    </span>
                    </p>
                    <p className={`text-xs font-medium ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                    Size:{" "}
                    <span className={`font-semibold ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`}>{community.size}</span>
                    </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                No active communities available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ActiveCommunities);
