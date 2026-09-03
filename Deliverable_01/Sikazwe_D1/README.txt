Dog-Eared IMY220 Deliverable 1

GitHub repository: https://github.com/CJM007/IMY220-Project.git

0. Download Deliverable_01

How to build and run with Docker:

1. Backend:
   cd backend
   docker build -t dogeared-backend .
   docker run -p 3000:3000 dogeared-backend

2. Frontend (in a separate terminal):
   cd frontend
   docker build -t dogeared-frontend .
   docker run -p 5173:5173 dogeared-frontend

3. Open http://localhost:5173 in the browser.