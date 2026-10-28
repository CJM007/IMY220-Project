import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { connectDB, client } from "./db.js";

dotenv.config();

const AVATAR_COLORS = [
  "#C4654A", "#7D8C5C", "#B08A3E", "#5C7A8C",
  "#9C5C7A", "#6B5C9C", "#8C7A5C", "#5C9C7A",
];

function cover(seed) {
  return `https://picsum.photos/seed/${seed}/640/420`;
}

async function seed() {
  const db = await connectDB();

  console.log("Clearing existing collections...");
  await Promise.all([
    db.collection("users").deleteMany({}),
    db.collection("posts").deleteMany({}),
    db.collection("albums").deleteMany({}),
    db.collection("reportReasons").deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);

  const userDefs = [
    { username: "chitambala", email: "chitambala@dogeared.app", bio: "Fantasy and sci-fi reader. Currently rereading the Dune saga.", isAdmin: true },
    { username: "lerato", email: "lerato@dogeared.app", bio: "Romance and literary fiction. Will talk your ear off about Toni Morrison.", isAdmin: false },
    { username: "tumelo", email: "tumelo@dogeared.app", bio: "Non-fiction and history buff. Audiobooks count as reading.", isAdmin: false },
    { username: "naledi", email: "naledi@dogeared.app", bio: "YA and graphic novels. Librarian in training.", isAdmin: false },
    { username: "kagiso", email: "kagiso@dogeared.app", bio: "Thrillers and mystery. Always guessing the ending wrong.", isAdmin: false },
    { username: "zanele", email: "zanele@dogeared.app", bio: "Poetry and short stories. Annotates everything.", isAdmin: false },
    { username: "thabo", email: "thabo@dogeared.app", bio: "Classic literature. Slowly working through the Russians.", isAdmin: false },
    { username: "amahle", email: "amahle@dogeared.app", bio: "Self-help and biographies. Five books into 2026 already.", isAdmin: false },
    { username: "sipho", email: "sipho@dogeared.app", bio: "Horror and weird fiction. Reads with the lights on.", isAdmin: false, isVerified: true },
  ];

  const users = [];
  for (let i = 0; i < userDefs.length; i++) {
    const def = userDefs[i];
    const doc = {
      username: def.username,
      email: def.email,
      passwordHash,
      bio: def.bio,
      profileImage: null,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      isAdmin: !!def.isAdmin,
      isVerified: !!def.isVerified,
      verificationRequested: false,
      friends: [],
      friendRequests: [],
      favorites: [],
      notifications: [],
      createdAt: new Date(Date.now() - (userDefs.length - i) * 86400000),
    };
    const result = await db.collection("users").insertOne(doc);
    users.push({ ...doc, _id: result.insertedId });
  }

  const byName = Object.fromEntries(users.map((u) => [u.username, u]));

  // Friendships (mutual)
  const friendPairs = [
    ["chitambala", "lerato"],
    ["chitambala", "tumelo"],
    ["chitambala", "naledi"],
    ["lerato", "zanele"],
    ["kagiso", "thabo"],
    ["naledi", "amahle"],
    ["tumelo", "sipho"],
  ];
  for (const [a, b] of friendPairs) {
    await db.collection("users").updateOne(
      { _id: byName[a]._id },
      { $addToSet: { friends: byName[b]._id } }
    );
    await db.collection("users").updateOne(
      { _id: byName[b]._id },
      { $addToSet: { friends: byName[a]._id } }
    );
  }

  // A couple of favourites, so the bonus feed-sorting is visible on demo.
  await db.collection("users").updateOne(
    { _id: byName.chitambala._id },
    { $addToSet: { favorites: byName.lerato._id } }
  );

  // A pending verification request, so the admin dashboard has something to act on.
  await db.collection("users").updateOne(
    { _id: byName.kagiso._id },
    { $set: { verificationRequested: true } }
  );

  // Report reasons
  const reasonDefs = [
    "Spam or misleading",
    "Spoilers without a warning",
    "Harassment or hate speech",
    "Not related to books",
    "Copyright or plagiarism concern",
  ];
  const reasons = [];
  for (const text of reasonDefs) {
    const result = await db.collection("reportReasons").insertOne({ text, createdAt: new Date() });
    reasons.push({ _id: result.insertedId, text });
  }

  const postDefs = [
    { user: "chitambala", description: "Finally finished Dune Messiah. The pacing is so different from the first book, but Paul's arc completely wrecked me.", hashtags: ["dune", "scifi", "frankherbert"] },
    { user: "chitambala", description: "Picked up Project Hail Mary on a whim and could not put it down. Andy Weir does it again.", hashtags: ["scifi", "projecthailmary", "andyweir"] },
    { user: "lerato", description: "Song of Solomon by Toni Morrison deserves every bit of its reputation. That ending stayed with me for days.", hashtags: ["tonimorrison", "literaryfiction", "classics"] },
    { user: "lerato", description: "Started Beloved for the first time. Reading it slowly on purpose because the prose is so dense.", hashtags: ["tonimorrison", "beloved"] },
    { user: "tumelo", description: "Sapiens by Yuval Noah Harari changed how I think about the last 10,000 years. Highly recommend the audiobook.", hashtags: ["nonfiction", "history", "sapiens"] },
    { user: "tumelo", description: "Deep dive into The Guns of August this week. WWI history hits differently when you know how it ends.", hashtags: ["history", "wwi"] },
    { user: "naledi", description: "Reread Persepolis for book club and noticed so many details I missed the first time around.", hashtags: ["graphicnovel", "persepolis", "memoir"] },
    { user: "naledi", description: "The Hunger Games holds up incredibly well a decade later. Starting Catching Fire tonight.", hashtags: ["ya", "hungergames"] },
    { user: "kagiso", description: "Gone Girl absolutely wrecked my expectations. Did not see that twist coming at all.", hashtags: ["thriller", "gonegirl", "mystery"] },
    { user: "kagiso", description: "The Silent Patient kept me up way too late. Unreliable narrators are my favourite trope.", hashtags: ["thriller", "mystery"] },
    { user: "zanele", description: "Spent the evening with Mary Oliver's Devotions. Her nature poems feel like a reset button.", hashtags: ["poetry", "maryoliver"] },
    { user: "thabo", description: "Crime and Punishment is slow going but Dostoevsky's grip on guilt and paranoia is unmatched.", hashtags: ["classics", "dostoevsky", "russianlit"] },
    { user: "amahle", description: "Atomic Habits gave me three concrete changes I'm actually sticking with this month.", hashtags: ["selfhelp", "atomichabits"] },
    { user: "sipho", description: "The Haunting of Hill House is still the best haunted house novel ever written. Shirley Jackson knew exactly what she was doing.", hashtags: ["horror", "shirleyjackson"] },
  ];

  const posts = [];
  for (let i = 0; i < postDefs.length; i++) {
    const def = postDefs[i];
    const doc = {
      userId: byName[def.user]._id,
      description: def.description,
      hashtags: def.hashtags,
      image: cover(`book-${i}`),
      comments: [],
      reports: [],
      createdAt: new Date(Date.now() - (postDefs.length - i) * 3600000 * 5),
    };
    const result = await db.collection("posts").insertOne(doc);
    posts.push({ ...doc, _id: result.insertedId });
  }

  const postByDesc = (snippet) => posts.find((p) => p.description.includes(snippet));

  // A few comments so "shown in a logical way if there are many" has something to render.
  await db.collection("posts").updateOne(
    { _id: postByDesc("Dune Messiah")._id },
    {
      $push: {
        comments: {
          $each: [
            { _id: new ObjectId(), userId: byName.lerato._id, text: "Adding this to my list, loved the first book!", createdAt: new Date() },
            { _id: new ObjectId(), userId: byName.tumelo._id, text: "Paul's arc genuinely wrecked me too.", createdAt: new Date() },
          ],
        },
      },
    }
  );

  await db.collection("posts").updateOne(
    { _id: postByDesc("Gone Girl")._id },
    {
      $push: {
        comments: {
          $each: [
            { _id: new ObjectId(), userId: byName.thabo._id, text: "That twist lives in my head rent free.", createdAt: new Date() },
          ],
        },
      },
    }
  );

  // One post reported enough times to demonstrate the hide-after-2-reports rule.
  const reportedPost = postByDesc("Crime and Punishment");
  await db.collection("posts").updateOne(
    { _id: reportedPost._id },
    {
      $push: {
        reports: {
          $each: [
            { _id: new ObjectId(), userId: byName.lerato._id, reasonId: reasons[1]._id, reasonText: reasons[1].text, flaggedAsAbuse: false, createdAt: new Date() },
            { _id: new ObjectId(), userId: byName.naledi._id, reasonId: reasons[1]._id, reasonText: reasons[1].text, flaggedAsAbuse: false, createdAt: new Date() },
            { _id: new ObjectId(), userId: byName.kagiso._id, reasonId: reasons[1]._id, reasonText: reasons[1].text, flaggedAsAbuse: false, createdAt: new Date() },
          ],
        },
      },
    }
  );

  // Albums
  const albumDefs = [
    { user: "chitambala", name: "Sci-Fi Favourites", description: "The space opera and hard sci-fi books I keep recommending.", hashtags: ["scifi"], postDescs: ["Dune Messiah", "Project Hail Mary"] },
    { user: "lerato", name: "Toni Morrison Deep Dive", description: "Working through her whole bibliography this year.", hashtags: ["tonimorrison"], postDescs: ["Song of Solomon", "Beloved"] },
    { user: "kagiso", name: "Twisty Thrillers", description: "Books that made me gasp out loud.", hashtags: ["thriller"], postDescs: ["Gone Girl", "The Silent Patient"] },
    { user: "naledi", name: "YA & Graphic Novels", description: "Quick reads for busy weeks.", hashtags: ["ya", "graphicnovel"], postDescs: ["Persepolis", "The Hunger Games"] },
  ];

  for (const def of albumDefs) {
    const postIds = def.postDescs
      .map((snippet) => postByDesc(snippet))
      .filter(Boolean)
      .map((p) => p._id);
    await db.collection("albums").insertOne({
      userId: byName[def.user]._id,
      name: def.name,
      description: def.description,
      hashtags: def.hashtags,
      postIds,
      createdAt: new Date(),
    });
  }

  console.log(
    `Seed complete: ${users.length} users (1 admin: chitambala), ${posts.length} posts, ${albumDefs.length} albums, ${reasons.length} report reasons.`
  );
  console.log("All users share the password: password123");
  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
