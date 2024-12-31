import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      className="relative inline-block m-4 px-6 py-3 text-lg tracking-wide text-[#725AC1] bg-transparent cursor-pointer transition ease-out duration-500 border-2 border-[#725AC1] rounded-lg shadow-inner hover:text-white hover:shadow-[inset_0_-100px_0_0] hover:shadow-[#725AC1] active:scale-90"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
