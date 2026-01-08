import express from 'express';
import { protect, trainer } from '../middleware/auth.js';
import {
  createPlan,
  getMyPlans,
  getAllPlans,
  getTrainerMembers,
  addCustomExercise,
  getMyExercises,
  deleteCustomExercise,
  sendClientMessage,
  deletePlan
} from '../controllers/trainerController.js';

import { uploadVideo } from '../middleware/upload.js';

const router = express.Router();

// Public-ish (Protected but for all users)
router.get('/plans/all', protect, getAllPlans);

// Trainer Only Routes
router.use(protect);
router.use(trainer);

router.post('/plans', createPlan);
router.get('/plans', getMyPlans);
router.delete('/plans/:id', deletePlan);
router.get('/members', getTrainerMembers);
router.get('/media', getMyExercises);
router.post('/media', uploadVideo.single('video'), addCustomExercise);
router.delete('/media/:id', deleteCustomExercise);
router.post('/message', sendClientMessage);

export default router;
