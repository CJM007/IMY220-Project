import { useState } from "react";

function EditPost({ post, onSave, onCancel }) {
  const [description, setDescription] = useState(post.description);
  const [hashtags, setHashtags] = useState(post.hashtags.join(" "));

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      description,
      hashtags: hashtags.split(" ").filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="edit-post-form">
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="hashtags">Hashtags</label>
      <input
        id="hashtags"
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

export default EditPost;
