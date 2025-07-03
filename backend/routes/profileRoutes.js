import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { editName, changePassword } from '../controllers/profileController.js';

const router = express.Router();

// PATCH /api/profile/edit-name
router.patch('/edit-name', authMiddleware, editName);
// PATCH /api/profile/change-password
router.patch('/change-password', authMiddleware, changePassword);

export default router;
