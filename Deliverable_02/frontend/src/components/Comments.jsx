import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { addComment } from "../api.js";

export default function Comments({ postId, comments, commentAuthors, onAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Write something first.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const data = await addComment(postId, text.trim());
      onAdded?.(data.comment);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  const sorted = [...(comments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="mt-6">
      <h3 className="font-heading text-lg mb-2">
        Comments {comments?.length ? `(${comments.length})` : ""}
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4" noValidate>
        <input
          className="input-field"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn-primary" disabled={pending}>
          {pending ? "..." : "Send"}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sorted.length === 0 && (
          <p className="text-sm text-inksoft dark:text-inksoftdark">No comments yet.</p>
        )}
        {sorted.map((c) => {
          const author = commentAuthors?.[c.userId?.toString?.() || c.userId];
          return (
            <div key={c._id} className="flex gap-2">
              <Avatar user={author} size={7} />
              <div>
                {author ? (
                  <Link to={`/profile/${author._id}`} className="font-semibold text-sm">
                    {author.username}
                  </Link>
                ) : (
                  <span className="font-semibold text-sm">Unknown user</span>
                )}
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
