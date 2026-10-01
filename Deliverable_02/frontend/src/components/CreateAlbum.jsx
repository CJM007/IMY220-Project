import { useState } from "react";

function CreateAlbum({ onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hashtags: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onCreate({
        ...formData,
        hashtags: formData.hashtags.split(" ").filter(Boolean),
      });
      setFormData({ name: "", description: "", hashtags: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-album-form">
      {error && <p className="error-text">{error}</p>}

      <label htmlFor="album-name">Album name</label>
      <input
        id="album-name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="album-description">Description</label>
      <textarea
        id="album-description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label htmlFor="album-hashtags">
        Hashtags (space-separated, e.g. #cozy #autumn)
      </label>
      <input
        id="album-hashtags"
        name="hashtags"
        value={formData.hashtags}
        onChange={handleChange}
      />

      <button type="submit">Create album</button>
    </form>
  );
}

export default CreateAlbum;
