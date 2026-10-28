import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestions, imageUrl } from "../api.js";
import Avatar from "./Avatar.jsx";

// Bonus: autocomplete suggestions as you type, combining users/posts/albums.
// Backend search already tolerates incomplete and misspelled terms.
export default function SearchBar() {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!term.trim()) {
      setSuggestions(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await getSuggestions(term.trim());
        setSuggestions(data);
        setOpen(true);
      } catch {
        setSuggestions(null);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [term]);

  function submitSearch(e) {
    e.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  }

  const hasResults =
    suggestions &&
    (suggestions.users.length || suggestions.posts.length || suggestions.albums.length);

  return (
    <div className="relative w-full max-w-md" ref={boxRef}>
      <form onSubmit={submitSearch}>
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => term && setOpen(true)}
          placeholder="Search users, posts, albums, #hashtags..."
          className="input-field"
          aria-label="Search Dog-Eared"
        />
      </form>
      {open && hasResults && (
        <div className="absolute z-20 mt-1 w-full card max-h-96 overflow-y-auto">
          {suggestions.users.length > 0 && (
            <div className="mb-2">
              <p className="text-xs uppercase text-inksoft dark:text-inksoftdark mb-1">Users</p>
              {suggestions.users.map((u) => (
                <button
                  key={u._id}
                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-border/30"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/profile/${u._id}`);
                  }}
                >
                  <Avatar user={u} size={6} />
                  <span>{u.username}</span>
                </button>
              ))}
            </div>
          )}
          {suggestions.posts.length > 0 && (
            <div className="mb-2">
              <p className="text-xs uppercase text-inksoft dark:text-inksoftdark mb-1">Posts</p>
              {suggestions.posts.map((p) => (
                <button
                  key={p._id}
                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-border/30"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/post/${p._id}`);
                  }}
                >
                  {p.image && (
                    <img src={imageUrl(p.image)} alt="" className="w-8 h-8 rounded object-cover" />
                  )}
                  <span className="truncate">{p.description}</span>
                </button>
              ))}
            </div>
          )}
          {suggestions.albums.length > 0 && (
            <div>
              <p className="text-xs uppercase text-inksoft dark:text-inksoftdark mb-1">Albums</p>
              {suggestions.albums.map((a) => (
                <button
                  key={a._id}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-border/30"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/album/${a._id}`);
                  }}
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
