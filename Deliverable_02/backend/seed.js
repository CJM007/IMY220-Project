import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  // Clear existing data so the script is safe to re-run
  await db.collection("users").deleteMany({});
  await db.collection("posts").deleteMany({});
  await db.collection("albums").deleteMany({});

  const chitaId = new ObjectId();
  const leratoId = new ObjectId();
  const tumeloId = new ObjectId();

  await db.collection("users").insertMany([
    {
      _id: chitaId,
      username: "chitambala",
      name: "Chitambala J. Sikazwe",
      email: "test@test.com",
      password: "test1234",
      pronouns: "he/him",
      bio: "Second-year student, currently working through a stack of nonfiction.",
      profilePic: "https://placehold.co/150x150",
      friends: [leratoId],
    },
    {
      _id: leratoId,
      username: "lerato",
      name: "Lerato M. Phethla",
      email: "lerato@test.com",
      password: "password123",
      pronouns: "she/her",
      bio: "Fantasy and weird fiction, mostly.",
      profilePic: "https://placehold.co/150x150",
      friends: [chitaId],
    },
    {
      _id: tumeloId,
      username: "tumelo",
      name: "Tumelo K. Motlakeng",
      email: "tumelo2@test.com",
      password: "password123",
      pronouns: "he/him",
      bio: "History buff, slow reader, no shame about it.",
      profilePic: "https://placehold.co/150x150",
      friends: [],
    },
  ]);

  const post1Id = new ObjectId();
  const post2Id = new ObjectId();

  await db.collection("posts").insertMany([
    {
      _id: post1Id,
      userId: chitaId,
      username: "chitambala",
      bookTitle: "The Salt Path",
      author: "Raynor Winn",
      coverImage: "https://placehold.co/300x400",
      description:
        "A quiet, devastating memoir about walking the South West Coast Path after losing everything.",
      hashtags: ["#memoir", "#nature"],
      createdAt: new Date().toISOString(),
      comments: [],
      reports: [],
    },
    {
      _id: post2Id,
      userId: leratoId,
      username: "lerato",
      bookTitle: "Piranesi",
      author: "Susanna Clarke",
      coverImage: "https://placehold.co/300x400",
      description:
        "Strange, dreamlike, and completely unlike anything else I've read this year.",
      hashtags: ["#fantasy", "#weird-fiction"],
      createdAt: new Date().toISOString(),
      comments: [],
      reports: [],
    },
  ]);

  await db.collection("albums").insertOne({
    userId: chitaId,
    username: "chitambala",
    name: "Cozy Autumn Reads",
    description: "Books that feel like October.",
    hashtags: ["#cozy", "#autumn"],
    postIds: [post1Id],
    createdAt: new Date().toISOString(),
  });

  console.log(
    "Seed complete: 3 users (Chita + Lerato are friends with each other), 2 posts, 1 album."
  );
  await client.close();
}

seed();
