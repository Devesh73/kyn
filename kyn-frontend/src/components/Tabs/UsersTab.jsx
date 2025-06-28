import React, { useState, useEffect, Suspense } from 'react';

// Lazy load all heavy user components for better performance
const UsersList = React.lazy(() => import('../User/UserList'));
const UserDetails = React.lazy(() => import('../User/UserDetails'));
const UserCommunityDetails = React.lazy(() => import('../User/UserCommunityDetails'));
const UserInfluenceCard = React.lazy(() => import('../User/UserInfluenceCard'));
const UserInteractionsCard = React.lazy(() => import('../User/UserInteractionsCard'));
const RecommendedConnections = React.lazy(() => import('../User/RecommendedConnections'));
const RecommendedCommunities = React.lazy(() => import('../User/RecommendedCommunities'));

// Loading fallback component
const ComponentLoader = ({ height = "h-96", width = "", isDarkTheme }) => (
  <div className={`${isDarkTheme ? 'bg-neutral-900' : 'bg-white'} rounded shadow-sm ${height} ${width} flex items-center justify-center`}>
    <div className={`flex items-center gap-2 ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
      <div className={`w-4 h-4 border-2 ${isDarkTheme ? 'border-neutral-700 border-t-neutral-400' : 'border-slate-300 border-t-slate-600'} rounded-full animate-spin`}></div>
      <span className="text-sm">Loading...</span>
    </div>
  </div>
);

const UsersTab = ({ isDarkTheme }) => {
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
    <div className="flex gap-2 p-1">
      <div className="w-1/4">
        <Suspense fallback={<ComponentLoader height="h-full" isDarkTheme={isDarkTheme} />}>
          <UsersList users={users} onSelectUser={handleSelectUser} selectedUser={selectedUser} isDarkTheme={isDarkTheme} />
        </Suspense>
      </div>
      <div className="w-3/4 space-y-2">
        {selectedUser ? (
          <>
            <Suspense fallback={<ComponentLoader height="h-48" isDarkTheme={isDarkTheme} />}>
              <UserDetails user={selectedUser} isDarkTheme={isDarkTheme} />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
                <UserInteractionsCard userId={selectedUser.user_id} isDarkTheme={isDarkTheme} />
              </Suspense>
              <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
                <UserInfluenceCard userId={selectedUser.user_id} isDarkTheme={isDarkTheme} />
              </Suspense>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
                <RecommendedConnections userId={selectedUser.user_id} isDarkTheme={isDarkTheme} />
              </Suspense>
              <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
                <RecommendedCommunities userId={selectedUser.user_id} isDarkTheme={isDarkTheme} />
              </Suspense>
            </div>
            <Suspense fallback={<ComponentLoader height="h-64" isDarkTheme={isDarkTheme} />}>
              <UserCommunityDetails user={selectedUser} isDarkTheme={isDarkTheme} />
            </Suspense>
          </>
        ) : (
          <div className={`h-full flex items-center justify-center ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
            {error ? error : 'Select a user to view details.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab; 