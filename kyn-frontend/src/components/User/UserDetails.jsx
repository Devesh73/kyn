import React, { useState, useEffect } from "react";

const UserDetails = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Since user data is passed directly, we may not need to fetch.
  // This simplifies the component, but we can re-add fetching if details are missing.
  useEffect(() => {
    if (!user) {
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading user details...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm p-4 h-full flex items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="bg-slate-50/60 rounded-lg border border-slate-200/40 shadow-sm p-4 h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">Select a user to see details.</p>
        </div>
    );
  }

  const {
    name,
    username,
    email = "N/A",
    bio = "No bio available.",
    location = "Unknown",
    age = "N/A",
    occupation = "N/A",
    interests = [],
    follower_count = 0,
    following_count = 0,
    account_creation_date = "N/A",
    activity_level = "N/A",
    last_active = "N/A",
    profile_image_url
  } = user;

  const detailItem = (label, value) => (
    <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
            <img src={profile_image_url} alt={name} className="w-16 h-16 rounded-full border-2 border-slate-50 shadow-md" />
            <div>
                <h2 className="text-lg font-bold text-slate-900">{name}</h2>
                <p className="text-sm text-slate-500">@{username}</p>
            </div>
        </div>
        
        {/* Bio */}
        <div>
            <p className="text-xs text-slate-500 mb-1">Bio</p>
            <p className="text-sm text-slate-700 bg-slate-50/70 rounded-md p-2 border border-slate-200/50">{bio}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-200/80 pt-4">
            {detailItem("Email", email)}
            {detailItem("Age", age)}
            {detailItem("Occupation", occupation)}
            {detailItem("Location", location)}
            {detailItem("Followers", follower_count)}
            {detailItem("Following", following_count)}
            {detailItem("Activity Level", activity_level)}
            {detailItem("Last Active", last_active)}
            {detailItem("Member Since", account_creation_date)}
        </div>

        {/* Interests */}
        <div className="border-t border-slate-200/80 pt-4">
             <p className="text-xs text-slate-500 mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
            {interests.length > 0 ? interests.map((interest, index) => (
                <span
                key={index}
                className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium border border-indigo-200/80"
                >
                {interest}
                </span>
            )) : <p className="text-sm text-slate-500">No interests listed.</p>}
            </div>
        </div>
    </div>
  );
};

export default React.memo(UserDetails);
