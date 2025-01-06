import React, { useState, useEffect } from "react";

const UsersList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]); // List of users
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered user list
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user

  // Fetch the list of users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users.");
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []); // Initialize filtered users
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.toLowerCase().startsWith("u") && /^\d+$/.test(query.slice(1))) {
      // Search by user ID using the usersearch API
      try {
        setLoading(true);
        const response = await fetch(`/api/user-search/${query}`);
        const data = await response.json();
        if (response.ok) {
          setFilteredUsers([data]); // Show only the fetched user
        } else {
          setFilteredUsers([]);
        }
      } catch (err) {
        console.error("Error searching by user ID:", err);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Filter users by name or email
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle user selection
  const handleUserClick = (user) => {
    setSelectedUserId(user.user_id); // Update the selected user ID
    onSelectUser(user); // Call the parent-provided function with the selected user
  };

  if (loading) {
    return <div className="text-white">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="group relative flex flex-col bg-slate-950 shadow-xl w-full lg:w-1/3 h-[2100px] overflow-hidden">
      {/* Title */}
      <div className="relative mb-4 px-4 pt-6">
        <h2 className="text-xl font-semibold text-white">Users List</h2>
        <p className="text-sm text-slate-400">Search by Name, Email, or User ID (e.g., U12)</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4 px-4">
        <input
          type="text"
          className="w-full p-3 bg-slate-800 text-white rounded-lg border-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Users list */}
      <div className="relative flex-grow overflow-y-auto space-y-4 bg-slate-900/50 p-4 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-slate-800 scrollbar-rounded-lg">
        {filteredUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li
                key={user.user_id}
                className={`rounded-lg p-4 shadow-sm cursor-pointer transition ${
                  selectedUserId === user.user_id
                    ? "bg-purple-600 hover:bg-purple-800" // Selected state
                    : "bg-slate-800 hover:bg-purple-700" // Default hover state
                }`}
                onClick={() => handleUserClick(user)}
              >
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                <p className="text-sm font-medium text-slate-400">{user.email}</p>
                <p className="text-sm font-medium text-indigo-400">ID: {user.user_id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">No users match your search.</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;

