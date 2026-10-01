import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function findUserByEmail(email) {
  const db = await connectDB();
  return db.collection("users").findOne({ email });
}

export async function findUserById(id) {
  const db = await connectDB();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}

export async function getAllUsers() {
  const db = await connectDB();
  return db.collection("users").find().toArray();
}

export async function createUser(userData) {
  const db = await connectDB();
  const result = await db.collection("users").insertOne({
    ...userData,
    friends: [],
  });
  return findUserById(result.insertedId);
}

export async function updateUser(id, updates) {
  const db = await connectDB();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
  return findUserById(id);
}

export async function deleteUser(id) {
  const db = await connectDB();
  await db.collection("users").deleteOne({ _id: new ObjectId(id) });
  // Scrub this user out of everyone else's friends list too
  await db
    .collection("users")
    .updateMany({}, { $pull: { friends: new ObjectId(id) } });
}

export async function addFriend(userId, friendId) {
  const db = await connectDB();
  // $addToSet instead of $push — prevents duplicate friend entries
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
  const db = await connectDB();
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
