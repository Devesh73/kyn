import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const CommunityGraphComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);
  const [communities, setCommunities] = useState({});
  const [selectedCommunity, setSelectedCommunity] = useState("all");

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get("/api/community-graph");
        const data = response.data.communities;

        const allNodes = [];
        const allEdges = [];
        const connections = {};
        const communityMap = {};

        // Process nodes and edges
        data.forEach((community, index) => {
          const color = `hsl(${(index * 360) / data.length}, 70%, 50%)`; // Unique color for each community

          // Map nodes and assign them to communities
          community.nodes.forEach((node) => {
            allNodes.push({
              id: node.id,
              data: { label: `User ${node.id}` },
              position: {
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
              },
              style: {
                background: color,
                width: 50,
                height: 50,
                borderRadius: "50%",
                color: "#fff",
                fontSize: "10px",
              },
            });
            communityMap[node.id] = index; // Assign node to its community
          });

          // Map edges and connections
          community.links.forEach((link) => {
            allEdges.push({
              id: link.interaction_id,
              source: link.source,
              target: link.target,
              label: link.interaction_type,
              style: { stroke: link.geographic_proximity ? "green" : "red" },
            });
            connections[link.source] = connections[link.source] || [];
            connections[link.target] = connections[link.target] || [];
            connections[link.source].push(link.target);
            connections[link.target].push(link.source);
          });
        });

        // Filter out floating nodes (nodes with no connections)
        const connectedNodes = allNodes.filter((node) => connections[node.id]);
        const connectedEdges = allEdges.filter(
          (edge) =>
            connections[edge.source] && connections[edge.target]
        );

        // Randomly pick 200 nodes with connections
        const shuffledNodes = connectedNodes.sort(() => 0.5 - Math.random());
        const selectedNodes = shuffledNodes.slice(0, 200);
        const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));

        const filteredEdges = connectedEdges.filter(
          (edge) =>
            selectedNodeIds.has(edge.source) &&
            selectedNodeIds.has(edge.target)
        );

        // Set state
        setOriginalNodes(selectedNodes);
        setOriginalEdges(filteredEdges);
        setNodes(selectedNodes);
        setEdges(filteredEdges);
        setCommunities(communityMap);
      } catch (err) {
        setError("Error fetching community graph data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const handleNodeDoubleClick = (event, node) => {
    if (highlightedNode === node.id) {
      // Reset graph to original or community-filtered view
      handleCommunityFilter(selectedCommunity);
      setHighlightedNode(null);
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

  const handleCommunityFilter = (communityIndex) => {
    setSelectedCommunity(communityIndex);

    if (communityIndex === "all") {
      setNodes(originalNodes);
      setEdges(originalEdges);
      setHighlightedNode(null); // Reset highlight if any
      return;
    }

    // Filter nodes and edges by selected community
    const filteredNodes = originalNodes.filter(
      (node) => communities[node.id] === parseInt(communityIndex)
    );

    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    const filteredEdges = originalEdges.filter(
      (edge) =>
        filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );

    setNodes(filteredNodes);
    setEdges(filteredEdges);
    setHighlightedNode(null); // Reset highlight if any
  };

  if (loading) {
    return (
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-[600px] flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading community graph data...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm p-4 h-[600px] flex items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-200/80">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200/80">
                    {/* Icon for Community Graph */}
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12 10a4 4 0 110-5.292" />
                    </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-800">Community Graph</h2>
            </div>
            {/* Dropdown for selecting communities */}
            <select
                className="text-sm bg-slate-100/70 border border-slate-200/80 rounded-md p-1.5 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none"
                value={selectedCommunity}
                onChange={(e) => handleCommunityFilter(e.target.value)}
            >
                <option value="all">Show All Communities</option>
                {[...new Set(Object.values(communities))].map((community, index) => (
                    <option key={index} value={community}>
                    Community {community + 1}
                    </option>
                ))}
            </select>
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 rounded-md overflow-hidden bg-slate-50/50 p-2">
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

export default React.memo(CommunityGraphComponent);
