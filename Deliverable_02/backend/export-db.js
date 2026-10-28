// Exports every collection in the database to a JSON file under
// backend/db-export/ -- this folder is what gets zipped into the
// ClickUP submission alongside the Dockerfile/.dockerignore, per the
// "Exported database is included in ClickUP submission" rubric item.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, client } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "db-export");

async function exportDB() {
  const db = await connectDB();
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    const docs = await db.collection(name).find().toArray();
    fs.writeFileSync(
      path.join(outDir, `${name}.json`),
      JSON.stringify(docs, null, 2)
    );
    console.log(`Exported ${docs.length} documents from "${name}" to db-export/${name}.json`);
  }

  await client.close();
}

exportDB().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
