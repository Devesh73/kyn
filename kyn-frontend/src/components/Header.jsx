import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Kynnovate.png';

const Header = () => {
  const location = useLocation();

  // Determine if the current page is /dashboard or /users
  const isDashboardOrUsers = location.pathname === '/dashboard' || location.pathname === '/users';
  // Check if current page is / or /login to hide nav links
  const isHomeOrLogin = location.pathname === '/' || location.pathname === '/login';

  return (
    <header
      className="text-white py-2 bg-violet-800 backdrop-blur-sm border-b border-gray-800/60"
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo Image */}
        <Link to="/"><img src={logo} alt="KYN Dashboard Logo" className="h-10" /></Link>
        <nav className="flex-grow">
          <ul className="flex justify-end space-x-6">
            {!isHomeOrLogin && (
              <>
                <li><Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link></li>
                <li><Link to="/users" className="hover:text-gray-200">Users</Link></li>
              </>
            )}
            <li>
              <Link
                to={isDashboardOrUsers ? "/" : "/login"}
                className="bg-purple-900/80 hover:bg-purple-800 text-white px-4 py-2 rounded transition-colors"
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
