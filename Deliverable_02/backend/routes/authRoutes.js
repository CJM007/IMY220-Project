import express from "express";
import { findUserByEmail, createUser } from "../models/userQueries.js";

const router = express.Router();

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: "Sign-in successful.", user });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    const newUser = await createUser({
      username,
      name: name || username,
      email,
      password,
      pronouns: "",
      bio: "",
      profilePic: "https://placehold.co/150x150",
    });
    res.status(201).json({ message: "Sign-up successful.", user: newUser });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  // No server-side session to invalidate yet (no cookie/session middleware
  // in this deliverable) — the frontend clears its own stored user.
  res.status(200).json({ message: "Logged out." });
});

export default router;
