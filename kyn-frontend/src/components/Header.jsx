import React from 'react';
import { Link } from 'react-router-dom';

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
            <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/users" className="hover:text-gray-200">Users</Link></li>
            <li><Link to="/settings" className="hover:text-gray-200">Settings</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
