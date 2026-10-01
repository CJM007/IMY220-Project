import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostDetail from "../components/PostDetail";
import Comments from "../components/Comments";
import {
  getPost,
  getAlbumsForPost,
  updatePost,
  deletePost,
  addComment,
  reportPost,
  getCurrentUser,
} from "../api";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [post, setPost] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([getPost(id), getAlbumsForPost(id)])
      .then(([fetchedPost, fetchedAlbums]) => {
        setPost(fetchedPost);
        setAlbums(fetchedAlbums);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate(updatedFields) {
    const updated = await updatePost(id, updatedFields);
    setPost(updated);
  }

  async function handleAddComment(text) {
    const updated = await addComment(id, {
      userId: currentUser._id,
      username: currentUser.username,
      text,
    });
    setPost(updated);
  }

  async function handleReport(reason) {
    await reportPost(id, currentUser._id, reason);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${post.bookTitle}"? This can't be undone.`)) return;
    await deletePost(id);
    navigate("/home");
  }

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!post) return null;

  const isOwner = Boolean(currentUser) && post.userId === currentUser._id;

  return (
    <div>
      <PostDetail
        post={post}
        albums={albums}
        isOwner={isOwner}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onReport={handleReport}
      />
      <Comments comments={post.comments} onAddComment={handleAddComment} />
    </div>
  );
}

export default Post;
