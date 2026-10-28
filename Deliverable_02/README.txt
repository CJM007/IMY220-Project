DOG-EARED — IMY 220 Deliverable 3 (Final)
==========================================

A cozy photo-sharing site for people who read books: post photos of what
you're reading, comment, build albums, follow friends, and (as an admin)
moderate the whole thing.

------------------------------------------------------------
1. WHAT YOU NEED FIRST
------------------------------------------------------------
- Docker Desktop (or the Docker CLI + daemon) installed and running.
- A MongoDB Atlas cluster (or any reachable MongoDB instance) and its
  connection string.
- Node.js 20+ installed locally ONLY if you want to run things outside
  Docker (seeding/exporting the database is easiest done locally).

------------------------------------------------------------
2. ONE-TIME SETUP
------------------------------------------------------------
1. Copy backend/.env.example to backend/.env and fill in:
     MONGO_URI=<your Atlas connection string>
     DB_NAME=dogeared
     SESSION_SECRET=<any long random string>
     PORT=3000

   backend/.env is in .gitignore and .dockerignore on purpose — never
   commit real database credentials to a public GitHub repo.

2. Install dependencies locally (only needed for seeding/exporting,
   NOT required for Docker itself):
     cd backend && npm install
     cd ../frontend && npm install

3. Seed the database with test data (>= 9 users incl. one admin,
   >= 14 posts, 4 albums, 5 report reasons, a pending verification
   request, and a post already past the "hidden" report threshold):
     cd backend
     npm run seed

   Every seeded account's password is: password123
   The admin account is: chitambala@dogeared.app

------------------------------------------------------------
3. RUNNING WITH DOCKER (required for marks)
------------------------------------------------------------
Easiest — from the project root, with docker-compose.yml:

     docker compose up --build

   Frontend: http://localhost:5173
   Backend:  http://localhost:3000

Or with plain Docker CLI, from the project root:

     docker build -t dogeared-backend ./backend
     docker run -d -p 3000:3000 --env-file ./backend/.env \
       -e FRONTEND_ORIGIN=http://localhost:5173 --name dogeared-backend \
       dogeared-backend

     docker build -t dogeared-frontend ./frontend
     docker run -d -p 5173:5173 -e VITE_API_URL=http://localhost:3000 \
       --name dogeared-frontend dogeared-frontend

To stop:
     docker compose down
   or
     docker stop dogeared-backend dogeared-frontend

------------------------------------------------------------
4. EXPORTING THE DATABASE FOR SUBMISSION
------------------------------------------------------------
The checklist/declaration form requires the ClickUP submission to
include exported database files (JSON). Run this locally (not inside
Docker) after seeding:

     cd backend
     npm run export-db

This writes one JSON file per collection to backend/db-export/. Include
that folder in your ClickUP zip.

------------------------------------------------------------
5. WHAT'S IN THE SUBMISSION ZIP
------------------------------------------------------------
- backend/Dockerfile and backend/.dockerignore (uploaded to ClickUP
  separately per the checklist form, in addition to being in the repo)
- backend/db-export/*.json (exported database)
- Everything else in this folder, compressed, inside a folder named
  Position_Surname as the checklist form asks for.

NOT included (and should never be committed to GitHub either):
- backend/.env (real credentials)
- node_modules in either folder
- backend/uploads/* (uploaded images — regenerate by using the app,
  or re-seed; only .gitkeep is tracked)

------------------------------------------------------------
6. FEATURE MAP (for the demo / declaration form)
------------------------------------------------------------
- Splash page with login/register, parallax hero (bonus)
- Session/cookie-based auth (express-session, httpOnly cookie) — not
  localStorage; refresh the page while logged in to see it persist
- Home feed: local (friends) vs global, sort by newest or most
  commented, favourite users bubble to the top (bonus), hidden-posts
  viewer for posts reported more than twice
- Search: users/posts/albums, tolerant of incomplete and misspelled
  terms (bonus), with live autocomplete (bonus); clicking a hashtag
  re-runs the same search
- Posts: create with drag-and-drop image upload (bonus), edit/delete
  your own, comment, report (reasons come from the database, not
  hardcoded), album membership shown
- Albums: create/edit/delete, add/remove posts, hashtag suggestions
  pulled from your own post history (bonus); deleting a post that was
  an album's only post deletes the album too (bonus)
- Profiles: edit bio/username/profile picture (drag-and-drop, bonus;
  randomised placeholder avatar when no picture is set, bonus),
  friends list, add/remove friends, favourite a friend (bonus),
  request account verification
- Admin (sign in as chitambala@dogeared.app): edit/delete any post,
  album, or user account; view all reported posts and dismiss or act
  on them; add/remove report reasons; approve/decline verification
  requests; automatic flag when a user over-reports (bonus); users get
  a notification banner when an admin removes their content (bonus)
- Light/dark mode toggle in the header (bonus), persisted per browser
- Responsive layout (Tailwind) from phone width up

------------------------------------------------------------
7. KNOWN LIMITATIONS / HONEST NOTES
------------------------------------------------------------
- Sessions use express-session's default in-memory store, which is
  fine for a single-container demo but resets if the backend container
  restarts (everyone gets logged out). That's an acceptable tradeoff
  for a course project; a production app would use a store backed by
  Mongo or Redis.
- GitHub branching (bonus) is a workflow you demonstrate in your own
  repository history (feature branches + PRs/merges) — there's nothing
  to "build" for it, just make sure your actual repo shows it.
- Uploaded images are stored on the backend container's local disk
  (backend/uploads), not in MongoDB or cloud storage. That's standard
  for a course project but won't survive a container rebuild — reseed
  or re-upload after rebuilding if you need the demo data back.
