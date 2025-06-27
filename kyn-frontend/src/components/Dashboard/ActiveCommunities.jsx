import React, { useState, useEffect } from "react";
import axios from "axios";

const ActiveCommunities = () => {
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
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading active communities...</p>
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
            {/* Icon for Active Communities */}
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-5M3 4h5v5M12 12a5 5 0 100-10 5 5 0 000 10z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-slate-800">
            Active Communities
          </h2>
        </div>
      </div>

      {/* Scrollable communities list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {activeCommunities.length ? (
          <ul className="space-y-2">
            {activeCommunities.map((community, index) => (
              <li
                key={index}
                className="rounded-md bg-white border border-slate-200/60 p-2.5 shadow-sm"
              >
                <p className="text-xs font-medium text-slate-500">
                  Community ID:{" "}
                  <span className="font-semibold text-slate-700">{community.community_id}</span>
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs font-medium text-slate-500">
                    Activity Score:{" "}
                    <span className="font-semibold text-green-600">
                        {(community.activity_score) / 10}%
                    </span>
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                    Size:{" "}
                    <span className="font-semibold text-indigo-600">{community.size}</span>
                    </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">
                No active communities available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ActiveCommunities);
