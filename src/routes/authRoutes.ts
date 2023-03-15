import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The plain text password of the user
 *       example:
 *         id: 1
 *         name: user
 *         email: user@medicaldepartures.com
 *         password: 123456
 */


/**
 * @swagger
 * /api/auth/signup:
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
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *                          description: JWT token for user authentication
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Email address is already in use
 *       500:
 *         description: Internal server error
 */
router.post("/signup", authController.register);


/**
 * @swagger
 * /api/auth/signin:
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
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *                          description: JWT token for user authentication
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Incorrect email or password
 *       500:
 *         description: Internal server error
 */
router.post("/signin", authController.login);

export { router as authRoutes };