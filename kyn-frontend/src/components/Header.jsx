import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Kynnovate.png'; // Adjust the path as needed

const Header = () => {
  return (
    <header
      className="text-white py-4"
      style={{
        background: 'linear-gradient(to right, #4b0082, #800080, #6a0dad)',
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
      <Link to="/" ><img src={logo} alt="KYN Dashboard Logo" className="h-10" /></Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link></li>
            <li><Link to="/users" className="hover:text-gray-200">Users</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
