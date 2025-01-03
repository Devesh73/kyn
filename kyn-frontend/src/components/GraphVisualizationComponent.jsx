import React, { useEffect, useState } from "react";
import axios from "axios";

const GraphVisualizationComponent = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphImage = async () => {
      try {
        const response = await axios.get("/api/visualize-graph", {
          responseType: "blob", // Ensure the response is in the form of a Blob (image)
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (err) {
        setError("Error fetching the graph image.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphImage();
  }, []);

  if (loading) {
    return <div className="text-center">Loading graph visualization...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center my-6">
      <div className="w-[600px] h-[400px] overflow-auto border rounded-lg p-4">
        {imageSrc ? (
          <img src={imageSrc} alt="Graph Visualization" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center">Failed to load image.</div>
        )}
      </div>
    </div>
  );
};

export default GraphVisualizationComponent;
