import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost, deletePost, reportPost, imageUrl } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import EditPost from "../components/EditPost.jsx";
import ReportPost from "../components/ReportPost.jsx";
import Comments from "../components/Comments.jsx";
import Hashtags from "../components/Hashtags.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Post() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [commentAuthors, setCommentAuthors] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPost(id)
      .then((data) => {
        if (!active) return;
        setPost(data.post);
        setAlbums(data.albums || []);
        setCommentAuthors(data.commentAuthors || {});
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  const isOwner = user && post.userId?.toString() === user._id;

  async function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await deletePost(post._id);
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleAddedComment(comment) {
    setPost((p) => ({ ...p, comments: [...(p.comments || []), comment] }));
    setCommentAuthors((m) => ({
      ...m,
      [comment.userId.toString?.() || comment.userId]: {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        avatarColor: user.avatarColor,
      },
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Avatar user={post.author} size={8} />
          <Link to={`/profile/${post.author?._id}`} className="font-semibold">
            {post.author?.username || "Unknown"}
          </Link>
          <span className="text-xs text-inksoft dark:text-inksoftdark ml-auto">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        <img
          src={imageUrl(post.image) || "https://picsum.photos/seed/placeholder/600/400"}
          alt=""
          className="w-full max-h-96 object-cover rounded-lg mb-3"
        />

        {editing ? (
          <EditPost
            post={post}
            onCancel={() => setEditing(false)}
            onSaved={(updated) => {
              setPost((p) => ({ ...p, ...updated }));
              setEditing(false);
            }}
          />
        ) : (
          <>
            <p className="mb-2">{post.description}</p>
            <Hashtags tags={post.hashtags} />
          </>
        )}

        {albums.length > 0 && (
          <p className="text-sm mt-3">
            In album{albums.length > 1 ? "s" : ""}:{" "}
            {albums.map((a, i) => (
              <span key={a._id}>
                <Link to={`/album/${a._id}`} className="text-rust">{a.name}</Link>
                {i < albums.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}

        {isOwner ? (
          !editing && (
            <div className="flex gap-2 mt-4">
              <button className="btn-secondary text-sm" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn-danger text-sm" onClick={handleDelete}>Delete</button>
            </div>
          )
        ) : (
          <div className="mt-4">
            <ReportPost postId={post._id} onReport={reportPost} />
          </div>
        )}

        <Comments
          postId={post._id}
          comments={post.comments}
          commentAuthors={commentAuthors}
          onAdded={handleAddedComment}
        />
      </div>
    </div>
  );
}
