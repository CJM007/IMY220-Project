import { useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import UserPosts from "../components/UserPosts";
import Friend from "../components/Friend";
import { dummyUser, dummyFriends, dummyPosts } from "../assets/dummyData";

function Profile() {
  const [user, setUser] = useState(dummyUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [posts, setPosts] = useState(
    dummyPosts.filter((post) => post.username === dummyUser.username),
  );

  function handleSave(updatedFields) {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
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
        <ProfileInfo user={user} onEditClick={() => setIsEditing(true)} />
      )}

      <h2>Friends</h2>
      {dummyFriends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}

      <h2>Posts</h2>
      <button onClick={() => setIsCreating((prev) => !prev)}>
        {isCreating ? "Cancel" : "New post"}
      </button>
      {isCreating && <CreatePost onCreate={handleCreatePost} />}
      <UserPosts posts={posts} />
    </div>
  );
}

export default Profile;
