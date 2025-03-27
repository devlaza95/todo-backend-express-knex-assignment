import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {createWorkspace} from "../controllers/workspaces.controller.js";
const router = express.Router();

router.post('/organization/:organizationId', authMiddleware, createWorkspace);

export default router;
