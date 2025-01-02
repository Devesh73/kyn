import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Shared/Loader";  // Assuming you have a Loader component for loading states

const UserInteractionsCard = ({ userId }) => {
  const [interactions, setInteractions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInteractions = async () => {
      try {
        const response = await axios.get(`/api/user-interactions/${userId}`);
        setInteractions(response.data.interactions);  // Assuming the response contains interactions
      } catch (error) {
        setError("Failed to load user interactions.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInteractions();
    }
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-64 h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">User Interactions</h2>
      <h3 className="text-sm font-semibold mb-4">Interactions for User: {userId}</h3>
      
      {interactions && interactions.length > 0 ? (
        <ul className="text-sm space-y-2">
          {interactions.map((interaction, index) => (
            <li key={index} className="border-b pb-2">
              <div><strong>Target User ID:</strong> {interaction.target}</div>
              <div><strong>Attributes:</strong></div>
              <ul className="pl-4 space-y-1">
                {Object.entries(interaction.attributes).map(([key, value]) => (
                  <li key={key} className="text-xs">
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No interactions found for this user.</p>
      )}
    </div>
  );
};

export default UserInteractionsCard;
