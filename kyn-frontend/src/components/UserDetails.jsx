import React from "react";

const UserDetails = ({ user }) => {
  if (!user) {
    return (
      <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-600">
          Select a user to view details
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{user.name}</h2>
      <div className="space-y-2">
        <p className="text-lg text-gray-700"><strong>Email:</strong> {user.email}</p>
        <p className="text-lg text-gray-700"><strong>Username:</strong> {user.username}</p>
        <p className="text-lg text-gray-700"><strong>Age:</strong> {user.age}</p>
        <p className="text-lg text-gray-700"><strong>Location:</strong> {user.location}</p>
        <p className="text-lg text-gray-700"><strong>Occupation:</strong> {user.occupation}</p>
        <p className="text-lg text-gray-700"><strong>Interests:</strong> {user.interests.join(", ")}</p>
        <p className="text-lg text-gray-700"><strong>Bio:</strong> {user.bio}</p>
      </div>
    </div>
  );
};

export default UserDetails;

