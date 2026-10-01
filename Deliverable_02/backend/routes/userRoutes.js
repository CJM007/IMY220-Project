import express from "express";
import { ObjectId } from "mongodb";
import {
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} from "../models/userQueries.js";

const router = express.Router();

// Reject malformed ids before they ever reach a query — every route below
// that has :id benefits from this automatically.
router.param("id", (req, res, next, id) => {
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id." });
  }
  next();
});

router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const allowedFields = ["name", "pronouns", "bio", "profilePic"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const updated = await updateUser(req.params.id, updates);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/friend", async (req, res, next) => {
  try {
    const { friendId } = req.body;
    if (!ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend id." });
    }
    await addFriend(req.params.id, friendId);
    const updated = await findUserById(req.params.id);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/friend", async (req, res, next) => {
  try {
    const { friendId } = req.body;
    if (!ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend id." });
    }
    await removeFriend(req.params.id, friendId);
    const updated = await findUserById(req.params.id);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
