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

const UserCommunityDetails = ({ user, onCommunitySelect, isDarkTheme }) => {
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
          style: { background: isDarkTheme ? "rgb(127, 29, 29)" : "rgb(79, 70, 229)", color: "#fff", width: 60, height: 60, borderRadius: "50%" },
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
            style: { background: isDarkTheme ? "rgb(74, 22, 128)" : "rgb(99, 102, 241)", color: "#fff", width: 50, height: 50, borderRadius: "50%" },
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
              style: { stroke: isDarkTheme ? "rgba(167, 139, 250, 1)" : "rgba(99, 102, 241, 1)" },
            });
          } else if (interaction.attributes.interaction_type === "followed_by") {
            allEdges.push({
              id: interaction.attributes.interaction_id,
              source: interaction.attributes.target_user,
              target: interaction.attributes.source_user,
              label: interaction.attributes.interaction_type,
              style: { stroke: isDarkTheme ? "#6b7280" : "#64748b" },
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
  }, [user, isDarkTheme]);

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
    return (
        <div className={`${isDarkTheme ? 'bg-black' : 'bg-slate-50/60'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/40'} shadow-sm p-4 h-[700px] flex items-center justify-center`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading community details...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm p-4 h-[700px] flex items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'} shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-[700px]`}>
        <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'}`}>
            <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-indigo-50 border-indigo-200/80'} border shadow-sm`}>
                    <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12 10a4 4 0 110-5.292" />
                    </svg>
                </div>
                <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>User's Community Graph</h2>
            </div>
        </div>
        <div className={`flex-1 rounded-md overflow-hidden ${isDarkTheme ? 'bg-neutral-900/50' : 'bg-slate-50/50'} p-2`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDoubleClick={handleNodeDoubleClick}
                fitView
                minZoom={0.1}
            >
                <MiniMap style={isDarkTheme ? { backgroundColor: '#171717' } : undefined} />
                <Controls />
                <Background color={isDarkTheme ? '#444' : '#ddd'} gap={12} />
            </ReactFlow>
        </div>
    </div>
  );
};

export default UserCommunityDetails;
