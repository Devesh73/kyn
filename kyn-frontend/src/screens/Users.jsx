import React, { useState, useEffect } from 'react';
import UsersList from '../components/User/UserList';
import UserDetails from '../components/User/UserDetails';
import UserCommunityDetails from '../components/User/UserCommunityDetails';
import UserInfluenceCard from '../components/User/UserInfluenceCard';
import UserInteractionsCard from '../components/User/UserInteractionsCard';
import RecommendedConnections from '../components/User/RecommendedConnections';
import RecommendedCommunities from '../components/User/RecommendedCommunities';

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
    <div className="min-h-screen p-6 bg-black flex flex-row gap-6">
      {/* Users List Section */}
      <UsersList users={users} onSelectUser={setSelectedUser} />
      {/* <UserInfluenceCard userId={selectedUser.user_id} />// */}
      <div className='flex flex-col gap-6 w-full'>
        {/* User Details Section */}
      {selectedUser ? (
        <>
          <UserDetails user={selectedUser} />
          
          
          <UserInteractionsCard userId={selectedUser.user_id} />

          <div className="flex flex-row gap-6">
            <RecommendedConnections userId={selectedUser.user_id}/>
            <RecommendedCommunities userId={selectedUser.user_id}/>
            <UserInfluenceCard userId={selectedUser.user_id} />
          </div>

          <UserCommunityDetails user={selectedUser} />

        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a user to view details or search for a user.
        </div>
      )}

      </div>
      
    </div>
  );
};

export default Users;
