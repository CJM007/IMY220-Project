// Session-based auth middleware.
// req.session.userId is set on sign-in and cleared on sign-out.
// requireAuth blocks any route that needs a logged-in user.
// requireAdmin additionally checks the isAdmin flag on the session.

import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not signed in." });
  }
  next();
}

export async function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not signed in." });
  }
  const db = getDB();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.session.userId) });
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required." });
  }
  req.adminUser = user;
  next();
}
