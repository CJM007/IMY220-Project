import { useState } from "react";
import DropZone from "./DropZone.jsx";
import { createPost } from "../api.js";

export default function CreatePost({ onCreated }) {
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("hashtags", hashtags);
      if (file) formData.append("image", file);
      const data = await createPost(formData);
      onCreated?.(data.post);
      setDescription("");
      setHashtags("");
      setFile(null);
      setPreview(null);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary w-full mb-6" onClick={() => setOpen(true)}>
        + Share a book post
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-3" noValidate>
      <h3 className="font-heading text-lg">New post</h3>
      <div>
        <label htmlFor="post-description" className="label">Description</label>
        <textarea
          id="post-description"
          className="input-field"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="post-hashtags" className="label">Hashtags (comma separated)</label>
        <input
          id="post-hashtags"
          className="input-field"
          placeholder="scifi, dune, bookclub"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Cover image</label>
        <DropZone onFile={handleFile} preview={preview} />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Posting..." : "Post"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
