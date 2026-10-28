import { useState } from "react";
import DropZone from "./DropZone.jsx";
import { updateUser, uploadProfileImage, imageUrl } from "../api.js";

export default function EditProfile({ user, onSaved, onCancel }) {
  const [bio, setBio] = useState(user.bio || "");
  const [username, setUsername] = useState(user.username || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(imageUrl(user.profileImage));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleFile(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    setPending(true);
    setError("");
    try {
      let updatedUser = (await updateUser("me", { username: username.trim(), bio })).user;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        updatedUser = (await uploadProfileImage("me", formData)).user;
      }
      onSaved(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3" noValidate>
      <div>
        <label htmlFor="profile-picture" className="label">Profile picture</label>
        <DropZone onFile={handleFile} preview={preview} label="Drag a new profile photo here, or click to choose one" />
      </div>
      <div>
        <label htmlFor="edit-username" className="label">Username</label>
        <input
          id="edit-username"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="edit-bio" className="label">Bio</label>
        <textarea
          id="edit-bio"
          className="input-field"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Saving..." : "Save profile"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
