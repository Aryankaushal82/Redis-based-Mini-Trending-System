import express from 'express';
import { createPost, getFeed, likePost } from '../../controllers/posts.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const postsRouter = express.Router();

postsRouter.post("/", verifyToken, createPost);
postsRouter.get("/", verifyToken, getFeed); // Optional auth for feed to see likes
postsRouter.post("/:id/like", verifyToken, likePost);

export default postsRouter;
