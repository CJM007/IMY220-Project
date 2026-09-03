import { Link } from "react-router-dom";

function ProfilePreview({ user }) {
  return (
    <Link to={`/profile/${user.id}`} className="profile-preview">
      <img src={user.profilePic} alt={user.name} />
      <div>
        <p>{user.name}</p>
        <p>@{user.username}</p>
      </div>
    </Link>
  );
}

export default ProfilePreview;
