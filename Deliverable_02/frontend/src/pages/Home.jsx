import { useState, useEffect } from "react";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";
import { getLocalFeed, getAllPosts, getCurrentUser } from "../api";

function Home() {
  const currentUser = getCurrentUser();
  const [feedType, setFeedType] = useState("local");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    setError("");

    const request =
      feedType === "local"
        ? getLocalFeed([currentUser._id, ...currentUser.friends])
        : getAllPosts();

    request
      .then((fetchedPosts) => setPosts(fetchedPosts))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [feedType]);

  return (
    <div>
      <h1>Home</h1>
      <SearchInput />

      <div className="feed-tabs">
        <button
          className={feedType === "local" ? "active" : ""}
          onClick={() => setFeedType("local")}
        >
          My Shelf (friends)
        </button>
        <button
          className={feedType === "global" ? "active" : ""}
          onClick={() => setFeedType("global")}
        >
          Explore (everyone)
        </button>
      </div>

      {loading && <p>Loading feed...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <Feed posts={posts} />}
    </div>
  );
}

export default Home;
