import express from "express";
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  findUserById,
} from "../models/userQueries.js";
import { sanitizeUser } from "../utils/sanitize.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, bio } = req.body || {};
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required." });
    }
    const user = await createUser({ username, email, password, bio });
    req.session.userId = user._id.toString();
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    if (err.message.includes("already")) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const valid = await verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    req.session.userId = user._id.toString();
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/signout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Signed out." });
  });
});

router.get("/me", async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(200).json({ user: null });
    }
    const user = await findUserById(req.session.userId);
    if (!user) return res.status(200).json({ user: null });
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
