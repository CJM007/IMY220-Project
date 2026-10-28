import express from "express";
import { ObjectId } from "mongodb";
import { requireAdmin } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  setVerified,
  pushNotification,
} from "../models/userQueries.js";
import {
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getAllReportedPosts,
  clearReports,
} from "../models/postQueries.js";
import {
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from "../models/albumQueries.js";
import { getAllReasons, addReason, deleteReason } from "../models/reasonQueries.js";
import { sanitizeUser } from "../utils/sanitize.js";

const router = express.Router();
router.use(requireAdmin);

// ---- Users ----
router.get("/users", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users: users.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
});

router.put("/users/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }
    const user = await updateUser(req.params.id, req.body || {});
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }
    await deleteUser(req.params.id);
    res.status(200).json({ message: "User account deleted by admin." });
  } catch (err) {
    next(err);
  }
});

router.post("/users/:id/verify", async (req, res, next) => {
  try {
    const { approve } = req.body;
    await setVerified(req.params.id, !!approve);
    res.status(200).json({ message: approve ? "Account verified." : "Verification declined." });
  } catch (err) {
    next(err);
  }
});

router.get("/verification-requests", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const pending = users.filter((u) => u.verificationRequested);
    res.status(200).json({ users: pending.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
});

// ---- Posts ----
router.get("/posts", async (req, res, next) => {
  try {
    res.status(200).json({ posts: await getAllPosts() });
  } catch (err) {
    next(err);
  }
});

router.put("/posts/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post id." });
    }
    const post = await updatePost(req.params.id, req.body || {});
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
});

// Bonus: alert the author when admin deletes their post.
router.delete("/posts/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post id." });
    }
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    await deletePost(req.params.id);
    const preview = (post.description || "").slice(0, 60);
    await pushNotification(
      post.userId,
      `Your post "${preview}${preview.length === 60 ? "..." : ""}" was removed by an admin for violating community guidelines.`
    );
    res.status(200).json({ message: "Post deleted by admin." });
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:id/clear-reports", async (req, res, next) => {
  try {
    await clearReports(req.params.id);
    res.status(200).json({ message: "Reports cleared." });
  } catch (err) {
    next(err);
  }
});

router.get("/reported-posts", async (req, res, next) => {
  try {
    res.status(200).json({ posts: await getAllReportedPosts() });
  } catch (err) {
    next(err);
  }
});

// ---- Albums ----
router.get("/albums", async (req, res, next) => {
  try {
    res.status(200).json({ albums: await getAllAlbums() });
  } catch (err) {
    next(err);
  }
});

router.put("/albums/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid album id." });
    }
    const album = await updateAlbum(req.params.id, req.body || {});
    res.status(200).json({ album });
  } catch (err) {
    next(err);
  }
});

router.delete("/albums/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid album id." });
    }
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    await deleteAlbum(req.params.id);
    await pushNotification(
      album.userId,
      `Your album "${album.name}" was removed by an admin.`
    );
    res.status(200).json({ message: "Album deleted by admin." });
  } catch (err) {
    next(err);
  }
});

// ---- Report reasons ----
router.get("/reasons", async (req, res, next) => {
  try {
    res.status(200).json({ reasons: await getAllReasons() });
  } catch (err) {
    next(err);
  }
});

router.post("/reasons", async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required." });
    const reason = await addReason(text);
    res.status(201).json({ reason });
  } catch (err) {
    next(err);
  }
});

router.delete("/reasons/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid reason id." });
    }
    await deleteReason(req.params.id);
    res.status(200).json({ message: "Reason deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;
