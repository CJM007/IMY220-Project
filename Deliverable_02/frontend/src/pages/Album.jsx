import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditAlbum from "../components/EditAlbum";
import UserPosts from "../components/UserPosts";
import {
  getAlbum,
  getPost,
  updateAlbum,
  deleteAlbum,
  addPostToAlbum,
  removePostFromAlbum,
  getPostsByUser,
  getCurrentUser,
} from "../api";

function Album() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [album, setAlbum] = useState(null);
  const [albumPosts, setAlbumPosts] = useState([]);
  const [ownerPosts, setOwnerPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAlbum() {
    setLoading(true);
    setError("");
    try {
      const fetchedAlbum = await getAlbum(id);
      setAlbum(fetchedAlbum);

      const posts = await Promise.all(fetchedAlbum.postIds.map((pid) => getPost(pid)));
      setAlbumPosts(posts);

      if (currentUser && fetchedAlbum.userId === currentUser._id) {
        const myPosts = await getPostsByUser(currentUser._id);
        setOwnerPosts(myPosts);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlbum();
    setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(updatedFields) {
    const updated = await updateAlbum(id, updatedFields);
    setAlbum(updated);
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete album "${album.name}"? Posts inside it won't be deleted.`))
      return;
    await deleteAlbum(id);
    navigate(`/profile/me`);
  }

  async function handleAddPost(e) {
    e.preventDefault();
    if (!selectedPostId) return;
    await addPostToAlbum(id, selectedPostId);
    setSelectedPostId("");
    loadAlbum();
  }

  async function handleRemovePost(postId) {
    await removePostFromAlbum(id, postId);
    loadAlbum();
  }

  if (loading) return <p>Loading album...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!album) return null;

  const isOwner = Boolean(currentUser) && album.userId === currentUser._id;

  // Posts the owner has that aren't already in this album — candidates to add
  const addablePosts = ownerPosts.filter(
    (post) => !album.postIds.includes(post._id)
  );

  return (
    <div>
      {isEditing ? (
        <EditAlbum album={album} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="album-header">
          <h1>{album.name}</h1>
          <p>{album.description}</p>
          <div>
            {(album.hashtags || []).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      {isOwner && !isEditing && (
        <div className="owner-actions">
          <button onClick={() => setIsEditing(true)}>Edit album</button>
          <button onClick={handleDelete}>Delete album</button>
        </div>
      )}

      {isOwner && addablePosts.length > 0 && (
        <form onSubmit={handleAddPost} className="add-to-album-form">
          <label htmlFor="add-post-select">Add one of your posts to this album</label>
          <select
            id="add-post-select"
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
          >
            <option value="">Choose a post...</option>
            {addablePosts.map((post) => (
              <option key={post._id} value={post._id}>
                {post.bookTitle}
              </option>
            ))}
          </select>
          <button type="submit">Add to album</button>
        </form>
      )}

      <h2>Books in this album</h2>
      {albumPosts.length === 0 ? (
        <p>No books in this album yet.</p>
      ) : (
        <>
          <UserPosts posts={albumPosts} />
          {isOwner &&
            albumPosts.map((post) => (
              <button key={post._id} onClick={() => handleRemovePost(post._id)}>
                Remove "{post.bookTitle}" from album
              </button>
            ))}
        </>
      )}
    </div>
  );
}

export default Album;
