import React, { useState, useEffect } from "react";
import { fetchGraphMetrics } from "../../services/graphMetrics";
import Loader from "../Shared/Loader";

const GraphMetricsCard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGraphMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getMetrics();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Graph Metrics</h2>
      <ul className="list-disc pl-6">
        {Object.entries(metrics).map(([key, value]) => (
          <li key={key} className="text-gray-700">
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraphMetricsCard;
