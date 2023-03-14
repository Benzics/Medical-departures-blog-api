import { Request, Response, NextFunction } from "express";
import { generateAuthToken } from "../utils/authUtils";
import { User } from "../models/user";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { validationResult } from "express-validator";

/**
 * Controller method to handle user signup
 */
export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate JWT token and send response
    const token = generateAuthToken(user.id);
    res.json({ token });
  } catch (err) {
   next(err);
  }
};

/**
 * Controller method to handle user signin
 */
export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Compare passwords and generate JWT token
    const passwordsMatch = await comparePassword(password, user.password);
    if (!passwordsMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateAuthToken(user.id);
    res.json({ token });
  } catch (err) {
   next(err);
  }
};
