import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "dogeared";

if (!uri) {
  console.error("Missing MONGO_URI in .env");
}

const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected yet. Call connectDB() first.");
  }
  return db;
}

export { client };
