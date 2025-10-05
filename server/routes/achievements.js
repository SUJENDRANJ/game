const express = require("express");
const Achievement = require("../models/Achievement");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all active achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new achievement
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, icon, points } = req.body;

    const achievementId = `ach_${Date.now()}`;
    const achievement = new Achievement({
      id: achievementId,
      title,
      description,
      icon,
      points,
    });

    await achievement.save();

    // Emit via Socket.IO
    req.app.get("io").emit("achievementCreated", achievement);

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Award an achievement to a user
router.post("/award/:achievementId", authMiddleware, async (req, res) => {
  try {
    const { achievementId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    const achievement = await Achievement.findOne({ id: achievementId });

    if (!user || !achievement) {
      return res.status(404).json({ message: "User or achievement not found" });
    }

    if (user.achievements.includes(achievementId)) {
      return res.status(400).json({ message: "Achievement already awarded" });
    }

    user.achievements.push(achievementId);
    user.points += achievement.points;
    user.level = Math.floor(user.points / 100) + 1;

    await user.save();

    req.app.get("io").emit("achievementAwarded", {
      userId: user._id,
      achievementId,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        level: user.level,
        achievements: user.achievements,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete an achievement
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Achievement.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false }
    );

    req.app.get("io").emit("achievementDeleted", req.params.id);

    res.json({ message: "Achievement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
