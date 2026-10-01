import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileInfo from "../components/ProfileInfo";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import UserPosts from "../components/UserPosts";
import Friend from "../components/Friend";
import AlbumPreview from "../components/AlbumPreview";
import CreateAlbum from "../components/CreateAlbum";
import {
  getUser,
  updateUserProfile,
  addFriend,
  removeFriend,
  deleteAccount,
  getPostsByUser,
  createPost,
  getAlbumsByUser,
  createAlbum,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "../api";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [user, setUser] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // "/profile/me" resolves to whoever's actually logged in
  const profileId = id === "me" ? currentUser?._id : id;
  const isOwner = Boolean(currentUser) && profileId === currentUser._id;
  const isFriend =
    Boolean(currentUser) && !isOwner && currentUser.friends.includes(profileId);

  useEffect(() => {
    if (!profileId) return;

    setLoading(true);
    setError("");
    setIsEditing(false);
    setIsCreatingPost(false);
    setIsCreatingAlbum(false);

    getUser(profileId)
      .then((fetchedUser) => {
        setUser(fetchedUser);
        return Promise.all(fetchedUser.friends.map((fid) => getUser(fid)));
      })
      .then((friendsData) => setFriendsList(friendsData))
      .then(() => getPostsByUser(profileId))
      .then((fetchedPosts) => setPosts(fetchedPosts))
      .then(() => getAlbumsByUser(profileId))
      .then((fetchedAlbums) => setAlbums(fetchedAlbums))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId]);

  function syncCurrentUser(updatedUser) {
    setCurrentUserState(updatedUser);
    setCurrentUser(updatedUser);
  }

  async function handleSave(updatedFields) {
    const updated = await updateUserProfile(profileId, updatedFields);
    setUser(updated);
    if (isOwner) syncCurrentUser(updated);
    setIsEditing(false);
  }

  async function handleCreatePost(newPostData) {
    const created = await createPost({
      ...newPostData,
      userId: currentUser._id,
      username: currentUser.username,
    });
    setPosts((prev) => [created, ...prev]);
    setIsCreatingPost(false);
  }

  async function handleCreateAlbum(newAlbumData) {
    const created = await createAlbum({
      ...newAlbumData,
      userId: currentUser._id,
      username: currentUser.username,
    });
    setAlbums((prev) => [created, ...prev]);
    setIsCreatingAlbum(false);
  }

  async function handleAddFriend() {
    await addFriend(currentUser._id, profileId);
    const refreshedCurrent = await getUser(currentUser._id);
    syncCurrentUser(refreshedCurrent);
    setUser(await getUser(profileId));
  }

  async function handleRemoveFriend() {
    await removeFriend(currentUser._id, profileId);
    const refreshedCurrent = await getUser(currentUser._id);
    syncCurrentUser(refreshedCurrent);
    setUser(await getUser(profileId));
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Delete your account? This can't be undone.")) return;
    await deleteAccount(currentUser._id);
    clearCurrentUser();
    navigate("/");
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!user) return null;

  // Not friends and not your own profile: name + picture only, per spec
  if (!isOwner && !isFriend) {
    return (
      <div className="profile-info">
        <img src={user.profilePic} alt={user.name} />
        <div>
          <h1>{user.name}</h1>
          <p>@{user.username}</p>
          <button onClick={handleAddFriend}>Add friend</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <EditProfile user={user} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <ProfileInfo user={user} isOwner={isOwner} onEditClick={() => setIsEditing(true)} />
      )}

      {isOwner && <button onClick={handleDeleteAccount}>Delete my account</button>}
      {!isOwner && isFriend && <button onClick={handleRemoveFriend}>Unfriend</button>}

      <h2>Friends</h2>
      {friendsList.length === 0 ? (
        <p>No friends to show.</p>
      ) : (
        friendsList.map((friend) => <Friend key={friend._id} friend={friend} />)
      )}

      <h2>Posts</h2>
      {isOwner && (
        <>
          <button onClick={() => setIsCreatingPost((prev) => !prev)}>
            {isCreatingPost ? "Cancel" : "New post"}
          </button>
          {isCreatingPost && <CreatePost onCreate={handleCreatePost} />}
        </>
      )}
      <UserPosts posts={posts} />

      <h2>Reading lists</h2>
      {isOwner && (
        <>
          <button onClick={() => setIsCreatingAlbum((prev) => !prev)}>
            {isCreatingAlbum ? "Cancel" : "New album"}
          </button>
          {isCreatingAlbum && <CreateAlbum onCreate={handleCreateAlbum} />}
        </>
      )}
      {albums.length === 0 ? (
        <p>No reading lists yet.</p>
      ) : (
        <div className="album-grid">
          {albums.map((album) => (
            <AlbumPreview key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
