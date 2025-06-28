import React, { useState, useEffect, useCallback } from "react";
import { FixedSizeList as List } from "react-window";

const UsersList = ({ users, onSelectUser, selectedUser, isDarkTheme }) => {
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

  const Row = ({ index, style }) => {
    const user = filteredUsers[index];
    const isSelected = selectedUser?.user_id === user.user_id;

    return (
      <div
        style={style}
        className={`px-2 py-1 flex items-center gap-2 cursor-pointer ${
          isSelected
            ? isDarkTheme ? 'bg-gradient-to-r from-purple-900 to-purple-800/50' : 'bg-gradient-to-r from-purple-50 to-purple-100/50'
            : isDarkTheme ? 'hover:bg-neutral-800/80' : 'hover:bg-slate-100/80'
        }`}
        onClick={() => handleUserClick(user)}
      >
        <img src={user.profile_image_url} alt={user.name} className="w-7 h-7 rounded-full" />
        <div>
          <h3 className={`text-xs font-semibold ${isSelected ? (isDarkTheme ? 'text-white' : 'text-purple-700') : (isDarkTheme ? 'text-neutral-200' : 'text-slate-800')}`}>{user.name}</h3>
          <p className={`text-xs ${isSelected ? (isDarkTheme ? 'text-purple-300' : 'text-purple-500') : (isDarkTheme ? 'text-neutral-400' : 'text-slate-500')}`}>@{user.username}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-full`}>
      {/* Title & Search */}
      <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800/80' : 'border-purple-100/80'}`}>
        <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'} mb-2`}>Users List</h2>
        <input
          type="text"
          className={`w-full text-sm ${isDarkTheme ? 'bg-neutral-800 text-neutral-200 focus:ring-purple-700 focus:border-purple-700' : 'bg-slate-100/70 focus:ring-purple-300 focus:border-purple-300'} rounded p-2 focus:ring-1 focus:outline-none shadow-sm hover:shadow-md transition-shadow duration-200`}
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Users list with virtualization */}
      <div className={`flex-1 overflow-y-auto ${isDarkTheme ? 'bg-neutral-900/50' : 'bg-slate-50/50'}`}>
        {loading && <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'} p-2`}>Loading...</p>}
        {!loading && error && <p className="text-sm text-red-600 p-2">{error}</p>}
        {!loading && !error && (
          filteredUsers.length > 0 ? (
            <List
              height={400}
              itemCount={filteredUsers.length}
              itemSize={50}
              width="100%"
            >
              {Row}
            </List>
          ) : (
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'} p-2`}>No users match your search.</p>
          )
        )}
      </div>
    </div>
  );
};

export default React.memo(UsersList);

