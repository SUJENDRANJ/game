import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };
    (req as any).userId = decoded.userId;
    (req as any).isAdmin = decoded.isAdmin;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
