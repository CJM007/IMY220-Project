import express from "express";
import { ObjectId } from "mongodb";
import {
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
  toggleFavorite,
  requestVerification,
  markNotificationRead,
  searchUsers,
} from "../models/userQueries.js";
import { getPostsByUserIds } from "../models/postQueries.js";
import { getAlbumsByUserId } from "../models/albumQueries.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sanitizeUser, sanitizePublicUser } from "../utils/sanitize.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (id === "me") return next();
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user id." });
  }
  next();
});

router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ results: [] });
    const results = await searchUsers(q);
    res.status(200).json({ results: results.map(sanitizePublicUser) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id === "me" ? req.session.userId : req.params.id;
    if (!id) return res.status(401).json({ error: "Not signed in." });
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const viewerId = req.session?.userId;
    const isSelf = viewerId && viewerId === user._id.toString();
    const isFriend =
      viewerId &&
      user.friends?.some((f) => f.toString() === viewerId);

    if (isSelf || isFriend) {
      const posts = await getPostsByUserIds([user._id]);
      const albums = await getAlbumsByUserId(user._id);
      const friendDocs = await Promise.all(
        (user.friends || []).map((fid) => findUserById(fid))
      );
      const friends = friendDocs.filter(Boolean).map(sanitizePublicUser);
      return res.status(200).json({
        user: isSelf ? sanitizeUser(user) : sanitizePublicUser(user),
        posts,
        albums,
        friends,
        relationship: isSelf ? "self" : "friend",
      });
    }

    // Stranger: only name + picture per spec.
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        avatarColor: user.avatarColor,
        isVerified: user.isVerified,
      },
      relationship: "stranger",
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id === "me" ? req.session.userId : req.params.id;
    if (id !== req.session.userId) {
      return res.status(403).json({ error: "You can only edit your own profile." });
    }
    const user = await updateUser(id, req.body || {});
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/profile-image",
  requireAuth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const id = req.params.id === "me" ? req.session.userId : req.params.id;
      if (id !== req.session.userId) {
        return res.status(403).json({ error: "You can only edit your own profile." });
      }
      if (!req.file) return res.status(400).json({ error: "No image uploaded." });
      const user = await updateUser(id, { profileImage: `/uploads/${req.file.filename}` });
      res.status(200).json({ user: sanitizeUser(user) });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id === "me" ? req.session.userId : req.params.id;
    if (id !== req.session.userId) {
      return res.status(403).json({ error: "You can only delete your own account." });
    }
    await deleteUser(id);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Account deleted." });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/friend", requireAuth, async (req, res, next) => {
  try {
    await addFriend(req.session.userId, req.params.id);
    res.status(200).json({ message: "Friend added." });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/friend", requireAuth, async (req, res, next) => {
  try {
    await removeFriend(req.session.userId, req.params.id);
    res.status(200).json({ message: "Friend removed." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/favorite", requireAuth, async (req, res, next) => {
  try {
    const isFav = await toggleFavorite(req.session.userId, req.params.id);
    res.status(200).json({ favorited: isFav });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/verify-request", requireAuth, async (req, res, next) => {
  try {
    if (req.params.id !== req.session.userId && req.params.id !== "me") {
      return res.status(403).json({ error: "You can only request verification for yourself." });
    }
    await requestVerification(req.session.userId);
    res.status(200).json({ message: "Verification requested." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/notifications/:notifId/read", requireAuth, async (req, res, next) => {
  try {
    await markNotificationRead(req.session.userId, req.params.notifId);
    res.status(200).json({ message: "Marked read." });
  } catch (err) {
    next(err);
  }
});

export default router;
