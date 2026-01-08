import express from 'express';
import {
  getUserPoints,
  getLeaderboard,
  getBadges,
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/points', getUserPoints);
router.get('/leaderboard', getLeaderboard);
router.get('/badges', getBadges);

export default router;






