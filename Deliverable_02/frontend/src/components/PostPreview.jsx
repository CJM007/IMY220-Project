import { useState } from "react";
import { Link } from "react-router-dom";

// A post reported more than twice is hidden from feeds by default, with a
// way to reveal it — per the main spec's "reported posts" requirement.
const REPORT_HIDE_THRESHOLD = 2;

function PostPreview({ post }) {
  const [revealed, setRevealed] = useState(false);

  const isHidden = (post.reports?.length || 0) > REPORT_HIDE_THRESHOLD && !revealed;

  if (isHidden) {
    return (
      <article className="post-preview post-preview-hidden">
        <p>This post has been reported multiple times and is hidden.</p>
        <button onClick={() => setRevealed(true)}>View anyway</button>
      </article>
    );
  }

  return (
    <article className="post-preview">
      <Link to={`/post/${post._id}`}>
        <img
          src={post.coverImage || "https://placehold.co/300x400?text=No+Cover"}
          alt={post.bookTitle}
        />
      </Link>
      <div>
        <p>
          <Link to={`/profile/${post.userId}`}>
            <strong>{post.username}</strong>
          </Link>{" "}
          finished reading{" "}
          <Link to={`/post/${post._id}`}>{post.bookTitle}</Link>
        </p>
        <p>{post.description}</p>
        <div>
          {(post.hashtags || []).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{post.comments?.length || 0} comments</p>
      </div>
    </article>
  );
}

export default PostPreview;
