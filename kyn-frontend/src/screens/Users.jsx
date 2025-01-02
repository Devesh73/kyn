import React, { useState, useEffect } from "react";
import UsersList from "../components/UserList";
import UserDetails from "../components/UserDetails";
import UserInfluenceCard from "../components/UserInfluenceCard"; // Import UserInfluenceCard component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetching the users list from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection from the list
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setError(""); // Clear any existing error
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/user-search/${searchQuery}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedUser(data); // Set the searched user details
      } else {
        setSelectedUser(null);
        setError(data.error || "User not found");
      }
    } catch (error) {
      setError("An error occurred while searching for the user.");
      console.error("Error searching user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-100 to-purple-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Users List Section */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg overflow-y-auto p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Users List</h2>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Search by User ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <UsersList users={users} onSelectUser={handleUserClick} />
        </div>

        {/* User Details Section */}
        <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-lg p-6">
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : selectedUser ? (
            <>
              <UserDetails user={selectedUser} />
              {/* Display User Influence Card below UserDetails */}
              <UserInfluenceCard userId={selectedUser.user_id} />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a user to view details or search for a user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
