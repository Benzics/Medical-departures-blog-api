import { Request, Response } from 'express';
import db from '../database';

interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

class CommentController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const comments: Comment[] = await db.query('SELECT * FROM comments');
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const comment: Comment[] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
      if (comment.length === 0) {
        res.status(404).json({ error: 'Comment not found' });
      } else {
        res.status(200).json(comment[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { content, postId } = req.body;

    if(!postId || !content) {
        res.status(400).json({message: 'PostId and content is required'});
        return;
    }

    const userId = req.user?.id;
    try {
      const result = await db.query('INSERT INTO comments (content, postId, userId) VALUES (?, ?, ?)', [
        content,
        postId,
        userId,
      ]);
      const newCommentId: number = result.insertId;
      const newComment: Comment[] = await db.query('SELECT * FROM comments WHERE id = ?', [newCommentId]);
      res.status(201).json(newComment[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    const { content } = req.body;
    if(!content) {
        res.status(400).json({message: 'Content is required'});
        return;
    }
    try {
      const result = await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Comment not found' });
      } else {
        const updatedComment: Comment[] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
        res.status(200).json(updatedComment[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const result = await db.query('DELETE FROM comments WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Comment not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CommentController();
