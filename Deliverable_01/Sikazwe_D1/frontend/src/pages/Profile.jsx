import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "../components/ProfileInfo";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import UserPosts from "../components/UserPosts";
import Friend from "../components/Friend";
import { dummyUser, dummyFriends, dummyPosts } from "../assets/dummyData";

function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(dummyUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [posts, setPosts] = useState(
    dummyPosts.filter((post) => post.username === dummyUser.username),
  );

  useEffect(() => {
    const found =
      Number(id) === dummyUser.id
        ? dummyUser
        : dummyFriends.find((f) => f.id === Number(id)) || dummyUser;

    setUser(found);
    setIsEditing(false);
    setIsCreating(false);
    setPosts(dummyPosts.filter((post) => post.username === found.username));
  }, [id]);

  // Is the profile being viewed the same as the logged-in user?
  // There's no real auth session yet, so "logged in" is stubbed as dummyUser.
  const isOwner = user.id === dummyUser.id;

  // A person shouldn't appear in their own friends list.
  const friendsToShow = dummyFriends.filter((f) => f.id !== user.id);

  function handleSave(updatedFields) {
    setUser((prev) => ({ ...prev, ...updatedFields }));
    setIsEditing(false);
  }

  function handleCreatePost(newPost) {
    setPosts((prev) => [
      { ...newPost, id: Date.now(), username: user.username, comments: [] },
      ...prev,
    ]);
    setIsCreating(false);
  }

  return (
    <div>
      {isEditing ? (
        <EditProfile
          user={user}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileInfo
          user={user}
          isOwner={isOwner}
          onEditClick={() => setIsEditing(true)}
        />
      )}

      <h2>Friends</h2>
      {friendsToShow.length === 0 ? (
        <p>No friends to show.</p>
      ) : (
        friendsToShow.map((friend) => (
          <Friend key={friend.id} friend={friend} />
        ))
      )}

      {isOwner && (
        <>
          <h2>Posts</h2>
          <button onClick={() => setIsCreating((prev) => !prev)}>
            {isCreating ? "Cancel" : "New post"}
          </button>
          {isCreating && <CreatePost onCreate={handleCreatePost} />}
        </>
      )}

      {!isOwner && <h2>Posts</h2>}
      <UserPosts posts={posts} />
    </div>
  );
}

export default Profile;
