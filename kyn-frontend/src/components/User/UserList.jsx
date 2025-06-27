import React, { useState, useEffect } from "react";

const UsersList = ({ users, onSelectUser, selectedUser }) => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.username.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm flex flex-col h-full">
      {/* Title & Search */}
      <div className="p-3 border-b border-slate-200/80">
        <h2 className="text-sm font-medium text-slate-800 mb-2">Users List</h2>
        <input
          type="text"
          className="w-full text-sm bg-slate-100/70 border border-slate-200/80 rounded-md p-2 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {loading && <p className="text-sm text-slate-500 p-2">Loading...</p>}
        {!loading && error && <p className="text-sm text-red-600 p-2">{error}</p>}
        {!loading && !error && (
            filteredUsers.length > 0 ? (
            <ul className="space-y-1">
                {filteredUsers.map((user) => (
                <li
                    key={user.user_id}
                    className={`rounded-md p-2 cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                    selectedUser?.user_id === user.user_id
                        ? "bg-indigo-50"
                        : "hover:bg-slate-100/80"
                    }`}
                    onClick={() => handleUserClick(user)}
                >
                    <img src={user.profile_image_url} alt={user.name} className="w-7 h-7 rounded-full" />
                    <div>
                        <h3 className={`text-xs font-semibold ${selectedUser?.user_id === user.user_id ? 'text-indigo-700' : 'text-slate-800'}`}>{user.name}</h3>
                        <p className={`text-xs ${selectedUser?.user_id === user.user_id ? 'text-indigo-500' : 'text-slate-500'}`}>@{user.username}</p>
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-sm text-slate-500 p-2">No users match your search.</p>
            )
        )}
      </div>
    </div>
  );
};

export default React.memo(UsersList);

