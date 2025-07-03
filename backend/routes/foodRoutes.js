import express from 'express';
import { createFoodPost, getFoodPostsByCity, claimFoodPost,} from '../controllers/foodController.js';
import upload from '../utils/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/posts/create
router.post('/create', authMiddleware, upload.single('photo'), createFoodPost);
// GET /api/posts?city=CityName
router.get('/', authMiddleware, getFoodPostsByCity); //Fetch unclaimed posts
// PATCH /api/posts/:id/claim
router.patch('/:id/claim', authMiddleware, claimFoodPost); //Claim post

export default router;
