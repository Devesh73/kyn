import React, { useEffect, useState } from "react";
import axios from "axios";
import { Network } from "react-vis-network";

const CommunityGraphComponent = () => {
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get("/api/community-graph");
        setCommunityData(response.data.communities);
      } catch (err) {
        setError("Error fetching community graph data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading community graph data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="my-6">
      <h2 className="text-center text-xl mb-4">Community Graphs</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {communityData && communityData.length > 0 ? (
          communityData.map((community, index) => {
            // Prepare network data for each community
            const nodes = community.nodes || [];
            const edges = community.links.map((link) => ({
              id: link.interaction_id,
              from: link.source,
              to: link.target,
              label: link.interaction_type,
              arrows: "to",
              color: { color: link.geographic_proximity ? "green" : "red" },
            }));

            const networkData = {
              nodes: nodes.map((node) => ({
                id: node.id,
                label: node.id,
              })),
              edges,
            };

            const options = {
              nodes: {
                shape: "dot",
                size: 10,
                color: "#00F",
              },
              edges: {
                width: 2,
                color: "#000000",
                smooth: { type: "continuous" },
              },
              physics: {
                enabled: true,
              },
              layout: {
                randomSeed: 2,
              },
            };

            return (
              <div key={index} className="w-[600px] h-[400px] overflow-auto border rounded-lg p-4">
                <h3 className="text-center text-lg mb-2">Community {index + 1}</h3>
                <Network data={networkData} options={options} />
              </div>
            );
          })
        ) : (
          <div className="text-center">No communities available.</div>
        )}
      </div>
    </div>
  );
};

export default CommunityGraphComponent;
