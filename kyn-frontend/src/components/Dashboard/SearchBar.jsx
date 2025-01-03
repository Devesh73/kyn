import React from "react";

const SearchBar = ({ userId, onUserIdChange, onSearch }) => {
  return (
    <div className="text-center">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-2">Search Discoveries</h1>
      <div className="flex items-center justify-center">
        {/* Search Input */}
        <input
          type="text"
          value={userId}
          onChange={onUserIdChange}
          placeholder="e.g. atoms edge"
          className="w-80 pl-4 py-3 text-sm text-purple-900 bg-purple-100 border border-purple-500 rounded-l-full placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {/* Search Button */}
        <button
          onClick={onSearch}
          className="bg-purple-500 text-white px-5 py-3 text-sm font-bold rounded-r-full hover:bg-purple-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
