import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import User from '../models/user';

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
    const { userId } = decodedToken as { userId: string };
  
    try {
      const user = await User.findByPk(userId);
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
