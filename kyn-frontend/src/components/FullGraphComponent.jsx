import React, { useEffect, useState } from "react";
import axios from "axios";
import { Network } from "react-vis-network";

const FullGraphComponent = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get("/api/full-graph");
        setGraphData(response.data);
      } catch (err) {
        setError("Error fetching graph data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading graph data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Generate nodes from unique users in the edges
  const users = new Set();
  const edges = graphData.links.map(link => {
    users.add(link.source);
    users.add(link.target);
    return {
      id: link.interaction_id,
      from: link.source,
      to: link.target,
      label: link.interaction_type,
      arrows: 'to',
      color: { color: link.geographic_proximity ? "green" : "red" },
    };
  });

  const nodes = Array.from(users).map(userId => ({
    id: userId,
    label: userId, // Display user ID as node label
  }));

  const networkData = {
    nodes,
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
    <div className="flex justify-center items-center my-6">
      {/* Container with fixed width and height, and scrollbar */}
      <div className="w-[600px] h-[400px] overflow-auto border rounded-lg p-4">
        {/* Render the graph */}
        <Network data={networkData} options={options} />
      </div>
    </div>
  );
};

export default FullGraphComponent;
