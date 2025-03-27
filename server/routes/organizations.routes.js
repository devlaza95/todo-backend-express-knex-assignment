import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createOrganization,
    getUserOrganization,
    getUserOrganizations
} from "../controllers/organizations.controller.js";
const router = express.Router();

router.post('/', authMiddleware, createOrganization);
router.get('/', authMiddleware, getUserOrganizations);
router.get('/:id', authMiddleware, getUserOrganization);

module.exports = router;
