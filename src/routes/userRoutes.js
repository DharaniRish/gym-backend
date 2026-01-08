import express from 'express';
import { getProfile, updateProfile, getUserStats, uploadProfileImage, subscribeToPlan, cancelPlan } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getUserStats);

// 🖼️ Upload Profile Image
router.post('/profile-image', upload.single('image'), uploadProfileImage);

// 💳 Subscribe to Plan
router.post('/subscribe', subscribeToPlan);
router.post('/cancel-plan', cancelPlan);

export default router;
