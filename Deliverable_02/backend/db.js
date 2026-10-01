import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {
  if (db) return db; // reuse existing connection instead of reconnecting every time
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
  return db;
}
