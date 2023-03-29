import React, { useState } from 'react';

function TextFieldSearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMatchCaseChange = () => {
    setMatchCase(!matchCase);
  };

  const handleFindClick = () => {
    // Perform search using searchTerm and matchCase values
    console.log(`Searching for "${searchTerm}" (match case: ${matchCase})`);
  };

  const handleCancelClick = () => {
    // Cancel search and clear search input field
    setSearchTerm('');
    console.log('Search canceled');
  };

  return (
    <div className="search-box">
      <h3>Find in Document</h3>
      <div className="search-field">
        <label htmlFor="search-input">Search:</label>
        <input
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <button onClick={handleFindClick}>Find</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>
      <div className="match-case">
        <label htmlFor="match-case-input">Match case</label>
        <input
          type="checkbox"
          id="match-case-input"
          checked={matchCase}
          onChange={handleMatchCaseChange}
        />
      </div>
    </div>
  );