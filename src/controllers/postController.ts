import { Response, NextFunction } from "express";
import { Post } from "../models/post";
import { validationResult } from "express-validator";
import { UserRequest as Request } from "../interfaces/UserRequestInterface";

/**
 * Controller method to handle post creation
 */
export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    // Check if user is authenticated
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Create new post
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    });

    res.json({ post });
  } catch (err) {
   
    next(err);
  }
};

/**
 * Controller method to handle retrieving a single post
 */
export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json(post);
  } catch (err) {
   
    next(err);
  }
};

/**
 * Controller method to handle updating a post
 */
export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Check if user is authorized to update the post
    if (post.userId !== req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    post.title = req.body.title;
    post.content = req.body.content;

    await post.save();

    res.json(post);
  } catch (err) {
   
    next(err);
  }
};

/**
 * Controller method to handle deleting a post
 */
export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Check if user is authorized to delete the post
    if (post.userId !== req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await post.destroy();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
   
    next(err);
  }
};
