import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ searchQuery, setSearchQuery }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    setSuggestions([
      "Suggestion 1",
      "Suggestion 2",
      "Suggestion 3",
      "Suggestion 4",
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
      setSearchQuery(suggestions[selectedSuggestionIndex + 1] || searchQuery);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
      setSearchQuery(suggestions[selectedSuggestionIndex - 1] || searchQuery);
    } else if (e.key === "Enter") {
      if (selectedSuggestionIndex !== -1) {
        setSearchQuery(suggestions[selectedSuggestionIndex]);
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <div className="flex items-center bg-white rounded-full shadow-md shadow-md-top">
          <div className="p-2">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="outline-none bg-transparent w-full py-2 px-4"
          />
        </div>
        {searchQuery && suggestions.length > 0 && (
          <div className="absolute bg-white border border-gray-300 mt-1 w-full z-10 shadow-xl rounded-b-md rounded-t-md">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 cursor-pointer hover:bg-gray-100 rounded-md ${
                  selectedSuggestionIndex === index ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
