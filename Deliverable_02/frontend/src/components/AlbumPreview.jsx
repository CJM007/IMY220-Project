import { Link } from "react-router-dom";

function AlbumPreview({ album }) {
  return (
    <Link to={`/album/${album._id}`} className="album-preview">
      <h3>{album.name}</h3>
      <p>{album.description}</p>
      <div>
        {(album.hashtags || []).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <p>{album.postIds?.length || 0} books</p>
    </Link>
  );
}

export default AlbumPreview;
