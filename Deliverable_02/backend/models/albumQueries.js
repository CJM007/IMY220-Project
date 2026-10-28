import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import { isFuzzyMatch, escapeRegex } from "./userQueries.js";

export async function getAllAlbums() {
  const db = getDB();
  return db.collection("albums").find().sort({ createdAt: -1 }).toArray();
}

export async function getAlbumsByUserId(userId) {
  const db = getDB();
  return db
    .collection("albums")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getAlbumById(id) {
  const db = getDB();
  const results = await db
    .collection("albums")
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "posts",
          localField: "postIds",
          foreignField: "_id",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          description: 1,
          hashtags: 1,
          postIds: 1,
          createdAt: 1,
          userId: 1,
          posts: 1,
          "author._id": 1,
          "author.username": 1,
        },
      },
    ])
    .toArray();
  return results[0] || null;
}

export async function createAlbum({ userId, name, description, hashtags, postIds }) {
  const db = getDB();
  const album = {
    userId: new ObjectId(userId),
    name,
    description: description || "",
    hashtags: hashtags || [],
    postIds: (postIds || []).map((id) => new ObjectId(id)),
    createdAt: new Date(),
  };
  const result = await db.collection("albums").insertOne(album);
  return { ...album, _id: result.insertedId };
}

const ALLOWED_UPDATE_FIELDS = ["name", "description", "hashtags"];

export async function updateAlbum(id, fields) {
  const db = getDB();
  const update = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  if (Object.keys(update).length > 0) {
    await db
      .collection("albums")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
  }
  return getAlbumById(id);
}

export async function deleteAlbum(id) {
  const db = getDB();
  const result = await db
    .collection("albums")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function addPostToAlbum(albumId, postId) {
  const db = getDB();
  await db
    .collection("albums")
    .updateOne(
      { _id: new ObjectId(albumId) },
      { $addToSet: { postIds: new ObjectId(postId) } }
    );
  return getAlbumById(albumId);
}

export async function removePostFromAlbum(albumId, postId) {
  const db = getDB();
  await db
    .collection("albums")
    .updateOne(
      { _id: new ObjectId(albumId) },
      { $pull: { postIds: new ObjectId(postId) } }
    );
  return getAlbumById(albumId);
}

export async function getAlbumsContainingPost(postId) {
  const db = getDB();
  return db
    .collection("albums")
    .find({ postIds: new ObjectId(postId) })
    .toArray();
}

export async function searchAlbums(term) {
  const db = getDB();
  const regex = new RegExp(escapeRegex(term), "i");
  const direct = await db
    .collection("albums")
    .find({
      $or: [{ name: regex }, { description: regex }, { hashtags: regex }],
    })
    .limit(25)
    .toArray();
  if (direct.length > 0) return direct;

  const all = await db.collection("albums").find().toArray();
  return all
    .filter((a) => isFuzzyMatch(term, a.name) || isFuzzyMatch(term, a.description))
    .slice(0, 25);
}
