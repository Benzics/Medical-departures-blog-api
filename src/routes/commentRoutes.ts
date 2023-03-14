import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
} from '../controllers/commentController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getComments);
router.get('/:id', getCommentById);
router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

export {router as commentRoutes};
