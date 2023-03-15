import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateAuthToken } from '../utils/authUtils';
import db from '../database';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    try {
      const users: User[] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const user = users[0];
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const token = generateAuthToken(user.id);
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    try {
      const existingUsers: User[] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const result = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        hashedPassword,
      ]);
      const newUserId: number = result.insertId;
      const newUser: User[] = await db.query('SELECT * FROM users WHERE id = ?', [newUserId]);

      const token = generateAuthToken(newUserId);
      res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AuthController();
