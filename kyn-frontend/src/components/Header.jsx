import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Kynnovate.png'; // Adjust the path as needed

const Header = () => {
  const location = useLocation();

  // Determine if the current page is /dashboard or /users
  const isDashboardOrUsers = location.pathname === '/dashboard' || location.pathname === '/users';

  return (
    <header
      className="text-white py-4"
      style={{
        background: 'linear-gradient(to right, #4b0082, #800080, #6a0dad)',
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo Image */}
        <Link to="/"><img src={logo} alt="KYN Dashboard Logo" className="h-10" /></Link>
        <nav className="flex-grow">
          <ul className="flex justify-end space-x-6">
            <li><Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link></li>
            <li><Link to="/users" className="hover:text-gray-200">Users</Link></li>
            <li>
              <Link
                to={isDashboardOrUsers ? "/" : "/login"}
                className="bg-white text-purple-700 hover:bg-gray-200 px-4 py-2 rounded"
              >
                {isDashboardOrUsers ? "Logout" : "Login"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
