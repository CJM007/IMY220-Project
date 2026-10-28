import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function getAllReasons() {
  const db = getDB();
  return db.collection("reportReasons").find().toArray();
}

export async function addReason(text) {
  const db = getDB();
  const reason = { text, createdAt: new Date() };
  const result = await db.collection("reportReasons").insertOne(reason);
  return { ...reason, _id: result.insertedId };
}

export async function deleteReason(id) {
  const db = getDB();
  const result = await db
    .collection("reportReasons")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getReasonById(id) {
  const db = getDB();
  return db.collection("reportReasons").findOne({ _id: new ObjectId(id) });
}
