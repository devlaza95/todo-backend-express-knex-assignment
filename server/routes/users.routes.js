import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as usersController from '../controllers/users.controller.js';

const router = express.Router();

router.get('/me', authMiddleware, usersController.getMe);

export default router;
