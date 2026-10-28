import express from "express";
import { getAllReasons } from "../models/reasonQueries.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Any signed-in user can see the list of report reasons when reporting
// a post; only admins (via /api/admin/reasons) can add or remove them.
router.get("/", requireAuth, async (req, res, next) => {
  try {
    res.status(200).json({ reasons: await getAllReasons() });
  } catch (err) {
    next(err);
  }
});

export default router;
