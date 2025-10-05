import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  isActive: boolean;
  stock: number;
  createdAt: Date;
}

const RewardSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  icon: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  stock: { type: Number, default: 999 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReward>('Reward', RewardSchema);
