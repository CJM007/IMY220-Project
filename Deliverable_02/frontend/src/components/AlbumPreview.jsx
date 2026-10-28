import { Link } from "react-router-dom";
import { imageUrl } from "../api.js";
import Hashtags from "./Hashtags.jsx";

export default function AlbumPreview({ album }) {
  const cover = album.posts?.[0]?.image;
  return (
    <Link to={`/album/${album._id}`} className="card block hover:border-rust">
      <img
        src={imageUrl(cover) || "https://picsum.photos/seed/albumplaceholder/600/400"}
        alt=""
        className="w-full h-32 object-cover rounded-lg mb-2"
      />
      <h4 className="font-heading font-semibold">{album.name}</h4>
      <p className="text-sm text-inksoft dark:text-inksoftdark line-clamp-2">{album.description}</p>
      <Hashtags tags={album.hashtags} />
      <p className="text-xs text-inksoft dark:text-inksoftdark mt-1">
        {album.postIds?.length || 0} post{album.postIds?.length === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
