import { Router } from "express";
import postController from "../controllers/postController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         userId:
 *           type: integer
 *           description: The id of the user who created the post
 *       example:
 *         id: 1
 *         title: My first post
 *         content: This is the content of my first post.
 *         userId: 1
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

router.get('/', postController.getAll);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post("/", authMiddleware, postController.create);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get("/:id", postController.getById);


/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.put("/:id", authMiddleware, postController.update);

/**
 * Deletes a post by ID
 * 
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Deletes a post by ID
 *     description: Deletes the post with the specified ID, if it exists and is owned by the authenticated user.
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, postController.delete);

export { router as postRoutes};