import React, { useState, useEffect } from 'react';
import UsersList from '../components/User/UserList';
import UserDetails from '../components/User/UserDetails';
import UserCommunityDetails from '../components/User/UserCommunityDetails';
import UserInfluenceCard from '../components/User/UserInfluenceCard';
import UserInteractionsCard from '../components/User/UserInteractionsCard';
import RecommendedConnections from '../components/User/RecommendedConnections';
import RecommendedCommunities from '../components/User/RecommendedCommunities';
import ChatBotContainer from '../components/ChatBotContainer';

const Users = () => {
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [recommendedConnectionsLoading, setRecommendedConnectionsLoading] = useState(false);
  const [recommendedCommunitiesLoading, setRecommendedCommunitiesLoading] = useState(false); 
  const [userInfluenceLoading, setUserInfluenceLoading] = useState(false); 
  const [error, setError] = useState(''); 


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

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRecommendedConnectionsLoading(true);
    setRecommendedCommunitiesLoading(true);
    setUserInfluenceLoading(true);

    // Simulate fetching data (replace with real API calls inside components)
    setTimeout(() => setRecommendedConnectionsLoading(false), 1000);
    setTimeout(() => setRecommendedCommunitiesLoading(false), 1200);
    setTimeout(() => setUserInfluenceLoading(false), 1500);
  };

  return (
    <div className="min-h-screen p-6 bg-black flex flex-row gap-6">
      {/* Users List Section */}
      <UsersList users={users} onSelectUser={handleSelectUser} />
      
      <div className="flex flex-col gap-6 w-full">
        {/* User Details Section */}
        {selectedUser ? (
          <>
            <UserDetails user={selectedUser} />
            <UserInteractionsCard userId={selectedUser.user_id} />

            <div className="flex flex-row gap-6">
              <RecommendedConnections
                userId={selectedUser.user_id}
                isLoading={recommendedConnectionsLoading}
              />
              <RecommendedCommunities
                userId={selectedUser.user_id}
                isLoading={recommendedCommunitiesLoading}
              />
              <UserInfluenceCard
                userId={selectedUser.user_id}
                isLoading={userInfluenceLoading}
              />
            </div>

            <UserCommunityDetails user={selectedUser} />
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to view details or search for a user.
          </div>
        )}
      </div>

      {/* Collapsible Chatbot */}
      <div className="min-h-screen relative">
        <ChatBotContainer />
      </div>
    </div>
  );
};

export default Users;
