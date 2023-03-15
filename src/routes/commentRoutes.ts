import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import commentController from '../controllers/commentController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The unique identifier for the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         postId:
 *           type: integer
 *           format: int64
 *           description: The ID of the post that the comment belongs to
 *         userId:
 *           type: integer
 *           format: int64
 *           description: The ID of the user who created the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was last updated
 *       example:
 *         id: 1
 *         content: A test comment
 *         postId: 1
 *         userId: 2
 *         createdAt: 2023-03-14T11:46:06.238Z
 *         updatedAt: 2023-03-14T11:56:06.238Z
 */


/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     tags:
 *        - Comments
 *     responses:
 *       200:
 *         description: Returns an array of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.get('/', commentController.getAll);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags:
 *        - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to retrieve
 *     responses:
 *       200:
 *         description: Returns the comment with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', commentController.getById);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *        - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                  type: string
 *               postId:
 *                  type: integer
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, commentController.create);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags:
 *        - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request body or comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, commentController.update);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags:
 *        - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized to delete comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, commentController.delete);


export {router as commentRoutes};
