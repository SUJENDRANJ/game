const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  icon: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  stock: { type: Number, default: 999 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", RewardSchema);
