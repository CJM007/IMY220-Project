import { useState } from "react";
import { updatePost } from "../api.js";

export default function EditPost({ post, onSaved, onCancel }) {
  const [description, setDescription] = useState(post.description);
  const [hashtags, setHashtags] = useState((post.hashtags || []).join(", "));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    setPending(true);
    try {
      const data = await updatePost(post._id, { description: description.trim(), hashtags });
      onSaved(data.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3" noValidate>
      <div>
        <label htmlFor="edit-description" className="label">Description</label>
        <textarea
          id="edit-description"
          className="input-field"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="edit-hashtags" className="label">Hashtags</label>
        <input
          id="edit-hashtags"
          className="input-field"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
