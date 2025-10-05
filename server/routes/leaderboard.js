const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get leaderboard
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("_id email name points level achievements")
      .sort({ points: -1 })
      .limit(100);

    const leaderboard = users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      points: user.points,
      level: user.level,
      achievements: user.achievements,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
