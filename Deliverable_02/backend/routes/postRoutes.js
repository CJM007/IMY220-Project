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
  isHidden,
  searchPosts,
  searchByHashtag,
} from "../models/postQueries.js";
import { findUserById } from "../models/userQueries.js";
import { getAlbumsContainingPost } from "../models/albumQueries.js";
import { getReasonById } from "../models/reasonQueries.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post id." });
  }
  next();
});

// Feed: ?scope=local|global, sort=newest|mostCommented, hashtag=xyz
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { scope = "global", sort = "newest", hashtag } = req.query;
    const me = await findUserById(req.session.userId);

    let posts;
    if (scope === "local") {
      const ids = [me._id, ...(me.friends || [])];
      posts = await getPostsByUserIds(ids);
    } else {
      posts = await getAllPosts();
    }

    posts = posts.filter((p) => !isHidden(p));

    if (hashtag) {
      const clean = hashtag.replace(/^#/, "").toLowerCase();
      posts = posts.filter((p) =>
        (p.hashtags || []).some((h) => h.toLowerCase() === clean)
      );
    }

    if (sort === "mostCommented") {
      posts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Bonus: favourite users' posts bubble to the top of the feed.
    const favoriteIds = new Set((me.favorites || []).map((f) => f.toString()));
    if (favoriteIds.size > 0) {
      posts.sort((a, b) => {
        const aFav = favoriteIds.has(a.userId.toString()) ? 1 : 0;
        const bFav = favoriteIds.has(b.userId.toString()) ? 1 : 0;
        return bFav - aFav;
      });
    }

    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
});

router.get("/hidden", requireAuth, async (req, res, next) => {
  try {
    const posts = (await getAllPosts()).filter(isHidden);
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
});

router.get("/search", requireAuth, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ results: [] });
    const results = await searchPosts(q);
    res.status(200).json({ results: results.filter((p) => !isHidden(p)) });
  } catch (err) {
    next(err);
  }
});

router.get("/hashtag/:tag", requireAuth, async (req, res, next) => {
  try {
    const posts = await searchByHashtag(req.params.tag);
    res.status(200).json({ posts: posts.filter((p) => !isHidden(p)) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    const albums = await getAlbumsContainingPost(post._id);

    // Comments only carry a userId; look up just enough of each
    // commenter's profile to render a name + avatar next to their text.
    const commenterIds = [...new Set((post.comments || []).map((c) => c.userId.toString()))];
    const commentAuthors = {};
    for (const id of commenterIds) {
      const u = await findUserById(id);
      if (u) {
        commentAuthors[id] = {
          _id: u._id,
          username: u.username,
          profileImage: u.profileImage,
          avatarColor: u.avatarColor,
        };
      }
    }

    res.status(200).json({ post, albums, commentAuthors });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, upload.single("image"), async (req, res, next) => {
  try {
    const { description, hashtags } = req.body;
    if (!description) {
      return res.status(400).json({ error: "description is required." });
    }
    const tagArray = Array.isArray(hashtags)
      ? hashtags
      : typeof hashtags === "string" && hashtags.length
      ? hashtags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image || null;
    const post = await createPost({
      userId: req.session.userId,
      description,
      hashtags: tagArray,
      image,
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "You can only edit your own posts." });
    }
    const fields = { ...req.body };
    if (typeof fields.hashtags === "string") {
      fields.hashtags = fields.hashtags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    const updated = await updatePost(req.params.id, fields);
    res.status(200).json({ post: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "You can only delete your own posts." });
    }
    await deletePost(req.params.id);
    res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/comments", requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required." });
    const comment = await addComment(req.params.id, req.session.userId, text);
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/reports", requireAuth, async (req, res, next) => {
  try {
    const { reasonId } = req.body;
    if (!reasonId) return res.status(400).json({ error: "reasonId is required." });
    const reason = await getReasonById(reasonId);
    if (!reason) return res.status(400).json({ error: "Unknown report reason." });
    const { flagged } = await addReport(
      req.params.id,
      req.session.userId,
      reasonId,
      reason.text
    );
    res.status(201).json({ message: "Post reported.", flaggedAsAbuse: flagged });
  } catch (err) {
    next(err);
  }
});

export default router;
