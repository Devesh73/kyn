import React, { useState, useEffect } from 'react';

const UserDetails = ({ user, onCommunitySelect }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user-search/${user.user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
      {loading && <p>Loading user details...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {userDetails ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Username:</strong> {userDetails.username}</p>
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onCommunitySelect(userDetails.community)}
          >
            View Community
          </button>
        </div>
      ) : (
        <p>Select a user to view details.</p>
      )}
    </div>
  );
};

export default UserDetails;
