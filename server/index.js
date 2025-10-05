const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const achievementsRoutes = require("./routes/achievements");
const rewardsRoutes = require("./routes/rewards");
const leaderboardRoutes = require("./routes/leaderboard");

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Attach socket.io to app
app.set("io", io);

// Connect database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Socket.io setup
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
