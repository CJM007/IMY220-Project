import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import { isFuzzyMatch, escapeRegex } from "./userQueries.js";

const REPORT_HIDE_THRESHOLD = 2; // "reported more than twice" => > 2

// Native mongodb driver has no Mongoose-style populate, so feed/list
// queries join the author in with a $lookup + small projection instead
// of sending the frontend a bare userId it can't render anything from.
const AUTHOR_LOOKUP_STAGES = [
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
      description: 1,
      hashtags: 1,
      image: 1,
      comments: 1,
      reports: 1,
      createdAt: 1,
      userId: 1,
      "author._id": 1,
      "author.username": 1,
      "author.profileImage": 1,
      "author.avatarColor": 1,
      "author.isVerified": 1,
    },
  },
];

export async function getAllPosts() {
  const db = getDB();
  return db
    .collection("posts")
    .aggregate([...AUTHOR_LOOKUP_STAGES, { $sort: { createdAt: -1 } }])
    .toArray();
}

export async function getPostsByUserIds(userIds) {
  const db = getDB();
  const oids = userIds.map((id) => new ObjectId(id));
  return db
    .collection("posts")
    .aggregate([
      { $match: { userId: { $in: oids } } },
      ...AUTHOR_LOOKUP_STAGES,
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
}

export async function getPostById(id) {
  const db = getDB();
  const results = await db
    .collection("posts")
    .aggregate([{ $match: { _id: new ObjectId(id) } }, ...AUTHOR_LOOKUP_STAGES])
    .toArray();
  return results[0] || null;
}

export async function createPost({ userId, description, hashtags, image }) {
  const db = getDB();
  const post = {
    userId: new ObjectId(userId),
    description,
    hashtags: hashtags || [],
    image: image || null,
    comments: [],
    reports: [],
    createdAt: new Date(),
  };
  const result = await db.collection("posts").insertOne(post);
  return { ...post, _id: result.insertedId };
}

const ALLOWED_UPDATE_FIELDS = ["description", "hashtags", "image"];

export async function updatePost(id, fields) {
  const db = getDB();
  const update = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  if (Object.keys(update).length > 0) {
    await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
  }
  return getPostById(id);
}

export async function deletePost(id) {
  const db = getDB();
  const oid = new ObjectId(id);

  // Bonus: deleting a post that is the only post in an album deletes
  // that album too; otherwise just remove the post reference from it.
  const albums = await db
    .collection("albums")
    .find({ postIds: oid })
    .toArray();
  for (const album of albums) {
    if (album.postIds.length === 1) {
      await db.collection("albums").deleteOne({ _id: album._id });
    } else {
      await db
        .collection("albums")
        .updateOne({ _id: album._id }, { $pull: { postIds: oid } });
    }
  }

  const result = await db.collection("posts").deleteOne({ _id: oid });
  return result.deletedCount > 0;
}

export async function addComment(postId, userId, text) {
  const db = getDB();
  const comment = {
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    text,
    createdAt: new Date(),
  };
  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(postId) }, { $push: { comments: comment } });
  return comment;
}

// Bonus: detect abuse of the reporting functionality -- if the same
// user has filed more than 5 reports in the last 10 minutes, or has
// reported more than 3 posts by the same author, flag it for admins
// instead of silently accepting more reports.
export async function detectReportAbuse(reporterId) {
  const db = getDB();
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
  const posts = await db
    .collection("posts")
    .find({ "reports.userId": new ObjectId(reporterId) })
    .toArray();

  let recentCount = 0;
  const authorCounts = {};
  for (const post of posts) {
    for (const report of post.reports) {
      if (
        report.userId.toString() === reporterId.toString() &&
        report.createdAt >= tenMinAgo
      ) {
        recentCount++;
        const authorKey = post.userId.toString();
        authorCounts[authorKey] = (authorCounts[authorKey] || 0) + 1;
      }
    }
  }
  const sameAuthorAbuse = Object.values(authorCounts).some((c) => c > 3);
  return recentCount > 5 || sameAuthorAbuse;
}

export async function addReport(postId, userId, reasonId, reasonText) {
  const db = getDB();
  const flagged = await detectReportAbuse(userId);
  const report = {
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    reasonId: reasonId ? new ObjectId(reasonId) : null,
    reasonText,
    flaggedAsAbuse: flagged,
    createdAt: new Date(),
  };
  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(postId) }, { $push: { reports: report } });
  return { report, flagged };
}

export async function clearReports(postId) {
  const db = getDB();
  await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(postId) }, { $set: { reports: [] } });
}

export function isHidden(post) {
  return (post.reports?.length || 0) > REPORT_HIDE_THRESHOLD;
}

export async function getAllReportedPosts() {
  const db = getDB();
  return db
    .collection("posts")
    .find({ "reports.0": { $exists: true } })
    .sort({ createdAt: -1 })
    .toArray();
}

async function attachAuthors(postList) {
  const db = getDB();
  const ids = [...new Set(postList.map((p) => p.userId.toString()))].map(
    (id) => new ObjectId(id)
  );
  const users = await db
    .collection("users")
    .find({ _id: { $in: ids } })
    .project({ username: 1, profileImage: 1, avatarColor: 1, isVerified: 1 })
    .toArray();
  const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
  return postList.map((p) => ({ ...p, author: byId[p.userId.toString()] || null }));
}

export async function searchPosts(term) {
  const db = getDB();
  const regex = new RegExp(escapeRegex(term), "i");
  const direct = await db
    .collection("posts")
    .find({ $or: [{ description: regex }, { hashtags: regex }] })
    .limit(25)
    .toArray();
  if (direct.length > 0) return attachAuthors(direct);

  const all = await db.collection("posts").find().toArray();
  const matched = all
    .filter(
      (p) =>
        isFuzzyMatch(term, p.description) ||
        (p.hashtags || []).some((h) => isFuzzyMatch(term, h))
    )
    .slice(0, 25);
  return attachAuthors(matched);
}

export async function searchByHashtag(tag) {
  const db = getDB();
  const clean = tag.replace(/^#/, "");
  const regex = new RegExp(`^${escapeRegex(clean)}$`, "i");
  const posts = await db.collection("posts").find({ hashtags: regex }).toArray();
  return attachAuthors(posts);
}

export async function getTopHashtagsForUser(userId) {
  const db = getDB();
  const posts = await db
    .collection("posts")
    .find({ userId: new ObjectId(userId) })
    .toArray();
  const counts = {};
  for (const post of posts) {
    for (const tag of post.hashtags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);
}
