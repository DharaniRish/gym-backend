import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['member', 'trainer', 'admin']).withMessage('Invalid role'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const workoutValidator = [
  body('goal').isIn(['fat_loss', 'muscle_gain', 'strength', 'endurance']).withMessage('Invalid goal'),
  body('daysPerWeek').isInt({ min: 1, max: 7 }).withMessage('Days per week must be between 1 and 7'),
  body('height').optional().isFloat({ min: 100, max: 250 }).withMessage('Invalid height'),
  body('weight').optional().isFloat({ min: 30, max: 300 }).withMessage('Invalid weight'),
  body('age').optional().isInt({ min: 10, max: 120 }).withMessage('Invalid age'),
];

export const dietValidator = [
  body('goal').isIn(['fat_loss', 'muscle_gain', 'strength', 'endurance', 'general']).withMessage('Invalid goal'),
  body('preference').isIn(['vegetarian', 'non_vegetarian', 'vegan']).withMessage('Invalid preference'),
  body('budget').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid budget'),
  body('duration').optional().isInt({ min: 1, max: 30 }).withMessage('Invalid duration'),
];






