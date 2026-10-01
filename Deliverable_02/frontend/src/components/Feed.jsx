import PostPreview from "./PostPreview";

function Feed({ posts }) {
  if (posts.length === 0) {
    return <p>No posts to show yet.</p>;
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostPreview key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
