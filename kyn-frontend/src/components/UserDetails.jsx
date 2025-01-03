import React, { useState, useEffect } from "react";
import CommunityDetails from "./CommunityDetails";

const UserDetails = ({ user }) => {
  const [community, setCommunity] = useState(null); // To store community details
  const [loadingCommunity, setLoadingCommunity] = useState(false); // Loading state
  const [communityError, setCommunityError] = useState(null); // Error state
  const [showCommunity, setShowCommunity] = useState(false); // Toggle for community view

  useEffect(() => {
    if (user) {
      const fetchCommunity = async () => {
        setLoadingCommunity(true);
        setCommunityError(null); // Reset error state

        try {
          const response = await fetch(`/api/user-community/${user.user_id}`);
          if (response.ok) {
            const data = await response.json();
            setCommunity(data);
          } else {
            const errorData = await response.json();
            setCommunityError(errorData.error || "Failed to fetch community.");
          }
        } catch (error) {
          setCommunityError("An unexpected error occurred.");
        } finally {
          setLoadingCommunity(false);
        }
      };

      fetchCommunity();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-600">
          Select a user to view details
        </h2>
      </div>
    );
  }

  const renderDetail = (label, value) => (
    <p className="text-lg text-gray-700">
      <strong>{label}:</strong> {value || "Not Available"}
    </p>
  );

  if (showCommunity) {
    return (
      <CommunityDetails
        community={community}
        onBack={() => setShowCommunity(false)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* User Details Section */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{user.name}</h2>
      <div className="space-y-2">
        {renderDetail("Email", user.email)}
        {renderDetail("Username", user.username)}
        {renderDetail("Age", user.age)}
        {renderDetail("Location", user.location)}
        {renderDetail("Occupation", user.occupation)}
        {renderDetail("Interests", user.interests?.join(", "))}
        {renderDetail("Bio", user.bio)}
      </div>

      {/* Community Details Section */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Community</h3>
        {loadingCommunity ? (
          <p className="text-gray-600">Loading community details...</p>
        ) : communityError ? (
          <p className="text-red-600">{communityError}</p>
        ) : community ? (
          <button
            onClick={() => setShowCommunity(true)}
            className="text-blue-600 hover:underline"
          >
            View Community {community.community_id}
          </button>
        ) : (
          <p className="text-gray-600">No community details available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
