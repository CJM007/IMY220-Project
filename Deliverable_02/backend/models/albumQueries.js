import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function getAllAlbums() {
  const db = await connectDB();
  return db.collection("albums").find().toArray();
}

export async function getAlbumsByUserId(userId) {
  const db = await connectDB();
  return db
    .collection("albums")
    .find({ userId: new ObjectId(userId) })
    .toArray();
}

export async function getAlbumById(id) {
  const db = await connectDB();
  return db.collection("albums").findOne({ _id: new ObjectId(id) });
}

export async function createAlbum(albumData) {
  const db = await connectDB();
  const result = await db.collection("albums").insertOne({
    ...albumData,
    userId: new ObjectId(albumData.userId),
    postIds: (albumData.postIds || []).map((pid) => new ObjectId(pid)),
    createdAt: new Date().toISOString(),
  });
  return getAlbumById(result.insertedId);
}

export async function updateAlbum(id, updates) {
  const db = await connectDB();
  await db
    .collection("albums")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
  return getAlbumById(id);
}

export async function deleteAlbum(id) {
  const db = await connectDB();
  await db.collection("albums").deleteOne({ _id: new ObjectId(id) });
}

export async function addPostToAlbum(albumId, postId) {
  const db = await connectDB();
  await db
    .collection("albums")
    .updateOne(
      { _id: new ObjectId(albumId) },
      { $addToSet: { postIds: new ObjectId(postId) } }
    );
  return getAlbumById(albumId);
}

export async function removePostFromAlbum(albumId, postId) {
  const db = await connectDB();
  await db
    .collection("albums")
    .updateOne(
      { _id: new ObjectId(albumId) },
      { $pull: { postIds: new ObjectId(postId) } }
    );
  return getAlbumById(albumId);
}

// Used by Post detail page to show "part of album: X" — finds every album
// that contains a given post id
export async function getAlbumsContainingPost(postId) {
  const db = await connectDB();
  return db
    .collection("albums")
    .find({ postIds: new ObjectId(postId) })
    .toArray();
}
