import ProfilePreview from "./ProfilePreview";

function Friend({ friend }) {
  return (
    <div className="friend-item">
      <ProfilePreview user={friend} />
    </div>
  );
}

export default Friend;
