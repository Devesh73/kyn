import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Shared/Loader";  // Assuming you have a Loader component for loading states

const UserInfluenceCard = ({ userId }) => {
  const [influence, setInfluence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfluence = async () => {
      try {
        const response = await axios.get(`/api/user-influence/${userId}`);
        setInfluence(response.data.influence);  // Assuming the response contains influence data
      } catch (error) {
        setError("Failed to load user influence.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInfluence();
    }
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-80 h-64 overflow-y-auto mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">User Influence</h2>
      <h3 className="text-sm font-semibold mb-4">Influence for User: {userId}</h3>
      
      {influence ? (
        <ul className="text-sm space-y-2">
          {Object.entries(influence).map(([metric, value], index) => (
            <li key={index} className="border-b pb-2">
              <div><strong>{metric.replace('_', ' ').toUpperCase()}:</strong> {value.toFixed(4)}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No influence data available for this user.</p>
      )}
    </div>
  );
};

export default UserInfluenceCard;
