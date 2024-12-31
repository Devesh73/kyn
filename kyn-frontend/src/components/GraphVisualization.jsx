import React, { useEffect, useRef, useState } from "react";
import neo4j from "neo4j-driver";
import { Network } from 'vis-network/standalone'; // Use named import

const GraphVisualization = () => {
  const containerRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Neo4j connection configuration
    const driver = neo4j.driver(
      "neo4j+s://a97eb5fa.databases.neo4j.io", // Connection URL
      neo4j.auth.basic("neo4j", "VWKe_Fyi9uGClFd-oBUzFVMbloKXIGEPL2pPRNBmvj4") // Authentication credentials
    );

    const session = driver.session();

    // Example Cypher query to fetch data
    const cypherQuery = "MATCH (n) RETURN n LIMIT 10";

    // Fetch graph data
    session
      .run(cypherQuery)
      .then((result) => {
        const nodes = result.records.map((record) => ({
          id: record.get(0).identity.toString(), // Ensure unique ID
          label: record.get(0).properties.name || "Node", // Adjust based on your data
        }));
        setGraphData(nodes);
      })
      .catch((err) => {
        console.error("Error fetching data from Neo4j:", err);
        setError("Failed to fetch data from Neo4j.");
      })
      .finally(() => {
        session.close(); // Close session after query is finished
        driver.close(); // Close driver after usage
      });

    // Cleanup driver when component is unmounted
    return () => {
      driver.close();
    };
  }, []);

  useEffect(() => {
    if (graphData && containerRef.current) {
      // You can use vis.js or other graph libraries here
      const nodes = graphData.map((node) => ({
        id: node.id,
        label: node.label,
      }));

      const edges = []; // Define edges based on your data

      const data = {
        nodes,
        edges,
      };

      const options = {
        layout: {
          randomSeed: 2,
        },
        physics: {
          enabled: true,
        },
      };

      // Render the graph using vis.js
      new Network(containerRef.current, data, options);
    }
  }, [graphData]);

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <div ref={containerRef} style={{ width: "100%", height: "600px" }} />
    </div>
  );
};

export default GraphVisualization;
