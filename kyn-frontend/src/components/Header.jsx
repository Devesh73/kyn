import React from 'react';

const Header = () => {
  return (
    <header className="bg-purple-700 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Social Media Dashboard</h1>
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
