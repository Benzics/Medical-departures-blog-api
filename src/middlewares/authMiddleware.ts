import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../database';
import { User } from '../types/express';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken: string | JwtPayload;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  // Type assertion
  const { id } = decodedToken as { id: number };

  try {
    const results: User[] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = results[0];
    if (!user) {
      return res.status(401).send({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Server error' });
  }
};

export default authMiddleware;