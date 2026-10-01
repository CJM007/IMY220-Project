import { useState } from "react";

function CreatePost({ onCreate }) {
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
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
        coverImage: "https://placehold.co/300x400?text=No+Cover",
      });
      setFormData({ bookTitle: "", author: "", description: "", hashtags: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      {error && <p className="error-text">{error}</p>}

      <label htmlFor="bookTitle">Book title</label>
      <input
        id="bookTitle"
        name="bookTitle"
        value={formData.bookTitle}
        onChange={handleChange}
        required
      />

      <label htmlFor="author">Author</label>
      <input
        id="author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label htmlFor="hashtags">
        Hashtags (space-separated, e.g. #ilovereading #nature)
      </label>
      <input
        id="hashtags"
        name="hashtags"
        value={formData.hashtags}
        onChange={handleChange}
      />

      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePost;
