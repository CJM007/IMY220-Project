import { useEffect, useState } from "react";
import {
  adminGetUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminGetVerificationRequests,
  adminSetVerified,
  adminGetPosts,
  adminDeletePost,
  adminGetReportedPosts,
  adminClearReports,
  adminGetAlbums,
  adminDeleteAlbum,
  adminGetReasons,
  adminAddReason,
  adminDeleteReason,
  imageUrl,
} from "../api.js";

const TABS = ["Users", "Posts", "Albums", "Reported posts", "Verification", "Report reasons"];

export default function Admin() {
  const [tab, setTab] = useState("Users");
  const [error, setError] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-4">Admin dashboard</h1>
      <div className="flex gap-2 flex-wrap mb-6 border-b border-border dark:border-borderdark">
        {TABS.map((t) => (
          <button
            key={t}
            className={`px-3 py-2 text-sm font-semibold ${tab === t ? "text-rust border-b-2 border-rust" : "text-inksoft dark:text-inksoftdark"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {error && <p className="error-text mb-4">{error}</p>}
      {tab === "Users" && <UsersTab setError={setError} />}
      {tab === "Posts" && <PostsTab setError={setError} />}
      {tab === "Albums" && <AlbumsTab setError={setError} />}
      {tab === "Reported posts" && <ReportedTab setError={setError} />}
      {tab === "Verification" && <VerificationTab setError={setError} />}
      {tab === "Report reasons" && <ReasonsTab setError={setError} />}
    </div>
  );
}

function UsersTab({ setError }) {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    adminGetUsers().then((d) => setUsers(d.users)).catch((e) => setError(e.message));
  }, [setError]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this account? This cannot be undone.")) return;
    try {
      await adminDeleteUser(id);
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveBio(id) {
    try {
      const data = await adminUpdateUser(id, { bio });
      setUsers((u) => u.map((x) => (x._id === id ? data.user : x)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-2">
      {users.map((u) => (
        <div key={u._id} className="card flex flex-wrap items-center gap-3">
          {u.profileImage && <img src={imageUrl(u.profileImage)} alt="" className="w-8 h-8 rounded-full" />}
          <span className="font-semibold">{u.username}</span>
          <span className="text-sm text-inksoft dark:text-inksoftdark">{u.email}</span>
          {u.isAdmin && <span className="text-xs bg-gold/30 px-2 py-0.5 rounded">admin</span>}
          {u.isVerified && <span className="text-xs text-gold">✔ verified</span>}
          <div className="ml-auto flex gap-2">
            {editingId === u._id ? (
              <>
                <input className="input-field w-48" value={bio} onChange={(e) => setBio(e.target.value)} />
                <button className="btn-secondary text-xs" onClick={() => handleSaveBio(u._id)}>Save</button>
              </>
            ) : (
              <button
                className="btn-secondary text-xs"
                onClick={() => {
                  setEditingId(u._id);
                  setBio(u.bio || "");
                }}
              >
                Edit bio
              </button>
            )}
            <button className="btn-danger text-xs" onClick={() => handleDelete(u._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PostsTab({ setError }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    adminGetPosts().then((d) => setPosts(d.posts)).catch((e) => setError(e.message));
  }, [setError]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this post? The author will be notified.")) return;
    try {
      await adminDeletePost(id);
      setPosts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((p) => (
        <div key={p._id} className="card">
          {p.image && <img src={imageUrl(p.image)} alt="" className="w-full h-32 object-cover rounded mb-2" />}
          <p className="text-sm line-clamp-3">{p.description}</p>
          <p className="text-xs text-inksoft dark:text-inksoftdark mt-1">
            {p.reports?.length || 0} report{p.reports?.length === 1 ? "" : "s"}
          </p>
          <button className="btn-danger text-xs mt-2" onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
      {posts.length === 0 && <p>No posts.</p>}
    </div>
  );
}

function AlbumsTab({ setError }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    adminGetAlbums().then((d) => setAlbums(d.albums)).catch((e) => setError(e.message));
  }, [setError]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this album? The owner will be notified.")) return;
    try {
      await adminDeleteAlbum(id);
      setAlbums((a) => a.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums.map((a) => (
        <div key={a._id} className="card">
          <h4 className="font-heading font-semibold">{a.name}</h4>
          <p className="text-sm text-inksoft dark:text-inksoftdark line-clamp-2">{a.description}</p>
          <p className="text-xs mt-1">{a.postIds?.length || 0} posts</p>
          <button className="btn-danger text-xs mt-2" onClick={() => handleDelete(a._id)}>Delete</button>
        </div>
      ))}
      {albums.length === 0 && <p>No albums.</p>}
    </div>
  );
}

function ReportedTab({ setError }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    adminGetReportedPosts().then((d) => setPosts(d.posts)).catch((e) => setError(e.message));
  }, [setError]);

  async function handleClear(id) {
    try {
      await adminClearReports(id);
      setPosts((p) => p.map((x) => (x._id === id ? { ...x, reports: [] } : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this reported post?")) return;
    try {
      await adminDeletePost(id);
      setPosts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-3">
      {posts.map((p) => {
        const abuseFlag = p.reports?.some((r) => r.flaggedAsAbuse);
        return (
          <div key={p._id} className="card">
            <p className="mb-1">{p.description}</p>
            {abuseFlag && (
              <p className="text-xs text-error mb-1">⚠ Possible abuse of the reporting feature detected on this post.</p>
            )}
            <ul className="text-sm list-disc ml-5 mb-2">
              {p.reports?.map((r) => (
                <li key={r._id}>{r.reasonText}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs" onClick={() => handleClear(p._id)}>Dismiss reports</button>
              <button className="btn-danger text-xs" onClick={() => handleDelete(p._id)}>Delete post</button>
            </div>
          </div>
        );
      })}
      {posts.length === 0 && <p>No reported posts.</p>}
    </div>
  );
}

function VerificationTab({ setError }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminGetVerificationRequests().then((d) => setUsers(d.users)).catch((e) => setError(e.message));
  }, [setError]);

  async function handleDecision(id, approve) {
    try {
      await adminSetVerified(id, approve);
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-2">
      {users.map((u) => (
        <div key={u._id} className="card flex items-center gap-3">
          <span className="font-semibold">{u.username}</span>
          <span className="text-sm text-inksoft dark:text-inksoftdark">{u.email}</span>
          <div className="ml-auto flex gap-2">
            <button className="btn-primary text-xs" onClick={() => handleDecision(u._id, true)}>Approve</button>
            <button className="btn-secondary text-xs" onClick={() => handleDecision(u._id, false)}>Decline</button>
          </div>
        </div>
      ))}
      {users.length === 0 && <p>No pending verification requests.</p>}
    </div>
  );
}

function ReasonsTab({ setError }) {
  const [reasons, setReasons] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    adminGetReasons().then((d) => setReasons(d.reasons)).catch((e) => setError(e.message));
  }, [setError]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const data = await adminAddReason(text.trim());
      setReasons((r) => [...r, data.reason]);
      setText("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await adminDeleteReason(id);
      setReasons((r) => r.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          className="input-field"
          placeholder="New report reason..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn-primary">Add</button>
      </form>
      <ul className="space-y-2">
        {reasons.map((r) => (
          <li key={r._id} className="card flex items-center justify-between">
            <span>{r.text}</span>
            <button className="btn-danger text-xs" onClick={() => handleDelete(r._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
