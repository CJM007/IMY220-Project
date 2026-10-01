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
} from "../models/albumQueries.js";

const router = express.Router();

// Registered before "/:id" for the same reason as posts' "/feed" route —
// otherwise "/user/<id>" would get swallowed by the generic "/:id" pattern.
router.get("/user/:userId", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
    const albums = await getAlbumsByUserId(req.params.userId);
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const albums = await getAllAlbums();
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
});

router.param("id", (req, res, next, id) => {
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid album id." });
  }
  next();
});

router.get("/:id", async (req, res, next) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ message: "Album not found." });
    res.status(200).json(album);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { userId, username, name, description, hashtags } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
    if (!name) {
      return res.status(400).json({ message: "Album name is required." });
    }

    const newAlbum = await createAlbum({ userId, username, name, description, hashtags });
    res.status(201).json(newAlbum);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const allowedFields = ["name", "description", "hashtags"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const updated = await updateAlbum(req.params.id, updates);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteAlbum(req.params.id);
    res.status(200).json({ message: "Album deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/posts", async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id." });
    }
    const updated = await addPostToAlbum(req.params.id, postId);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/posts", async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id." });
    }
    const updated = await removePostFromAlbum(req.params.id, postId);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
