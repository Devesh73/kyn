import React, { useState, useEffect } from "react";

const ActiveCommunities = () => {
  const [activeCommunities, setActiveCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active communities data from the API
    fetch("/api/active-communities")
      .then((response) => response.json())
      .then((data) => {
        if (data.active_communities) {
          setActiveCommunities(data.active_communities);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching active communities:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-3xl p-4 border border-gray-300">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Active Communities</h2>

      {/* Loading State */}
      {loading ? (
        <p>Loading active communities...</p>
      ) : (
        <div
          className="h-96 overflow-y-auto border border-gray-200 p-2"
          style={{ maxHeight: "400px", maxWidth: "600px" }}
        >
          {activeCommunities.length > 0 ? (
            activeCommunities.map((community) => (
              <div
                key={community.community_id}
                className="flex justify-between py-2 border-b border-gray-200"
              >
                <span>Community {community.community_id}</span>
                <span>Activity Score: {community.activity_score}</span>
                <span>Size: {community.size}</span>
              </div>
            ))
          ) : (
            <p>No active communities found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveCommunities;
