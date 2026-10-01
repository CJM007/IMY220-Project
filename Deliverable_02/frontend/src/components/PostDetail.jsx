import { useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import EditPost from "./EditPost";
import ReportPost from "./ReportPost";

function PostDetail({ post, albums, isOwner, onUpdate, onDelete, onReport }) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSave(updatedFields) {
    await onUpdate(updatedFields);
    setIsEditing(false);
  }

  return (
    <article className="post-detail">
      <Image src={post.coverImage} alt={post.bookTitle} />

      <div className="post-detail-info">
        <p>
          Posted by{" "}
          <Link to={`/profile/${post.userId}`}>
            <strong>{post.username}</strong>
          </Link>{" "}
          · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h1>{post.bookTitle}</h1>
        <p>{post.author}</p>

        {isEditing ? (
          <EditPost post={post} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        ) : (
          <>
            <p>{post.description}</p>
            <div>
              {(post.hashtags || []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </>
        )}

        {albums.length > 0 && (
          <p>
            In{" "}
            {albums.map((album, i) => (
              <span key={album._id}>
                <Link to={`/album/${album._id}`}>{album.name}</Link>
                {i < albums.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}

        {isOwner && !isEditing && (
          <div className="owner-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={onDelete}>Delete post</button>
          </div>
        )}

        {!isOwner && <ReportPost onReport={onReport} />}
      </div>
    </article>
  );
}

export default PostDetail;
