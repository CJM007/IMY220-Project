import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getAlbum,
  updateAlbum,
  deleteAlbum,
  removePostFromAlbum,
  addPostToAlbum,
  getFeed,
} from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import PostPreview from "../components/PostPreview.jsx";
import Hashtags from "../components/Hashtags.jsx";

export default function Album() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({ name: "", description: "", hashtags: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAlbum(id)
      .then((data) => {
        if (!active) return;
        setAlbum(data.album);
        setFields({
          name: data.album.name,
          description: data.album.description || "",
          hashtags: (data.album.hashtags || []).join(", "),
        });
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const isOwner = user && album && album.userId?.toString() === user._id;

  useEffect(() => {
    if (isOwner) {
      getFeed({ scope: "local" }).then((data) =>
        setMyPosts(data.posts.filter((p) => (p.userId?.toString?.() || p.userId) === user._id))
      ).catch(() => {});
    }
  }, [isOwner, user]);

  if (loading) return <p>Loading album...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!album) return <p>Album not found.</p>;

  async function handleSave(e) {
    e.preventDefault();
    try {
      const data = await updateAlbum(album._id, fields);
      setAlbum((a) => ({ ...a, ...data.album }));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this album? Posts inside it will not be deleted.")) return;
    try {
      await deleteAlbum(album._id);
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddPost() {
    if (!selectedPostId) return;
    try {
      await addPostToAlbum(album._id, selectedPostId);
      const refreshed = await getAlbum(album._id);
      setAlbum(refreshed.album);
      setSelectedPostId("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemovePost(postId) {
    try {
      await removePostFromAlbum(album._id, postId);
      setAlbum((a) => ({
        ...a,
        posts: a.posts.filter((p) => p._id !== postId),
        postIds: a.postIds.filter((pid) => (pid.toString?.() || pid) !== postId),
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  const availablePosts = myPosts.filter(
    (p) => !album.postIds?.some((pid) => (pid.toString?.() || pid) === p._id)
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card mb-4">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-3" noValidate>
            <div>
              <label htmlFor="album-edit-name" className="label">Name</label>
              <input
                id="album-edit-name"
                className="input-field"
                value={fields.name}
                onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="album-edit-description" className="label">Description</label>
              <textarea
                id="album-edit-description"
                className="input-field"
                rows={2}
                value={fields.description}
                onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="album-edit-hashtags" className="label">Hashtags</label>
              <input
                id="album-edit-hashtags"
                className="input-field"
                value={fields.hashtags}
                onChange={(e) => setFields((f) => ({ ...f, hashtags: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-heading font-bold">{album.name}</h1>
                {album.author && (
                  <Link to={`/profile/${album.author._id}`} className="text-sm text-inksoft dark:text-inksoftdark">
                    by {album.author.username}
                  </Link>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm" onClick={() => setEditing(true)}>Edit</button>
                  <button className="btn-danger text-sm" onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
            <p className="mt-2">{album.description}</p>
            <Hashtags tags={album.hashtags} />
          </>
        )}
      </div>

      {isOwner && (
        <div className="card mb-4 flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="add-post-select" className="label">Add one of your posts to this album</label>
            <select
              id="add-post-select"
              className="input-field"
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
            >
              <option value="">Choose a post...</option>
              {availablePosts.map((p) => (
                <option key={p._id} value={p._id}>{p.description.slice(0, 50)}</option>
              ))}
            </select>
          </div>
          <button className="btn-primary" onClick={handleAddPost} disabled={!selectedPostId}>Add</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(album.posts || []).map((post) => (
          <div key={post._id} className="relative">
            <PostPreview post={post} author={album.author} />
            {isOwner && (
              <button
                className="absolute top-2 right-2 btn-danger text-xs px-2 py-1"
                onClick={() => handleRemovePost(post._id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {(album.posts || []).length === 0 && (
          <p className="text-sm text-inksoft dark:text-inksoftdark">No posts in this album yet.</p>
        )}
      </div>
    </div>
  );
}
