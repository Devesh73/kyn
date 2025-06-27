import React, { useState, useEffect } from 'react';
import UsersList from '../User/UserList';
import UserDetails from '../User/UserDetails';
import UserCommunityDetails from '../User/UserCommunityDetails';
import UserInfluenceCard from '../User/UserInfluenceCard';
import UserInteractionsCard from '../User/UserInteractionsCard';
import RecommendedConnections from '../User/RecommendedConnections';
import RecommendedCommunities from '../User/RecommendedCommunities';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users.');
        const data = await response.json();
        setUsers(data.users);
        if (data.users.length > 0) {
          setSelectedUser(data.users[0]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex gap-4 p-1">
      <div className="w-1/4">
        <UsersList users={users} onSelectUser={handleSelectUser} selectedUser={selectedUser} />
      </div>
      <div className="w-3/4 space-y-4">
        {selectedUser ? (
          <>
            <UserDetails user={selectedUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserInteractionsCard userId={selectedUser.user_id} />
              <UserInfluenceCard userId={selectedUser.user_id} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecommendedConnections userId={selectedUser.user_id} />
              <RecommendedCommunities userId={selectedUser.user_id} />
            </div>
            <UserCommunityDetails user={selectedUser} />
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            {error ? error : 'Select a user to view details.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab; 