import { useEffect, useState } from "react";
import { createAlbum, getHashtagSuggestions } from "../api.js";

export default function CreateAlbum({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      getHashtagSuggestions()
        .then((data) => setSuggestions(data.suggestions))
        .catch(() => setSuggestions([]));
    }
  }, [open]);

  function addSuggestion(tag) {
    const current = hashtags.split(",").map((t) => t.trim()).filter(Boolean);
    if (!current.includes(tag)) setHashtags([...current, tag].join(", "));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Album name is required.");
      return;
    }
    setPending(true);
    try {
      const data = await createAlbum({
        name: name.trim(),
        description,
        hashtags: hashtags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onCreated(data.album);
      setName("");
      setDescription("");
      setHashtags("");
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-secondary text-sm mb-3" onClick={() => setOpen(true)}>
        + New album
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 mb-3" noValidate>
      <div>
        <label htmlFor="album-name" className="label">Album name</label>
        <input id="album-name" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="album-description" className="label">Description</label>
        <textarea
          id="album-description"
          className="input-field"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="album-hashtags" className="label">Hashtags</label>
        <input
          id="album-hashtags"
          className="input-field"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-inksoft dark:text-inksoftdark">Suggested:</span>
            {suggestions.map((tag) => (
              <button
                type="button"
                key={tag}
                className="hashtag text-xs"
                onClick={() => addSuggestion(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Creating..." : "Create album"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
