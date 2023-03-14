import { Response, NextFunction } from 'express';
import { UserRequest as Request } from '../interfaces/UserRequestInterface';
import Comment from '../models/comment';

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, postId, userId } = req.body;

    // Check that all required fields are present
    if (!content || !postId || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new comment
    const comment = await Comment.create({
      content,
      postId,
      userId,
    });

    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await Comment.findAll();
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check that content is present
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
  
      const comment = await Comment.findByPk(id);
  
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // Check that the logged in user owns the comment
      if (req.user && comment.userId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      await comment.destroy();
  
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };
  
