import ProfilePreview from "./ProfilePreview";

function Friend({ friend }) {
  return (
    <div className="friend-item">
      <ProfilePreview user={friend} />
      <span>
        Friends since {new Date(friend.friendsSince).toLocaleDateString()}
      </span>
    </div>
  );
}

export default Friend;
