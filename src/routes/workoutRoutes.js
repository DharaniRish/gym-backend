import express from 'express';
import {
  generateWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  updateSession,
  completeWorkout,
  deleteWorkout,
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';
// Removed subscription check - workouts are free for all users
import { workoutValidator } from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/generate', workoutValidator, handleValidationErrors, generateWorkout);
router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.put('/:id/session', updateSession);
router.post('/:id/complete', completeWorkout);
router.delete('/:id', deleteWorkout);

export default router;
