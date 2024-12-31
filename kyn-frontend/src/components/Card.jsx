// Card.jsx
import React from "react";

const Card = ({ title, value, percentageChange }) => {
  return (
    <div className="bg-purple-300 p-4 rounded-lg text-center">
      <p className="text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      {percentageChange && (
        <p
          className={`text-sm ${
            percentageChange > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}
        </p>
      )}
    </div>
  );
};

export default Card;
