import { Request, Response } from "express";
import { generateAuthToken } from "../utils/authUtils";
import { User } from "../models/user";
import { hashPassword, comparePassword } from "../utils/passwordUtils";

/**
 * Controller method to handle user signup
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

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
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Controller method to handle user signin
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

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
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
