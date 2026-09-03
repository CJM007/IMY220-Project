import PostPreview from "./PostPreview";

function UserPosts({ posts }) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <div className="user-posts">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}

export default UserPosts;
