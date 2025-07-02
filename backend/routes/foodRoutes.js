import express from 'express';
import { createFoodPost } from '../controllers/foodController.js';
import upload from '../utils/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/posts/create
router.post('/create', authMiddleware, upload.single('photo'), createFoodPost);

export default router;
