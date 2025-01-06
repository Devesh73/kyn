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
    return <div className="text-white">Loading active communities...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="group relative flex flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20 w-full max-w-md h-96">
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30"></div>
      <div className="absolute inset-px rounded-[11px] bg-slate-950"></div>

      {/* Title */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
            <svg
              className="h-4 w-4 text-white"
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
          <h2 className="text-sm font-semibold text-white">
            Active Communities
          </h2>
        </div>
      </div>

      {/* Scrollable communities list */}
      <div className="relative h-64 overflow-y-auto space-y-4 rounded-lg bg-slate-900/50 p-3 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-slate-800 scrollbar-rounded-lg pr-2">
        {activeCommunities.length ? (
          <ul className="space-y-4">
            {activeCommunities.map((community, index) => (
              <li
                key={index}
                className="rounded-lg bg-slate-800 p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-400">
                  Community ID:{" "}
                  <span className="text-white">{community.community_id}</span>
                </p>
                <p className="text-sm font-medium text-slate-400">
                  Activity Score:{" "}
                  <span className="text-emerald-500">
                    {(community.activity_score)/10}%
                  </span>
                </p>
                <p className="text-sm font-medium text-slate-400">
                  Size:{" "}
                  <span className="text-indigo-400">{community.size}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">
            No active communities available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ActiveCommunities;
