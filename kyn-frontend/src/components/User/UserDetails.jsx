import React, { useState, useEffect } from "react";

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
          throw new Error("Failed to fetch user details");
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

  if (loading) {
    return <div className="text-white">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userDetails) {
    return <div className="text-gray-400">Select a user to view details.</div>;
  }

  const {
    name,
    username,
    email,
    bio,
    location,
    age,
    occupation,
    interests,
    follower_count,
    following_count,
    account_creation_date,
    activity_level,
    last_active,
  } = userDetails;

  return (
    <div className="relative flex flex-col space-y-6 rounded-xl bg-slate-950 p-6 shadow-2xl w-full h-[50vh] overflow-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-slate-800 scrollbar-rounded-lg">
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300"></div>
      <div className="absolute inset-px rounded-[11px] bg-slate-950"></div>

      {/* Personal Details Card */}
      <div className="relative flex flex-col space-y-4 p-6 rounded-lg bg-slate-900/50 shadow-md">
        <h2 className="text-xl font-bold text-white">Personal Details</h2>
        <div className="text-sm text-slate-300 space-y-1">
          <p>
            <strong className="text-indigo-500">Name:</strong> {name}
          </p>
          <p>
            <strong className="text-indigo-500">Username:</strong> {username}
          </p>
          <p>
            <strong className="text-indigo-500">Email:</strong> {email}
          </p>
          <p>
            <strong className="text-indigo-500">Age:</strong> {age}
          </p>
          <p>
            <strong className="text-indigo-500">Occupation:</strong> {occupation}
          </p>
          <p>
            <strong className="text-indigo-500">Location:</strong> {location}
          </p>
          <p>
            <strong className="text-indigo-500">Bio:</strong> {bio}
          </p>
        </div>
      </div>

      {/* Social Media Stats Card */}
      <div className="relative flex flex-col space-y-4 p-6 rounded-lg bg-slate-900/50 shadow-md">
        <h2 className="text-xl font-bold text-white">Social Media Stats</h2>
        <div className="flex justify-between text-sm text-slate-300">
          <div className="space-y-2">
            <p>
              <strong className="text-indigo-500">Followers:</strong> {follower_count}
            </p>
            <p>
              <strong className="text-indigo-500">Following:</strong> {following_count}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong className="text-indigo-500">Activity Level:</strong> {activity_level}
            </p>
            <p>
              <strong className="text-indigo-500">Last Active:</strong> {last_active}
            </p>
            <p>
              <strong className="text-indigo-500">Account Created:</strong> {account_creation_date}
            </p>
          </div>
        </div>
      </div>

      {/* Interests Card */}
      <div className="relative flex flex-col space-y-4 p-6 rounded-lg bg-slate-900/50 shadow-md">
        <h2 className="text-xl font-bold text-white">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs shadow-md hover:scale-105 transition-transform"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
