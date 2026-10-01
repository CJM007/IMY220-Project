import { useState } from "react";

function Comments({ comments, onAddComment }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    try {
      await onAddComment(text.trim());
      setText("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="comments">
      <h3>Comments</h3>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment, index) => (
          <div key={comment._id || index} className="comment">
            <strong>{comment.username}</strong>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            <p>{comment.text}</p>
          </div>
        ))
      )}

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="comment">Add a comment</label>
        <input
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default Comments;
