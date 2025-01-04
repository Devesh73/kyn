import React from "react";

const UsersList = ({ users, onSelectUser }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md max-h-[400px] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">All Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li
              key={user.user_id}
              className="cursor-pointer py-3 px-4 mb-3 bg-white rounded-lg shadow hover:bg-purple-200 transition-all"
              onClick={() => onSelectUser(user)}
            >
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No users available to display.</p>
      )}
    </div>
  );
};

export default UsersList;
