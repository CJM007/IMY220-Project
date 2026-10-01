import { useState } from "react";

function SearchInput() {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Searching for:", query);
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, readers, hashtags..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchInput;
