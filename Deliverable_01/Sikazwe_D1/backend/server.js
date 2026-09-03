import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Auth Endpoints

app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;

  console.log("Sign-in request received:", { email, password });

  res.status(200).json({
    message: "Sign-in successful (stubbed - no real auth yet).",
    user: {
      id: 1,
      username: "chitambala",
      email: email,
    },
  });
});

app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;

  console.log("Sign-up request received:", { username, email, password });

  res.status(201).json({
    message: "Sign-up successful (stubbed - no real database yet).",
    user: {
      id: Date.now(),
      username: username,
      email: email,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://loocalhost:${PORT}`);
});
