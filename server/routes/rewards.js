const express = require("express");
const Reward = require("../models/Reward");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all active rewards
router.get("/", async (req, res) => {
  try {
    const rewards = await Reward.find({ isActive: true });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new reward
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, cost, icon, stock } = req.body;

    const rewardId = `rwd_${Date.now()}`;
    const reward = new Reward({
      id: rewardId,
      name,
      description,
      cost,
      icon,
      stock: stock || 999,
    });

    await reward.save();

    req.app.get("io").emit("rewardCreated", reward);

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Purchase a reward
router.post("/purchase/:rewardId", authMiddleware, async (req, res) => {
  try {
    const { rewardId } = req.params;
    const userId = req.userId; // from authMiddleware

    const user = await User.findById(userId);
    const reward = await Reward.findOne({ id: rewardId });

    if (!user || !reward) {
      return res.status(404).json({ message: "User or reward not found" });
    }

    if (user.points < reward.cost) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    user.points -= reward.cost;
    user.rewardsPurchased.push(rewardId);
    reward.stock -= 1;

    await user.save();
    await reward.save();

    req.app.get("io").emit("rewardPurchased", {
      userId: user._id,
      rewardId,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        level: user.level,
        rewardsPurchased: user.rewardsPurchased,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete a reward
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Reward.findOneAndUpdate({ id: req.params.id }, { isActive: false });

    req.app.get("io").emit("rewardDeleted", req.params.id);

    res.json({ message: "Reward deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
