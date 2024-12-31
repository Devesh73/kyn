import React from 'react';

const Header = () => {
  return (
    <header
      className="text-white py-4"
      style={{
        background: 'linear-gradient(to right, #4b0082, #800080, #6a0dad)',
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">KYN Dashboard</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#home" className="hover:text-gray-200">Home</a></li>
            <li><a href="#users" className="hover:text-gray-200">Users</a></li>
            <li><a href="#settings" className="hover:text-gray-200">Settings</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
