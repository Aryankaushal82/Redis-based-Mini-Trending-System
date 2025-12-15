import express from 'express';
import topicsRouter from './topics.router';
import authRouter from './auth.router';
import postsRouter from './posts.router';

const router = express.Router();

router.use("/topics", topicsRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);

export default router;
