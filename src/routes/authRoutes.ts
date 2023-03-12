import { Router } from "express";
import { signUp, signIn } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Email address is already in use
 *       500:
 *         description: Internal server error
 */
router.post("/signup", signUp);


/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in to an existing user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Incorrect email or password
 *       500:
 *         description: Internal server error
 */
router.post("/signin", signIn);

export { router as authRoutes };