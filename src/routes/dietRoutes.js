import express from 'express';
import {
  generateDiet,
  getDiets,
  getDiet,
  updateDiet,
  deleteDiet,
  toggleItemCompletion,
} from '../controllers/dietController.js';
import { protect } from '../middleware/auth.js';
// Removed subscription check - diets are free for all users
import { dietValidator } from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/generate', dietValidator, handleValidationErrors, generateDiet);
router.get('/', getDiets);
router.get('/:id', getDiet);
router.put('/:id', updateDiet);
router.patch('/:id/meal/:dayId/:mealType/item/:itemIndex/toggle', toggleItemCompletion);
router.delete('/:id', deleteDiet);

export default router;
