import { useState } from "react";
import Image from "./Image";
import EditPost from "./EditPost";

function PostDetail({ post, isOwner, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleSave(updatedFields) {
    onUpdate(updatedFields);
    setIsEditing(false);
  }

  return (
    <article className="post-detail">
      <Image src={post.coverImage} alt={post.bookTitle} />

      <div className="post-detail-info">
        <p>
          Posted by <strong>{post.username}</strong> ·{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h1>{post.bookTitle}</h1>
        <p>{post.author}</p>

        {isEditing ? (
          <EditPost
            post={post}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p>{post.description}</p>
            <div>
              {post.hashtags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </>
        )}

        {isOwner && !isEditing && (
          <div className="owner-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={onDelete}>Delete post</button>
          </div>
        )}
      </div>
    </article>
  );
}

export default PostDetail;
