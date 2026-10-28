import express from "express";
import { ObjectId } from "mongodb";
import {
  getAllAlbums,
  getAlbumsByUserId,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPostToAlbum,
  removePostFromAlbum,
  searchAlbums,
} from "../models/albumQueries.js";
import { getTopHashtagsForUser } from "../models/postQueries.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid album id." });
  }
  next();
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    res.status(200).json({ albums: await getAllAlbums() });
  } catch (err) {
    next(err);
  }
});

router.get("/search", requireAuth, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ results: [] });
    res.status(200).json({ results: await searchAlbums(q) });
  } catch (err) {
    next(err);
  }
});

// Bonus: suggest frequently-used hashtags from the current user's own
// posts when they're adding hashtags to a new album.
router.get("/hashtag-suggestions", requireAuth, async (req, res, next) => {
  try {
    const suggestions = await getTopHashtagsForUser(req.session.userId);
    res.status(200).json({ suggestions });
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", requireAuth, async (req, res, next) => {
  try {
    res.status(200).json({ albums: await getAlbumsByUserId(req.params.userId) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    res.status(200).json({ album });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, description, hashtags, postIds } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required." });
    const album = await createAlbum({
      userId: req.session.userId,
      name,
      description,
      hashtags,
      postIds,
    });
    res.status(201).json({ album });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    if (album.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "You can only edit your own albums." });
    }
    const updated = await updateAlbum(req.params.id, req.body || {});
    res.status(200).json({ album: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    if (album.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "You can only delete your own albums." });
    }
    await deleteAlbum(req.params.id);
    res.status(200).json({ message: "Album deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/posts/:postId", requireAuth, async (req, res, next) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    if (album.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "You can only edit your own albums." });
    }
    const updated = await addPostToAlbum(req.params.id, req.params.postId);
    res.status(200).json({ album: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/posts/:postId", requireAuth, async (req, res, next) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    if (album.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "You can only edit your own albums." });
    }
    const updated = await removePostFromAlbum(req.params.id, req.params.postId);
    res.status(200).json({ album: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
