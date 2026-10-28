import express from "express";
import { searchUsers } from "../models/userQueries.js";
import { searchPosts, isHidden } from "../models/postQueries.js";
import { searchAlbums } from "../models/albumQueries.js";
import { requireAuth } from "../middleware/auth.js";
import { sanitizePublicUser } from "../utils/sanitize.js";

const router = express.Router();

// Bonus: autocomplete -- combined, trimmed-down suggestions across
// users/posts/albums as the person types. Same fuzzy/partial matching
// as the full search endpoints, just capped to a handful of results.
router.get("/suggest", requireAuth, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(200).json({ users: [], posts: [], albums: [] });
    }
    const [users, posts, albums] = await Promise.all([
      searchUsers(q),
      searchPosts(q),
      searchAlbums(q),
    ]);
    res.status(200).json({
      users: users.slice(0, 5).map(sanitizePublicUser),
      posts: posts.filter((p) => !isHidden(p)).slice(0, 5),
      albums: albums.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
