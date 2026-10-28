import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const AVATAR_COLORS = [
  "#C4654A", "#7D8C5C", "#B08A3E", "#5C7A8C",
  "#9C5C7A", "#6B5C9C", "#8C7A5C", "#5C9C7A",
];

function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export async function findUserByEmail(email) {
  const db = getDB();
  return db.collection("users").findOne({ email: email.toLowerCase() });
}

export async function findUserByUsername(username) {
  const db = getDB();
  return db.collection("users").findOne({ username });
}

export async function findUserById(id) {
  const db = getDB();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}

export async function getAllUsers() {
  const db = getDB();
  return db.collection("users").find().toArray();
}

export async function createUser({ username, email, password, bio }) {
  const db = getDB();
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) throw new Error("Email already registered.");
  const existingUsername = await findUserByUsername(username);
  if (existingUsername) throw new Error("Username already taken.");

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    email: email.toLowerCase(),
    passwordHash,
    bio: bio || "",
    profileImage: null,
    avatarColor: randomAvatarColor(),
    isAdmin: false,
    isVerified: false,
    verificationRequested: false,
    friends: [],
    friendRequests: [],
    favorites: [],
    notifications: [],
    createdAt: new Date(),
  };
  const result = await db.collection("users").insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

const ALLOWED_UPDATE_FIELDS = ["bio", "profileImage", "username"];

export async function updateUser(id, fields) {
  const db = getDB();
  const update = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  if (Object.keys(update).length === 0) {
    return findUserById(id);
  }
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });
  return findUserById(id);
}

export async function deleteUser(id) {
  const db = getDB();
  const oid = new ObjectId(id);
  // Cascade: remove from everyone else's friend lists / favorites / requests
  await db
    .collection("users")
    .updateMany(
      {},
      { $pull: { friends: oid, favorites: oid, friendRequests: oid } }
    );
  // Cascade: delete this user's posts and albums
  await db.collection("posts").deleteMany({ userId: oid });
  await db.collection("albums").deleteMany({ userId: oid });
  // Remove their comments/reports from remaining posts
  await db
    .collection("posts")
    .updateMany(
      {},
      {
        $pull: {
          comments: { userId: oid },
          reports: { userId: oid },
        },
      }
    );
  const result = await db.collection("users").deleteOne({ _id: oid });
  return result.deletedCount > 0;
}

export async function addFriend(userId, friendId) {
  const db = getDB();
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { friends: new ObjectId(friendId) } }
    );
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(friendId) },
      { $addToSet: { friends: new ObjectId(userId) } }
    );
}

export async function removeFriend(userId, friendId) {
  const db = getDB();
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { friends: new ObjectId(friendId) } }
    );
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(friendId) },
      { $pull: { friends: new ObjectId(userId) } }
    );
}

export async function toggleFavorite(userId, targetId) {
  const db = getDB();
  const user = await findUserById(userId);
  const isFav = user.favorites?.some((f) => f.toString() === targetId);
  if (isFav) {
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favorites: new ObjectId(targetId) } }
      );
    return false;
  }
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: new ObjectId(targetId) } }
    );
  return true;
}

export async function requestVerification(userId) {
  const db = getDB();
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { verificationRequested: true } }
    );
}

export async function setVerified(userId, verified) {
  const db = getDB();
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isVerified: verified, verificationRequested: false } }
    );
}

export async function pushNotification(userId, message) {
  const db = getDB();
  const notification = {
    _id: new ObjectId(),
    message,
    read: false,
    createdAt: new Date(),
  };
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $push: { notifications: { $each: [notification], $position: 0 } } }
    );
}

export async function markNotificationRead(userId, notificationId) {
  const db = getDB();
  await db
    .collection("users")
    .updateOne(
      {
        _id: new ObjectId(userId),
        "notifications._id": new ObjectId(notificationId),
      },
      { $set: { "notifications.$.read": true } }
    );
}

// Simple fuzzy/partial search across username, email -- tolerant of
// incomplete input (prefix/substring) and minor typos (checks each
// query token against a Levenshtein distance threshold).
export async function searchUsers(term) {
  const db = getDB();
  const regex = new RegExp(escapeRegex(term), "i");
  const direct = await db
    .collection("users")
    .find({ $or: [{ username: regex }, { email: regex }] })
    .limit(25)
    .toArray();
  if (direct.length > 0) return direct;

  // Fallback: fuzzy match by edit distance for misspelled search terms.
  const all = await db.collection("users").find().toArray();
  return all
    .filter((u) => isFuzzyMatch(term, u.username))
    .slice(0, 25);
}

export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const dp = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function isFuzzyMatch(term, target) {
  if (!target) return false;
  const t = term.toLowerCase();
  const tgt = target.toLowerCase();
  if (tgt.includes(t)) return true;
  const threshold = t.length <= 4 ? 1 : 2;
  // compare against the target and each word within it
  const words = tgt.split(/\s+/);
  return (
    levenshtein(t, tgt) <= threshold ||
    words.some((w) => levenshtein(t, w) <= threshold)
  );
}
