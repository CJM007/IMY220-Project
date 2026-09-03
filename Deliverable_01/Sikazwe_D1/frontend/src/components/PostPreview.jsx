import { Link } from "react-router-dom";

function PostPreview({ post }) {
  return (
    <article className="post-preview">
      <Link to={`/post/${post.id}`}>
        <img
          src={post.coverImage || "https://placehold.co/300x400?text=No+Cover"}
          alt={post.bookTitle}
        />
      </Link>
      <div>
        <p>
          <strong>{post.username}</strong> finsished reading{" "}
          <Link to={`/post/${post.id}`}>{post.bookTitle}</Link>
        </p>
        <p>{post.description}</p>
        <div>
          {post.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{post.commentCount} comments</p>
      </div>
    </article>
  );
}

export default PostPreview;
