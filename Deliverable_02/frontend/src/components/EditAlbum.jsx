import { useState } from "react";

function EditAlbum({ album, onSave, onCancel }) {
  const [name, setName] = useState(album.name);
  const [description, setDescription] = useState(album.description);
  const [hashtags, setHashtags] = useState((album.hashtags || []).join(" "));
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSave({
        name,
        description,
        hashtags: hashtags.split(" ").filter(Boolean),
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="edit-album-form">
      {error && <p className="error-text">{error}</p>}

      <label htmlFor="edit-album-name">Album name</label>
      <input
        id="edit-album-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="edit-album-description">Description</label>
      <textarea
        id="edit-album-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="edit-album-hashtags">Hashtags</label>
      <input
        id="edit-album-hashtags"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />

      <button type="submit">Save changes</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EditAlbum;
