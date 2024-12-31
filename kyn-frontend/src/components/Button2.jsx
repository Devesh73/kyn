import React from "react";

const Button2 = ({ children, onClick }) => {
  return (
    <button
      className="relative px-5 py-2.5 border rounded-md border-blue-600 font-semibold text-sm uppercase tracking-wider text-black bg-transparent overflow-hidden shadow-none transition-all duration-200 ease-in hover:text-white hover:bg-blue-600 hover:shadow-[0_0_30px_5px_rgba(0,142,236,0.815)] active:shadow-none"
      onClick={onClick}
    >
      <span className="absolute top-[7%] left-0 w-0 h-[86%] opacity-0 bg-white shadow-[0_0_50px_30px_white] skew-x-[-20deg] transition-all duration-500 ease-in-out hover:w-full hover:opacity-100"></span>
      {children}
    </button>
  );
};

export default Button2;
