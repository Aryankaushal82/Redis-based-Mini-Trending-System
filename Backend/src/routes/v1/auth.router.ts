import express from 'express';
import { signup, login, getMe } from '../../controllers/auth.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", verifyToken, getMe);

export default authRouter;
