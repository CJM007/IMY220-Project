import express from "express";
import { ObjectId } from "mongodb";
import {
  getAllPosts,
  getPostsByUserIds,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  addReport,
} from "../models/postQueries.js";
import { getAlbumsContainingPost } from "../models/albumQueries.js";

const router = express.Router();

// IMPORTANT: this must be registered before "/:id" below, otherwise a
// request to /api/posts/feed would get swallowed by the /:id route first
// (Express matches routes top-to-bottom, first match wins).
router.get("/feed", async (req, res, next) => {
  try {
    const ids = (req.query.userIds || "").split(",").filter(Boolean);
    const posts = await getPostsByUserIds(ids);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.param("id", (req, res, next, id) => {
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid post id." });
  }
  next();
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/albums", async (req, res, next) => {
  try {
    const albums = await getAlbumsContainingPost(req.params.id);
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { userId, username, bookTitle, author, coverImage, description, hashtags } =
      req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
    if (!bookTitle || !author) {
      return res.status(400).json({ message: "Book title and author are required." });
    }

    const newPost = await createPost({
      userId,
      username,
      bookTitle,
      author,
      coverImage,
      description,
      hashtags,
    });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    // Per spec: owner can edit description and hashtags only, not the image/title
    const allowedFields = ["description", "hashtags"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const updated = await updatePost(req.params.id, updates);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deletePost(req.params.id);
    res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const { userId, username, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required." });
    }
    const updated = await addComment(req.params.id, { userId, username, text });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/reports", async (req, res, next) => {
  try {
    const { userId, reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "A report reason is required." });
    }
    const updated = await addReport(req.params.id, { userId, reason });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
