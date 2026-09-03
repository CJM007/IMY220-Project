import { useState } from "react";

function Comments({ comments, onAddComment }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText("");
  }

  return (
    <div className="comments">
      <h3>Comments</h3>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <strong>{comment.username}</strong>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            <p>{comment.text}</p>
          </div>
        ))
      )}
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
