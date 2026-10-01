import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function getAllPosts() {
  const db = await connectDB();
  return db.collection("posts").find().sort({ createdAt: -1 }).toArray();
}

export async function getPostsByUserIds(userIds) {
  const db = await connectDB();
  return db
    .collection("posts")
    .find({ userId: { $in: userIds.map((id) => new ObjectId(id)) } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPostById(id) {
  const db = await connectDB();
  return db.collection("posts").findOne({ _id: new ObjectId(id) });
}

export async function createPost(postData) {
  const db = await connectDB();
  const result = await db.collection("posts").insertOne({
    ...postData,
    userId: new ObjectId(postData.userId),
    createdAt: new Date().toISOString(),
    comments: [],
    reports: [],
  });
  return getPostById(result.insertedId);
}

export async function updatePost(id, updates) {
  const db = await connectDB();
  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
  return getPostById(id);
}

export async function deletePost(id) {
  const db = await connectDB();
  await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
  // If this post was the only post in any album, that album is deleted too
  // (main spec bonus behaviour) — otherwise just pull the postId reference out
  const albums = await db
    .collection("albums")
    .find({ postIds: new ObjectId(id) })
    .toArray();

  for (const album of albums) {
    if (album.postIds.length === 1) {
      await db.collection("albums").deleteOne({ _id: album._id });
    } else {
      await db
        .collection("albums")
        .updateOne({ _id: album._id }, { $pull: { postIds: new ObjectId(id) } });
    }
  }
}

export async function addComment(postId, comment) {
  const db = await connectDB();
  await db.collection("posts").updateOne(
    { _id: new ObjectId(postId) },
    {
      $push: {
        comments: { ...comment, createdAt: new Date().toISOString() },
      },
    }
  );
  return getPostById(postId);
}

export async function addReport(postId, report) {
  const db = await connectDB();
  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(postId) }, { $push: { reports: report } });
  return getPostById(postId);
}

export async function clearReports(postId) {
  const db = await connectDB();
  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(postId) }, { $set: { reports: [] } });
  return getPostById(postId);
}
