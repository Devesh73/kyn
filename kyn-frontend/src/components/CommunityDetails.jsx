import React from "react";

const CommunityDetails = ({ community, onBack }) => {
  if (!community) {
    return <p className="text-gray-600">No community details available.</p>;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to User Details
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Community {community.community_id}
      </h2>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Members</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {community.members.map((member, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-sm text-center"
          >
            <p className="text-lg font-medium text-gray-700">{member}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDetails;
