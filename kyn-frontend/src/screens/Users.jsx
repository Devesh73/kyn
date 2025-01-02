import React, { useState, useEffect } from "react";
import UsersList from "../components/UserList";
import UserDetails from "../components/UserDetails";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-100 to-purple-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Users List Section */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg overflow-y-auto p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Users List</h2>
          <UsersList users={users} onSelectUser={handleUserClick} />
        </div>

        {/* User Details Section */}
        <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-lg p-6">
          {selectedUser ? (
            <UserDetails user={selectedUser} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a user to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
