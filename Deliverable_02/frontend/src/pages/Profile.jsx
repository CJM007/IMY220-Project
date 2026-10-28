import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUser,
  deleteAccount,
  addFriend,
  removeFriend,
  toggleFavorite,
  requestVerification,
} from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import EditProfile from "../components/EditProfile.jsx";
import Friend from "../components/Friend.jsx";
import PostPreview from "../components/PostPreview.jsx";
import AlbumPreview from "../components/AlbumPreview.jsx";
import CreateAlbum from "../components/CreateAlbum.jsx";

export default function Profile() {
  const { id } = useParams();
  const { user: me, setUser: setMe } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const targetId = id === "me" ? me?._id : id;

  useEffect(() => {
    let active = true;
    setLoading(true);
    getUser(targetId)
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [targetId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!data) return <p>Profile not found.</p>;

  const { user, posts, albums, relationship } = data;
  const isSelf = relationship === "self";
  const isFriend = relationship === "friend";
  const isStranger = relationship === "stranger";
  // Whether the signed-in viewer (not necessarily "user" on this page) is
  // already friends with the profile being viewed.
  const alreadyFriends = me?.friends?.some((f) => (f.toString?.() || f) === user._id);
  const isFavorite = me?.favorites?.some((f) => (f.toString?.() || f) === user._id);

  async function handleFriendToggle() {
    try {
      if (alreadyFriends) {
        await removeFriend(user._id);
        setMe((u) => ({ ...u, friends: (u.friends || []).filter((f) => (f.toString?.() || f) !== user._id) }));
      } else {
        await addFriend(user._id);
        setMe((u) => ({ ...u, friends: [...(u.friends || []), user._id] }));
      }
      const res = await getUser(targetId);
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFavorite() {
    try {
      const result = await toggleFavorite(user._id);
      setMe((u) => {
        const favorites = result.favorited
          ? [...(u.favorites || []), user._id]
          : (u.favorites || []).filter((f) => (f.toString?.() || f) !== user._id);
        return { ...u, favorites };
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await deleteAccount(user._id);
      setMe(null);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVerifyRequest() {
    try {
      await requestVerification();
      setMe((u) => ({ ...u, verificationRequested: true }));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="card mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <Avatar user={user} size={20} />
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              {user.username}
              {user.isVerified && <span title="Verified" className="text-gold">✔</span>}
            </h1>
            {!isStranger && <p className="text-inksoft dark:text-inksoftdark mt-1">{user.bio}</p>}

            <div className="flex flex-wrap gap-2 mt-3">
              {isSelf && (
                <>
                  <button className="btn-secondary text-sm" onClick={() => setEditing((e) => !e)}>
                    {editing ? "Close editor" : "Edit profile"}
                  </button>
                  {!user.isVerified && !me?.verificationRequested && (
                    <button className="btn-secondary text-sm" onClick={handleVerifyRequest}>
                      Request verification
                    </button>
                  )}
                  {me?.verificationRequested && (
                    <span className="text-sm text-inksoft dark:text-inksoftdark self-center">
                      Verification pending admin review
                    </span>
                  )}
                  <button className="btn-danger text-sm" onClick={handleDelete}>Delete account</button>
                </>
              )}
              {!isSelf && !isStranger && (
                <>
                  <button className="btn-secondary text-sm" onClick={handleFriendToggle}>
                    {alreadyFriends ? "Remove friend" : "Add friend"}
                  </button>
                  <button className="btn-secondary text-sm" onClick={handleFavorite}>
                    {isFavorite ? "★ Favorited" : "☆ Favorite"}
                  </button>
                </>
              )}
              {isStranger && (
                <button className="btn-secondary text-sm" onClick={handleFriendToggle}>
                  {alreadyFriends ? "Request sent" : "Send friend request"}
                </button>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-4">
            <EditProfile
              user={user}
              onCancel={() => setEditing(false)}
              onSaved={(updated) => {
                setMe(updated);
                setData((d) => ({ ...d, user: updated }));
                setEditing(false);
              }}
            />
          </div>
        )}
      </div>

      {isStranger ? (
        <p className="text-inksoft dark:text-inksoftdark">
          Add {user.username} as a friend to see their posts, albums, and friend list.
        </p>
      ) : (
        <>
          {(isSelf || isFriend) && (
            <section className="mb-6">
              <h2 className="font-heading text-xl mb-2">Friends</h2>
              {data.friends?.length ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  {data.friends.map((friend) => (
                    <Friend key={friend._id} user={friend} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-inksoft dark:text-inksoftdark">No friends yet.</p>
              )}
            </section>
          )}

          <section className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-heading text-xl">Albums</h2>
            </div>
            {isSelf && (
              <CreateAlbum onCreated={(album) => setData((d) => ({ ...d, albums: [album, ...d.albums] }))} />
            )}
            {albums?.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {albums.map((album) => (
                  <AlbumPreview key={album._id} album={album} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-inksoft dark:text-inksoftdark">No albums yet.</p>
            )}
          </section>

          <section>
            <h2 className="font-heading text-xl mb-2">Posts</h2>
            {posts?.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <PostPreview key={post._id} post={post} author={user} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-inksoft dark:text-inksoftdark">No posts yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
