import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { editName, changePassword, deleteAccount, getMyPosts, getClaimedPosts } from '../controllers/profileController.js';

const router = express.Router();

// PATCH /api/profile/edit-name
router.patch('/edit-name', authMiddleware, editName);
// PATCH /api/profile/change-password
router.patch('/change-password', authMiddleware, changePassword);
// DELETE /api/profile/delete-account
router.delete('/delete-account', authMiddleware, deleteAccount);
// GET /api/profile/my-posts
router.get('/my-posts', authMiddleware, getMyPosts);
// GET /api/profile/claimed-posts
router.get('/claimed-posts', authMiddleware, getClaimedPosts);

export default router;
