import { imageUrl } from "../api.js";

// Bonus: when a user has no profile image, we render a randomised
// placeholder (color chosen at signup, initials from their username)
// instead of a generic broken-image icon.
export default function Avatar({ user, size = 10 }) {
  const dimension = `${size * 0.25}rem`;
  if (user?.profileImage) {
    return (
      <img
        src={imageUrl(user.profileImage)}
        alt={`${user.username}'s profile`}
        className="rounded-full object-cover border border-border dark:border-borderdark"
        style={{ width: dimension, height: dimension }}
      />
    );
  }
  const initial = user?.username ? user.username[0].toUpperCase() : "?";
  const color = user?.avatarColor || "#C4654A";
  return (
    <div
      className="rounded-full flex items-center justify-center text-paper font-heading font-bold border border-border dark:border-borderdark"
      style={{ width: dimension, height: dimension, backgroundColor: color }}
      aria-label={`${user?.username || "User"}'s placeholder avatar`}
    >
      {initial}
    </div>
  );
}
