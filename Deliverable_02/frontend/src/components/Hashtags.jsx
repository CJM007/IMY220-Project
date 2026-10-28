import { useNavigate } from "react-router-dom";

// Clicking a hashtag does the same thing as searching for it.
export default function Hashtags({ tags }) {
  const navigate = useNavigate();
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {tags.map((tag) => (
        <button
          key={tag}
          className="hashtag text-sm"
          onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}&hashtag=1`)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
