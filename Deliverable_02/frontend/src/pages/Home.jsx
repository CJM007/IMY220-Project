import { useEffect, useState } from "react";
import { getFeed, getHiddenPosts } from "../api.js";
import CreatePost from "../components/CreatePost.jsx";
import PostPreview from "../components/PostPreview.jsx";

export default function Home() {
  const [scope, setScope] = useState("global");
  const [sort, setSort] = useState("newest");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [hiddenPosts, setHiddenPosts] = useState([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getFeed({ scope, sort })
      .then((data) => {
        if (active) setPosts(data.posts);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [scope, sort]);

  async function loadHidden() {
    try {
      const data = await getHiddenPosts();
      setHiddenPosts(data.posts);
      setShowHidden(true);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCreated(post) {
    setPosts((p) => [post, ...p]);
  }

  return (
    <div>
      <CreatePost onCreated={handleCreated} />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg overflow-hidden border border-border dark:border-borderdark">
          <button
            className={`px-3 py-1 text-sm ${scope === "local" ? "bg-rust text-paper" : "bg-cardbg dark:bg-cardbgdark"}`}
            onClick={() => setScope("local")}
          >
            Friends
          </button>
          <button
            className={`px-3 py-1 text-sm ${scope === "global" ? "bg-rust text-paper" : "bg-cardbg dark:bg-cardbgdark"}`}
            onClick={() => setScope("global")}
          >
            Everyone
          </button>
        </div>

        <select
          className="input-field w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort posts"
        >
          <option value="newest">Newest first</option>
          <option value="mostCommented">Most commented this week</option>
        </select>

        <button className="btn-secondary text-sm" onClick={loadHidden}>
          View hidden/reported posts
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {showHidden && (
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-heading">Hidden posts (reported more than twice)</h3>
            <button className="text-sm text-inksoft dark:text-inksoftdark" onClick={() => setShowHidden(false)}>
              Close ✕
            </button>
          </div>
          {hiddenPosts.length === 0 ? (
            <p className="text-sm text-inksoft dark:text-inksoftdark">No hidden posts right now.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {hiddenPosts.map((post) => (
                <PostPreview key={post._id} post={post} author={post.author} />
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p>Loading feed...</p>
      ) : posts.length === 0 ? (
        <p className="text-inksoft dark:text-inksoftdark">
          Nothing here yet. {scope === "local" ? "Add some friends or switch to Everyone." : "Be the first to post!"}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostPreview key={post._id} post={post} author={post.author} />
          ))}
        </div>
      )}
    </div>
  );
}
