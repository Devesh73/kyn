import React from "react";
import Button from "./Button"; // Adjust the import path as needed

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My React Vite App</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <Button onClick={() => alert("Button Clicked!")}>Get Started</Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
