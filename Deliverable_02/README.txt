Dog-Eared — IMY220 Deliverable 2
==================================

GitHub repository: https://github.com/CJM007/IMY220-Project

MongoDB Atlas connection string: 
See backend/.env

SETUP — before running for the first time
------------------------------------------
1. Create backend/.env (copy backend/.env.example and fill in real values):
     MONGO_URI=<your real connection string>
     DB_NAME=dogeared

2. Seed the database (run locally once, not inside Docker):
     cd backend
     npm install
     npm run seed

   This creates 3 users (chitambala + lerato are already friends with each
   other; tumelo has no friends yet, useful for testing "add friend"),
   2 posts, and 1 album.

   Test login: test@test.com / test1234


HOW TO BUILD AND RUN WITH DOCKER
----------------------------------
1. Backend (from the project root):
     cd backend
     docker build -t dogeared-backend .
     docker run -p 3000:3000 --env-file .env dogeared-backend

   NOTE: --env-file .env is required. The .env file is intentionally not
   copied into the Docker image or public Github repo (see backend/.dockerignore) because it
   holds the real database password and the repo is public — it's passed
   in at container-start time instead, the same way the connection string
   itself should never be hardcoded in source.

2. Frontend (in a separate terminal):
     cd frontend
     docker build -t dogeared-frontend .
     docker run -p 5173:5173 dogeared-frontend

3. Open http://localhost:5173 in the browser.


DIRECTORY STRUCTURE
---------------------
/backend
  server.js          - Express app entry point, mounts all routes
  db.js              - MongoDB connection (native "mongodb" driver)
  seed.js            - populates the database with required test data
  /models            - exported DB query functions, one file per collection
  /routes            - Express route handlers, thin wrappers around /models

/frontend
  /src
    api.js           - single shared fetch wrapper + one function per API call
    App.jsx           - routes
    index.css         - Tailwind directives + theme (colours/fonts in tailwind.config.js)
    /components        - reusable presentational components
    /pages             - one component per route (Splash, Home, Profile, Post, Album)
