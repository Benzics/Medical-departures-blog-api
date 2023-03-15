import { Request, Response } from 'express';
import db from '../database';

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

class PostController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const posts: Post[] = await db.query('SELECT * FROM posts');
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const post: Post[] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
      if (post.length === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(200).json(post[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { title, content } = req.body;

    if(!title || !content) {
      res.status(400).json({message: 'Title and content is required'});
      return;
    }

    const userId = req.user?.id;
    try {
      const result = await db.query('INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)', [
        title,
        content,
        userId,
      ]);
      const newPostId: number = result.insertId;
      const newPost: Post[] = await db.query('SELECT * FROM posts WHERE id = ?', [newPostId]);
      res.status(201).json(newPost[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    const { title, content } = req.body;

    if(!title || !content) {
      res.status(400).json({message: 'Title and content is required'});
      return;
    }
    
    try {
      const result = await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        const updatedPost: Post[] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
        res.status(200).json(updatedPost[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const result = await db.query('DELETE FROM posts WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new PostController();
