import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('_id email name points level achievements')
      .sort({ points: -1 })
      .limit(100);

    const leaderboard = users.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      points: user.points,
      level: user.level,
      achievements: user.achievements
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
