import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { login, refreshToken, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', authMiddleware, refreshToken);

export default router;
