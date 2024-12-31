import React from "react";
import { NavLink } from "react-router-dom";
import home from "../assets/Home.png";
const Home = () => {
  return (
    <section className="flex justify-between items-center py-16 px-8 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 rounded-lg shadow-lg h-[70vh] min-w-[300px] max-w-[90vw] flex-wrap">
      <div className="text-white max-w-[50%] pr-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Kyn Dashboard</h1>
        <p className="text-xl mb-6">Empowering employees with AI-driven solutions</p>
        <NavLink
          to="/login"
          className="inline-block text-lg font-semibold text-purple-700 border-2 border-purple-700 px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:bg-purple-700 hover:text-white"
        >
          Learn more
        </NavLink>
      </div>
      <div className="max-w-[40%]">
        <img
          src={home} // Replace with your image source
          alt="Robot"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </section>
  );
};

export default Home;
