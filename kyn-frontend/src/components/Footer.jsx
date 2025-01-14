import React from 'react';

const Footer = () => {
  return (
    <footer
      className="text-white py-4"
      style={{
        background: 'linear-gradient(to right, #4b0082, #800080, #6a0dad)',
      }}
    >
      <div className="container mx-auto text-center px-4">
        <p>&copy; 2024 Social Media Dashboard. All rights reserved.</p>
        <div className="mt-4">
          <ul className="flex justify-center space-x-6">
            <li><a href="#privacy" className="hover:text-gray-200">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-gray-200">Terms of Service</a></li>
            <li><a href="#contact" className="hover:text-gray-200">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
