import { Link } from "react-router-dom";
import { imageUrl } from "../api.js";
import Hashtags from "./Hashtags.jsx";

export default function PostPreview({ post, author }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        {author && (
          <Link to={`/profile/${author._id}`} className="font-semibold text-ink dark:text-inkdark hover:text-rust">
            {author.username}
          </Link>
        )}
        <span className="text-xs text-inksoft dark:text-inksoftdark">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      <Link to={`/post/${post._id}`}>
        <img
          src={imageUrl(post.image) || "https://picsum.photos/seed/placeholder/600/400"}
          alt=""
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
        <p className="line-clamp-3">{post.description}</p>
      </Link>
      <Hashtags tags={post.hashtags} />
      <div className="text-xs text-inksoft dark:text-inksoftdark mt-2">
        {post.comments?.length || 0} comment{post.comments?.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}
