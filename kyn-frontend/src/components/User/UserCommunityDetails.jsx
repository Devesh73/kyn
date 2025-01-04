import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const UserCommunityDetails = ({ user, onCommunitySelect }) => {
  const [communityDetails, setCommunityDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [highlightedNode, setHighlightedNode] = useState(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch the user's community details
        const communityResponse = await axios.get(`/api/user-community/${user.user_id}`);
        const communityData = communityResponse.data;
        setCommunityDetails(communityData);

        // Get the user's interactions to establish edges
        const interactionsResponse = await axios.get(`/api/user-interactions/${user.user_id}`);
        const interactionsData = interactionsResponse.data;

        // Generate nodes and edges
        const allNodes = [];
        const allEdges = [];
        const communityMembers = communityData.members;
        const userId = user.user_id;

        // Add the central user (the selected user)
        allNodes.push({
          id: userId,
          data: { label: user.name },
          position: { x: 0, y: 0 },
          style: { background: "#4CAF50", color: "#fff", width: 60, height: 60, borderRadius: "50%" },
        });

        // Add other members as surrounding nodes in a circle
        const angleIncrement = (2 * Math.PI) / communityMembers.length;
        communityMembers.forEach((memberId, index) => {
          if (memberId === userId) return; // Skip the central user
          const angle = index * angleIncrement;
          allNodes.push({
            id: memberId,
            data: { label: memberId }, // You can replace this with the member's name if available
            position: {
              x: Math.cos(angle) * 300,  // Increase the multiplier for more spread
              y: Math.sin(angle) * 300,  // Increase the multiplier for more spread
            },
            style: { background: "#4CAF50", color: "#fff", width: 50, height: 50, borderRadius: "50%" },
          });
        });

        // Generate edges based on follower/following interactions
        interactionsData.interactions.forEach((interaction) => {
          if (interaction.attributes.interaction_type === "follow") {
            allEdges.push({
              id: interaction.attributes.interaction_id,
              source: interaction.attributes.source_user,
              target: interaction.attributes.target_user,
              label: interaction.attributes.interaction_type,
              style: { stroke: "#4CAF50" },
            });
          } else if (interaction.attributes.interaction_type === "followed_by") {
            allEdges.push({
              id: interaction.attributes.interaction_id,
              source: interaction.attributes.target_user,
              target: interaction.attributes.source_user,
              label: interaction.attributes.interaction_type,
              style: { stroke: "#FF5722" },
            });
          }
        });

        // Limit the number of nodes to 100 to reduce clutter
        const limitedNodes = allNodes.slice(0, 100);
        setNodes(limitedNodes);
        setEdges(allEdges);
      } catch (err) {
        setError("Failed to fetch community details");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [user]);

  const handleNodeDoubleClick = (event, node) => {
    if (highlightedNode === node.id) {
      // Reset graph to original view
      setHighlightedNode(null);
      setNodes(nodes);
      setEdges(edges);
    } else {
      // Highlight node and its connections
      const connectedNodes = new Set(
        edges
          .filter((edge) => edge.source === node.id || edge.target === node.id)
          .flatMap((edge) => [edge.source, edge.target])
      );

      const highlightedNodes = nodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: connectedNodes.has(n.id) ? 1 : 0.2,
        },
      }));

      const highlightedEdges = edges.map((e) => ({
        ...e,
        style: {
          ...e.style,
          opacity:
            connectedNodes.has(e.source) && connectedNodes.has(e.target)
              ? 1
              : 0.2,
        },
      }));

      setNodes(highlightedNodes);
      setEdges(highlightedEdges);
      setHighlightedNode(node.id);
    }
  };

  if (loading) {
    return <div className="text-white">Loading community details...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="bg-slate-950 p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-white">Community Graph</h2>
      <div className="w-full h-[600px] border border-gray-600 rounded-lg shadow-xl bg-slate-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={handleNodeDoubleClick}
          fitView
          minZoom={0.1}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default UserCommunityDetails;
