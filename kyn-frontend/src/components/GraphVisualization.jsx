import React, { useEffect, useRef } from "react";
import NeoVis from "neovis.js"; // Ensure you have installed the NeoVis library: npm install neovis.js

const GraphVisualization = () => {
  const visRef = useRef(null);

  useEffect(() => {
    const config = {
      container_id: visRef.current,
      server_url: "bolt://localhost:7687", // Update with your Neo4j server URL
      server_user: "neo4j", // Your Neo4j username
      server_password: "password", // Your Neo4j password
      labels: {
        Person: {
          caption: "name",
        },
      },
      relationships: {
        KNOWS: {
          caption: true,
        },
      },
    };

    const neoViz = new NeoVis(config);
    neoViz.render();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Neo4j Graph</h2>
      <div
        ref={visRef}
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      ></div>
    </div>
  );
};

export default GraphVisualization;
