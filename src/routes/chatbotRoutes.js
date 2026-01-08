import express from 'express';
import { chat, getHistory } from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/chat', chat);
router.get('/history', getHistory);

export default router;






