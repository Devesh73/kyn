import React, { useState, useEffect } from 'react';

const CommunityDetails = ({ community }) => {
  const [communityDetails, setCommunityDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!community) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user-community/${community.community_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch community details');
        }
        const data = await response.json();
        setCommunityDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [community]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Community Details</h2>
      {loading && <p>Loading community details...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {communityDetails ? (
        <div className="space-y-2">
          <p><strong>ID:</strong> {communityDetails.community_id}</p>
          <p><strong>Name:</strong> {communityDetails.name}</p>
          <p><strong>Description:</strong> {communityDetails.description}</p>
        </div>
      ) : (
        <p>Select a community to view details.</p>
      )}
    </div>
  );
};

export default CommunityDetails;
