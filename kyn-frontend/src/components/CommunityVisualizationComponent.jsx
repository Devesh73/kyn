import React, { useEffect, useState } from "react";
import axios from "axios";

const CommunityVisualizationComponent = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityImage = async () => {
      try {
        const response = await axios.get("/api/visualize-community", {
          responseType: "blob", // Ensure the response is an image (blob)
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (err) {
        setError("Error fetching the community visualization image.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityImage();
  }, []);

  if (loading) {
    return <div className="text-center">Loading community visualization...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center my-6">
      <div className="w-[600px] h-[400px] overflow-auto border rounded-lg p-4">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Community Graph Visualization"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center">Failed to load image.</div>
        )}
      </div>
    </div>
  );
};

export default CommunityVisualizationComponent;
