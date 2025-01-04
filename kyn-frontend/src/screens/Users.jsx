import React, { useState, useEffect } from 'react';
import UsersList from '../components/User/UserList';
import UserDetails from '../components/User/UserDetails';
import UserCommunityDetails from '../components/User/UserCommunityDetails';
import UserInfluenceCard from '../components/User/UserInfluenceCard';
import UserInteractionsCard from '../components/User/UserInteractionsCard';
import RecommendedConnections from '../components/User/RecommendedConnections';

const Users = () => {
  const [users, setUsers] = useState([]); // Stores list of users
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [loading, setLoading] = useState(false); // Loading state for search
  const [error, setError] = useState(''); // Error messages

  // Fetch the list of users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users.');
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/user-search/${searchQuery}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'User not found.');
      setSelectedUser(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-100 to-purple-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Users List Section */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Users List</h2>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Search by User ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {/* Render Users List */}
          <UsersList users={users} onSelectUser={setSelectedUser} />
        </div>

        {/* User Details Section */}
        <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-lg p-6">
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : selectedUser ? (
            <>
              {/* Render User Details and Additional Info */}
              <UserDetails user={selectedUser} />
              <UserCommunityDetails community={selectedUser.community} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <UserInfluenceCard userId={selectedUser.user_id} />
                <UserInteractionsCard userId={selectedUser.user_id} />
              </div>
              <RecommendedConnections userId={selectedUser.user_id} className="mt-4" />
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
