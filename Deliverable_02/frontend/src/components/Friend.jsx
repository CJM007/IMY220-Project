import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";

export default function Friend({ user }) {
  return (
    <Link to={`/profile/${user._id}`} className="flex items-center gap-2 card hover:border-rust">
      <Avatar user={user} size={8} />
      <span>{user.username}</span>
    </Link>
  );
}
