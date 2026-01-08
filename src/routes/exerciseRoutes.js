import express from 'express';
import {
    getExercises,
    getExerciseById,
    getAiExplanation,
    submitFeedback,
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getExercises);
router.get('/:id', getExerciseById);
router.post('/ask-ai', protect, getAiExplanation);
router.post('/feedback', protect, submitFeedback);

export default router;
