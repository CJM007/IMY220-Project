function ProfileInfo({ user, onEditClick }) {
  return (
    <div className="profile-info">
      <img src={user.profilePic} alt={user.name} />
      <div>
        <h1>{user.name}</h1>
        <p>
          @{user.username} · {user.pronouns}
        </p>
        <p>{user.bio}</p>
        <button onClick={onEditClick}>Edit profile</button>
      </div>
    </div>
  );
}

export default ProfileInfo;
