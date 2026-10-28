import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchUsers, searchPosts, searchAlbums, getPostsByHashtag } from "../api.js";
import Avatar from "../components/Avatar.jsx";
import PostPreview from "../components/PostPreview.jsx";
import AlbumPreview from "../components/AlbumPreview.jsx";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const isHashtag = params.get("hashtag") === "1";

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) return;
    let active = true;
    setLoading(true);
    setError("");

    const run = isHashtag
      ? getPostsByHashtag(q).then((data) => {
          if (!active) return;
          setPosts(data.posts);
          setUsers([]);
          setAlbums([]);
        })
      : Promise.all([searchUsers(q), searchPosts(q), searchAlbums(q)]).then(
          ([u, p, a]) => {
            if (!active) return;
            setUsers(u.results);
            setPosts(p.results);
            setAlbums(a.results);
          }
        );

    run.catch((err) => active && setError(err.message)).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [q, isHashtag]);

  if (!q) return <p>Type something in the search bar above.</p>;
  if (loading) return <p>Searching...</p>;
  if (error) return <p className="error-text">{error}</p>;

  const nothingFound = users.length === 0 && posts.length === 0 && albums.length === 0;

  return (
    <div>
      <h1 className="text-xl font-heading mb-4">
        {isHashtag ? `Posts tagged #${q}` : `Search results for "${q}"`}
      </h1>
      {nothingFound && <p className="text-inksoft dark:text-inksoftdark">Nothing found.</p>}

      {users.length > 0 && (
        <section className="mb-6">
          <h2 className="font-heading text-lg mb-2">Users</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {users.map((u) => (
              <Link key={u._id} to={`/profile/${u._id}`} className="card flex items-center gap-2 hover:border-rust">
                <Avatar user={u} size={8} />
                <span>{u.username}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mb-6">
          <h2 className="font-heading text-lg mb-2">Posts</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((p) => (
              <PostPreview key={p._id} post={p} author={p.author} />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h2 className="font-heading text-lg mb-2">Albums</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((a) => (
              <AlbumPreview key={a._id} album={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
